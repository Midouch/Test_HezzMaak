-- =====================================================================
--  HEZ MAAK - AREA PRO (trasportatori e aziende)
--  Da eseguire UNA volta: Supabase > SQL Editor > New query > Run.
--  Si può rieseguire senza danni (usa "if not exists" / "or replace").
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. TABELLE
-- ---------------------------------------------------------------------

create table if not exists public.pro_accounts (
  owner_id      uuid primary key references auth.users(id) on delete cascade,
  company_name  text not null,
  phone         text,
  whatsapp      text,
  email         text,
  address       text,
  vat_id        text,
  logo_url      text,
  currency      text not null default 'EUR',
  receipt_note  text,
  plan          text not null default 'free' check (plan in ('free','pro','business')),
  plan_until    timestamptz,
  created_at    timestamptz not null default now()
);

create table if not exists public.pro_clients (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  phone       text,
  city        text,
  country     text,
  notes       text,
  created_at  timestamptz not null default now()
);
create index if not exists pro_clients_owner_idx on public.pro_clients(owner_id);

create table if not exists public.pro_trips (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references auth.users(id) on delete cascade,
  origin_city   text not null,
  origin_country text,
  dest_city     text not null,
  dest_country  text,
  departs_on    date not null,
  capacity_kg   numeric,
  vehicle       text,
  recurring     text check (recurring in ('weekly','biweekly','monthly')),
  notes         text,
  status        text not null default 'planned'
                check (status in ('planned','departed','arrived','cancelled')),
  created_at    timestamptz not null default now()
);
create index if not exists pro_trips_owner_idx on public.pro_trips(owner_id, departs_on);

create table if not exists public.pro_shipments (
  id              uuid primary key default gen_random_uuid(),
  owner_id        uuid not null references auth.users(id) on delete cascade,
  code            text not null unique,
  client_id       uuid references public.pro_clients(id) on delete set null,
  trip_id         uuid references public.pro_trips(id) on delete set null,
  sender_name     text,
  sender_phone    text,
  recipient_name  text,
  recipient_phone text,
  origin_city     text,
  dest_city       text,
  description     text,
  packages        integer not null default 1 check (packages >= 0),
  weight_kg       numeric check (weight_kg is null or weight_kg >= 0),
  price           numeric not null default 0 check (price >= 0),
  paid            numeric not null default 0 check (paid >= 0),
  status          text not null default 'registered'
                  check (status in ('registered','picked_up','in_transit','customs','delivered','cancelled')),
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  delivered_at    timestamptz
);
create index if not exists pro_shipments_owner_idx on public.pro_shipments(owner_id, created_at desc);

create table if not exists public.pro_shipment_events (
  id           uuid primary key default gen_random_uuid(),
  shipment_id  uuid not null references public.pro_shipments(id) on delete cascade,
  owner_id     uuid not null references auth.users(id) on delete cascade,
  status       text not null,
  note         text,            -- nota VISIBILE al cliente nel tracking
  created_at   timestamptz not null default now()
);
create index if not exists pro_events_ship_idx on public.pro_shipment_events(shipment_id, created_at);

-- ---------------------------------------------------------------------
-- 2. FUNZIONI DI SERVIZIO
-- ---------------------------------------------------------------------

-- Il piano a pagamento è valido se plan <> 'free' e non è scaduto.
create or replace function public.pro_is_paid(p_owner uuid)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select coalesce(
    (select a.plan <> 'free' and (a.plan_until is null or a.plan_until > now())
       from public.pro_accounts a where a.owner_id = p_owner),
    false);
$$;

-- Admin: usa la funzione is_admin() che il sito ha già.
create or replace function public.pro_caller_is_admin()
returns boolean
language plpgsql stable security definer
set search_path = public
as $$
declare r boolean;
begin
  begin
    execute 'select public.is_admin()' into r;
  exception when others then
    r := false;
  end;
  return coalesce(r, false);
end;
$$;

-- Genera il codice di tracking (es. HM-7K3P-Q9XD), senza lettere ambigue.
create or replace function public.pro_make_code()
returns text
language plpgsql volatile
as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  c text;
  i int;
begin
  loop
    c := 'HM-';
    for i in 1..8 loop
      c := c || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
      if i = 4 then c := c || '-'; end if;
    end loop;
    exit when not exists (select 1 from public.pro_shipments where code = c);
  end loop;
  return c;
end;
$$;

-- ---------------------------------------------------------------------
-- 3. TRIGGER: piano, limiti, codici, date
-- ---------------------------------------------------------------------

-- 3a. Nessuno può darsi da solo un piano a pagamento.
create or replace function public.pro_guard_account()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  if public.pro_caller_is_admin() or current_user in ('postgres','service_role','supabase_admin') then
    return new;
  end if;
  if tg_op = 'INSERT' then
    new.plan := 'free';
    new.plan_until := null;
  else
    new.plan := old.plan;
    new.plan_until := old.plan_until;
    new.owner_id := old.owner_id;
  end if;
  return new;
end;
$$;
drop trigger if exists pro_guard_account_trg on public.pro_accounts;
create trigger pro_guard_account_trg
  before insert or update on public.pro_accounts
  for each row execute function public.pro_guard_account();

-- 3b. Limiti del piano gratuito.
--     Gratis: 20 spedizioni al mese, 50 clienti, 10 partenze in programma.
create or replace function public.pro_enforce_limits()
returns trigger
language plpgsql security definer
set search_path = public
as $$
declare n int;
begin
  if public.pro_is_paid(new.owner_id) then
    return new;
  end if;

  if tg_table_name = 'pro_shipments' then
    select count(*) into n from public.pro_shipments
     where owner_id = new.owner_id
       and created_at >= date_trunc('month', now());
    if n >= 20 then
      raise exception 'LIMIT_SHIPMENTS' using errcode = 'P0001';
    end if;
  elsif tg_table_name = 'pro_clients' then
    select count(*) into n from public.pro_clients where owner_id = new.owner_id;
    if n >= 50 then
      raise exception 'LIMIT_CLIENTS' using errcode = 'P0001';
    end if;
  elsif tg_table_name = 'pro_trips' then
    select count(*) into n from public.pro_trips
     where owner_id = new.owner_id and status = 'planned';
    if n >= 10 then
      raise exception 'LIMIT_TRIPS' using errcode = 'P0001';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists pro_limit_shipments on public.pro_shipments;
create trigger pro_limit_shipments before insert on public.pro_shipments
  for each row execute function public.pro_enforce_limits();
drop trigger if exists pro_limit_clients on public.pro_clients;
create trigger pro_limit_clients before insert on public.pro_clients
  for each row execute function public.pro_enforce_limits();
drop trigger if exists pro_limit_trips on public.pro_trips;
create trigger pro_limit_trips before insert on public.pro_trips
  for each row execute function public.pro_enforce_limits();

-- 3c. Codice di tracking automatico e date.
create or replace function public.pro_ship_before()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    if new.code is null or new.code = '' then
      new.code := public.pro_make_code();
    end if;
  else
    new.code := old.code;           -- il codice non si cambia
    new.owner_id := old.owner_id;
  end if;
  new.updated_at := now();
  if new.status = 'delivered' and (tg_op = 'INSERT' or old.status <> 'delivered') then
    new.delivered_at := now();
  elsif new.status <> 'delivered' then
    new.delivered_at := null;
  end if;
  return new;
end;
$$;
drop trigger if exists pro_ship_before_trg on public.pro_shipments;
create trigger pro_ship_before_trg
  before insert or update on public.pro_shipments
  for each row execute function public.pro_ship_before();

-- 3d. Primo evento automatico alla creazione.
create or replace function public.pro_ship_after_insert()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  insert into public.pro_shipment_events(shipment_id, owner_id, status)
  values (new.id, new.owner_id, new.status);
  return new;
end;
$$;
drop trigger if exists pro_ship_after_insert_trg on public.pro_shipments;
create trigger pro_ship_after_insert_trg
  after insert on public.pro_shipments
  for each row execute function public.pro_ship_after_insert();

-- ---------------------------------------------------------------------
-- 4. SICUREZZA (Row Level Security): ognuno vede solo i propri dati
-- ---------------------------------------------------------------------

alter table public.pro_accounts        enable row level security;
alter table public.pro_clients         enable row level security;
alter table public.pro_trips           enable row level security;
alter table public.pro_shipments       enable row level security;
alter table public.pro_shipment_events enable row level security;

drop policy if exists pro_accounts_own on public.pro_accounts;
create policy pro_accounts_own on public.pro_accounts
  for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists pro_clients_own on public.pro_clients;
create policy pro_clients_own on public.pro_clients
  for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists pro_trips_own on public.pro_trips;
create policy pro_trips_own on public.pro_trips
  for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- Le spedizioni possono collegarsi solo a clienti e partenze propri.
drop policy if exists pro_shipments_own on public.pro_shipments;
create policy pro_shipments_own on public.pro_shipments
  for all to authenticated
  using (owner_id = auth.uid())
  with check (
    owner_id = auth.uid()
    and (client_id is null or exists (
          select 1 from public.pro_clients c
           where c.id = client_id and c.owner_id = auth.uid()))
    and (trip_id is null or exists (
          select 1 from public.pro_trips t
           where t.id = trip_id and t.owner_id = auth.uid()))
  );

drop policy if exists pro_events_own on public.pro_shipment_events;
create policy pro_events_own on public.pro_shipment_events
  for all to authenticated
  using (owner_id = auth.uid())
  with check (
    owner_id = auth.uid()
    and exists (select 1 from public.pro_shipments s
                 where s.id = shipment_id and s.owner_id = auth.uid())
  );

-- Gli utenti non loggati non toccano nulla direttamente.
revoke all on public.pro_accounts, public.pro_clients, public.pro_trips,
              public.pro_shipments, public.pro_shipment_events from anon;

-- ---------------------------------------------------------------------
-- 5. CAMBIO STATO CON EVENTO (usato dal pulsante "Aggiorna stato")
-- ---------------------------------------------------------------------

create or replace function public.pro_set_status(
  p_shipment uuid,
  p_status   text,
  p_note     text default null
) returns void
language plpgsql security invoker
set search_path = public
as $$
begin
  if p_status not in ('registered','picked_up','in_transit','customs','delivered','cancelled') then
    raise exception 'INVALID_STATUS';
  end if;

  update public.pro_shipments
     set status = p_status
   where id = p_shipment and owner_id = auth.uid();

  if not found then
    raise exception 'NOT_FOUND';
  end if;

  insert into public.pro_shipment_events(shipment_id, owner_id, status, note)
  values (p_shipment, auth.uid(), p_status, nullif(trim(coalesce(p_note,'')), ''));
end;
$$;
grant execute on function public.pro_set_status(uuid, text, text) to authenticated;

-- ---------------------------------------------------------------------
-- 6. TRACKING PUBBLICO (senza login)
--    Restituisce solo: stato, tratta, numero colli, nome e contatto del
--    trasportatore e la cronologia. MAI nomi o telefoni di mittente e
--    destinatario, né note interne.
-- ---------------------------------------------------------------------

create or replace function public.pro_track(p_code text)
returns json
language plpgsql stable security definer
set search_path = public
as $$
declare
  c text;
  s public.pro_shipments%rowtype;
  a public.pro_accounts%rowtype;
  ev json;
begin
  c := upper(regexp_replace(coalesce(p_code,''), '[^A-Za-z0-9]', '', 'g'));
  if length(c) = 10 and left(c,2) = 'HM' then
    c := 'HM-' || substr(c,3,4) || '-' || substr(c,7,4);
  end if;
  if length(c) <> 12 then
    return json_build_object('found', false);
  end if;

  select * into s from public.pro_shipments where code = c;
  if not found then
    return json_build_object('found', false);
  end if;

  select * into a from public.pro_accounts where owner_id = s.owner_id;

  select coalesce(json_agg(json_build_object(
           'status', e.status, 'note', e.note, 'at', e.created_at
         ) order by e.created_at), '[]'::json)
    into ev
    from public.pro_shipment_events e
   where e.shipment_id = s.id;

  return json_build_object(
    'found',        true,
    'code',         s.code,
    'status',       s.status,
    'origin',       s.origin_city,
    'destination',  s.dest_city,
    'packages',     s.packages,
    'updated_at',   s.updated_at,
    'carrier',      a.company_name,
    'carrier_whatsapp', coalesce(a.whatsapp, a.phone),
    'events',       ev
  );
end;
$$;
grant execute on function public.pro_track(text) to anon, authenticated;

-- ---------------------------------------------------------------------
-- 7. ATTIVAZIONE MANUALE DEL PIANO A PAGAMENTO (solo admin)
--    Esempio, per attivare Pro per 1 mese a un trasportatore:
--      select public.pro_admin_set_plan('UUID-DELL-UTENTE', 'pro', now() + interval '1 month');
--    Per tornare al gratuito:
--      select public.pro_admin_set_plan('UUID-DELL-UTENTE', 'free', null);
--    (l'UUID lo trovi in Supabase > Authentication > Users)
-- ---------------------------------------------------------------------

create or replace function public.pro_admin_set_plan(
  p_owner uuid, p_plan text, p_until timestamptz
) returns void
language plpgsql security definer
set search_path = public
as $$
begin
  if not (public.pro_caller_is_admin()
          or current_user in ('postgres','service_role','supabase_admin')) then
    raise exception 'FORBIDDEN';
  end if;
  update public.pro_accounts
     set plan = p_plan, plan_until = p_until
   where owner_id = p_owner;
  if not found then
    raise exception 'ACCOUNT_NOT_FOUND';
  end if;
end;
$$;
revoke all on function public.pro_admin_set_plan(uuid, text, timestamptz) from public, anon;
grant execute on function public.pro_admin_set_plan(uuid, text, timestamptz) to authenticated;
