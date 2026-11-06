/* =====================================================
   HEZ MAAK - APP.JS
   Lingue:
   🇮🇹 Italiano
   🇫🇷 Français
   🇹🇳 العربية التونسية
===================================================== */

const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

let currentUser = null;


/* =====================================================
   LANGUAGE SYSTEM
===================================================== */

/* =====================================================
   PAESI SUPPORTATI (Tunisia + Europa)
===================================================== */

const COUNTRIES = [
  {
    code: "tunisia",
    flag: "🇹🇳",
    names: { it: "Tunisia", en: "Tunisia", fr: "Tunisie", tn: "تونس" }
  },
  {
    code: "italy",
    flag: "🇮🇹",
    names: { it: "Italia", en: "Italy", fr: "Italie", tn: "إيطاليا" }
  },
  {
    code: "france",
    flag: "🇫🇷",
    names: { it: "Francia", en: "France", fr: "France", tn: "فرنسا" }
  },
  {
    code: "germany",
    flag: "🇩🇪",
    names: { it: "Germania", en: "Germany", fr: "Allemagne", tn: "ألمانيا" }
  },
  {
    code: "belgium",
    flag: "🇧🇪",
    names: { it: "Belgio", en: "Belgium", fr: "Belgique", tn: "بلجيكا" }
  },
  {
    code: "netherlands",
    flag: "🇳🇱",
    names: { it: "Paesi Bassi", en: "Netherlands", fr: "Pays-Bas", tn: "هولندا" }
  },
  {
    code: "switzerland",
    flag: "🇨🇭",
    names: { it: "Svizzera", en: "Switzerland", fr: "Suisse", tn: "سويسرا" }
  },
  {
    code: "spain",
    flag: "🇪🇸",
    names: { it: "Spagna", en: "Spain", fr: "Espagne", tn: "إسبانيا" }
  },
  {
    code: "austria",
    flag: "🇦🇹",
    names: { it: "Austria", en: "Austria", fr: "Autriche", tn: "النمسا" }
  },
  {
    code: "sweden",
    flag: "🇸🇪",
    names: { it: "Svezia", en: "Sweden", fr: "Suède", tn: "السويد" }
  },
  {
    code: "uk",
    flag: "🇬🇧",
    names: { it: "Regno Unito", en: "United Kingdom", fr: "Royaume-Uni", tn: "بريطانيا" }
  }
];

function countryFlag(code) {
  const country = COUNTRIES.find(c => c.code === code);
  return country ? country.flag : "🌍";
}

function countryName(code) {
  const country = COUNTRIES.find(c => c.code === code);
  if (!country) return code;
  return country.names[currentLanguage] || country.names.it;
}

function countryOptions(selectedCode) {
  return COUNTRIES
    .map(c => `
      <option value="${c.code}" ${c.code === selectedCode ? "selected" : ""}>
        ${c.flag} ${c.names[currentLanguage] || c.names.it}
      </option>
    `)
    .join("");
}


const languages = [
  {
    code: "it",
    label: "🇮🇹 IT",
    dir: "ltr"
  },
  {
    code: "en",
    label: "🇬🇧 EN",
    dir: "ltr"
  },
  {
    code: "fr",
    label: "🇫🇷 FR",
    dir: "ltr"
  },
  {
    code: "tn",
    label: "🇹🇳 TN",
    dir: "rtl"
  }
];

let currentLanguage =
  localStorage.getItem("hezmaak_language") || "it";


const translations = {

  /* ===================================================
     ITALIANO
  =================================================== */

  it: {

    navTrips: "Viaggi",
    navRequests: "Richieste",
    navHow: "Come funziona",
    loginRegister: "Accedi / Registrati",

    badge: "🇪🇺 Europa ↔ 🇹🇳 Tunisia",

    heroTitle:
      "Porta ciò che serve. <span>Connettiti.</span> Guadagna.",

    heroText:
      "Hez Maak mette in contatto persone che devono ricevere oggetti tra l'Europa e la Tunisia con viaggiatori e trasportatori che hanno spazio disponibile.",

    travelButton:
      "✈️ Sto viaggiando",

    requestButton:
      "📦 Cerco qualcuno",

    verifiedUsers:
      "Utenti verificati",

    reviews:
      "Recensioni",

    securePayments:
      "Pagamenti sicuri",

    routeTitle:
      "✈️ Un viaggio, un'opportunità",

    italy:
      "Italia",

    tunisia:
      "Tunisia",

    europeLabel:
      "Europa",

    routeDescription:
      "Hai spazio in valigia? Puoi aiutare qualcuno e guadagnare.",

    howLabel:
      "COME FUNZIONA",

    howTitle:
      "Semplice, sicuro, umano.",

    step1Title:
      "Pubblica",

    step1Text:
      "Pubblica il tuo viaggio oppure indica cosa vuoi far trasportare.",

    step2Title:
      "Connettiti",

    step2Text:
      "Trova una persona che percorre la tua stessa tratta.",

    step3Title:
      "Organizza",

    step3Text:
      "Contatta l'altra persona e concordate i dettagli.",

    step4Title:
      "Recensisci",

    step4Text:
      "Dopo il servizio lascia una recensione.",

    tripsLabel:
      "VIAGGI DISPONIBILI",

    tripsTitle:
      "Trova un viaggiatore",

    publishTrip:
      "+ Pubblica viaggio",

    requestsLabel:
      "RICHIESTE",

    requestsTitle:
      "Cosa cercano le persone?",

    publishRequest:
      "+ Pubblica richiesta",

    loading:
      "Caricamento...",

    ctaTitle:
      "Hai un viaggio in programma?",

    ctaText:
      "Trasforma lo spazio inutilizzato nel tuo bagaglio in un'opportunità.",

    ctaButton:
      "Pubblica il tuo viaggio",

    cvLabel1:
      "LA PIATTAFORMA",

    cvTitle1:
      "Avvicina la Tunisia<br>e tutta l'Europa",

    cvText1:
      "Invia o ricevi pacchi grazie ai viaggiatori. Semplice, sicuro e umano.",

    cvBtn1:
      "Unisciti alla community",

    cvLabel2:
      "EUROPA ↔ TUNISIA",

    cvTitle2:
      "Viaggi? Aiuta e guadagna",

    cvText2:
      "Hai spazio in valigia? Pubblica il tuo viaggio e aiuta qualcuno tra Europa e Tunisia.",

    cvLabel3:
      "COMMUNITY",

    cvTitle3:
      "Più di un servizio,<br>una community",

    cvText3:
      "Seguici su Facebook per novità, consigli di viaggio e storie dalla community.",

    cvFbBtn:
      "Segui la pagina Facebook",

    cvFbShort:
      "Segui su Facebook",

    followBtn:
      "🔔 Segui una destinazione",

    followTitle:
      "Segui una destinazione",

    followIntro:
      "Scegli i paesi che ti interessano: riceverai una notifica ogni volta che qualcuno pubblica un viaggio o una richiesta su quella tratta.",

    followOn:
      "Seguita",

    followOff:
      "Segui",

    followClose:
      "Chiudi",

    followMenu:
      "📍 Destinazioni seguite",

    followError:
      "Non riesco a caricare le destinazioni seguite. Riprova tra poco.",

    sampleBadge:
      "Esempio",

    sampleNotice:
      "Questi sono annunci di esempio per mostrarti come funziona. I viaggi e le richieste reali compariranno qui.",

    sampleTraveler:
      "Viaggiatore di esempio",

    sampleRequester:
      "Richiesta di esempio",

    sampleItem1:
      "Abbigliamento e scarpe",

    sampleItem2:
      "Prodotti alimentari tipici",

    sampleItem3:
      "Piccoli regali per la famiglia",

    faqLabel:
      "DOMANDE FREQUENTI",

    faqTitle:
      "Hai dubbi? Ecco le risposte",

    faq1Q:
      "Come funziona il pagamento?",

    faq1A:
      "I pagamenti si concordano direttamente tra le due persone, fuori dalla piattaforma. Hez Maak mette in contatto gli utenti ma non interviene negli accordi economici.",

    faq2Q:
      "Cosa posso far trasportare?",

    faq2A:
      "Sono vietati merci illegali, pericolose, contraffatte o soggette a restrizioni doganali. Ogni utente deve rispettare le leggi doganali dei paesi coinvolti.",

    faq3Q:
      "Hez Maak controlla i pacchi?",

    faq3A:
      "No. La piattaforma non controlla il contenuto delle spedizioni: ti consigliamo di verificare sempre cosa viene trasportato e di usare buon senso negli accordi.",

    faq4Q:
      "Cosa significa profilo verificato?",

    faq4A:
      "Il badge indica che l'utente ha caricato un documento d'identità controllato dal nostro team. Aumenta la fiducia, ma non è una garanzia assoluta.",

    faq5Q:
      "Come funziona «Segui una destinazione»?",

    faq5A:
      "Scegli uno o più paesi: ogni volta che viene pubblicato un viaggio o una richiesta su quella tratta ricevi una notifica, così non perdi nessuna occasione.",

    spLabel1:
      "SPONSOR · PUBBLICITÀ",

    spTitle1:
      "Fai conoscere<br>la tua attività",

    spText1:
      "Raggiungi una community viva tra Europa e Tunisia.",

    spBtn1:
      "Diventa sponsor",

    spLabel2:
      "PARTNERSHIP",

    spTitle2:
      "Diventa nostro sponsor",

    spText2:
      "Il tuo brand davanti a chi viaggia e spedisce ogni giorno.",

    spB1T:
      "Più visibilità",

    spB1S:
      "Logo e banner in evidenza",

    spB2T:
      "Pubblico mirato",

    spB2S:
      "Persone tra Italia e Tunisia",

    spB3T:
      "Brand affidabile",

    spB3S:
      "Associato a una community",

    spLabel3:
      "LA TUA ATTIVITÀ IN VIAGGIO",

    spTitle3a:
      "Una community che viaggia,",

    spTitle3b:
      "un pubblico che ti ascolta",

    spText3:
      "Sponsorizza la tua attività su Hez Maak.",

    spBtn3:
      "Contattaci",

    spPrev:
      "Precedente",

    spNext:
      "Successivo",

    footerBrand:
      "Hez Maak",

    securityTitle:
      "Sicurezza",

    verifyIdentity:
      "Verifica identità",

    support:
      "Assistenza",

    loginTitle:
      "Accedi a Hez Maak",

    loginText:
      "Accedi al tuo account.",

    email:
      "Email",

    password:
      "Password",

    login:
      "Accedi",

    noAccount:
      "Non hai un account?",

    register:
      "Registrati",

    createAccount:
      "Crea account",

    joinCommunity:
      "Entra nella comunità Hez Maak.",

    fullName:
      "Nome e cognome",

    accountType:
      "Tipo di account",

    private:
      "👤 Privato",

    traveler:
      "✈️ Viaggiatore",

    company:
      "🚚 Azienda / Trasportatore",

    country:
      "Paese",

    create:
      "Registrati",

    alreadyAccount:
      "Hai già un account?",

    backToLogin:
      "Accedi",

    fillFields:
      "Compila tutti i campi.",

    accountCreated:
      "Account creato. Controlla la tua email per confermare l'account.",

    tripPublished:
      "✓ Viaggio pubblicato e biglietto inviato per verifica.",

    requestPublished:
      "✓ Richiesta pubblicata!",

    profile:
      "👤 Il mio profilo",

    verifiedProfile:
      "✓ Profilo verificato",

    notVerified:
      "○ Profilo non verificato",

    personalInfo:
      "Informazioni personali",

    edit:
      "Modifica",

    countryLabel:
      "Paese",

    accountLabel:
      "Tipo account",

    security:
      "SICUREZZA",

    verifyTitle:
      "🪪 Verifica la tua identità",

    verifyText:
      "Verifica la tua identità per ottenere il badge ✓ e aumentare la fiducia degli altri utenti.",

    verifyButton:
      "🪪 Verifica identità",

    verified:
      "✓ VERIFICATO",

    verifiedIdentity:
      "✓ La tua identità è stata verificata.",

    identityVerified:
      "Identità verificata",

    pending:
      "⏳ Verifica in revisione",

    rejected:
      "⚠️ Verifica rifiutata",

    documentType:
      "Tipo di documento",

    passport:
      "🛂 Passaporto",

    identityCard:
      "🪪 Carta d'identità",

    document:
      "Documento",

    sendDocument:
      "🔐 Invia documento",

    uploadHelp:
      "Formati accettati: JPG, PNG, PDF. Dimensione massima: 10 MB.",

    uploadInProgress:
      "Upload in corso...",

    documentSent:
      "✓ Documento inviato correttamente.",

    reviewText:
      "La verifica è ora in revisione.",

    publishTripTitle:
      "✈️ Pubblica viaggio",

    tripDescription:
      "Indica il tuo viaggio.",

    departure:
      "Partenza",

    arrival:
      "Arrivo",

    departureCity:
      "Città di partenza",

    arrivalCity:
      "Città di arrivo",

    travelDate:
      "Data del viaggio",

    availableKg:
      "Kg disponibili",

    priceKg:
      "Prezzo €/kg",

    description:
      "Descrizione",

    ticket:
      "📄 Biglietto del viaggio",

    ticketHelp:
      "Carica una foto, screenshot o PDF del biglietto. Il biglietto è privato e sarà visibile solo all'amministratore per la verifica. Massimo 10 MB.",

    publish:
      "Pubblica",

    requestTitle:
      "📦 Pubblica richiesta",

    itemDescription:
      "Cosa vuoi trasportare?",

    weight:
      "Peso kg",

    budget:
      "Budget €",

    myActivity:
      "La mia attività",

    myTrips:
      "I miei viaggi",

    manageTrips:
      "Gestisci i tuoi viaggi",

    myRequests:
      "Le mie richieste",

    manageRequests:
      "Gestisci le tue richieste",

    myReviews:
      "Le mie recensioni",

    viewReviews:
      "Visualizza le valutazioni",

    logout:
      "🚪 Esci",

    backHome:
      "← Torna a Hez Maak",

    contact:
      "Contatta",

    admin:
      "🔐 Admin",

    administration:
      "AMMINISTRAZIONE",

    adminTitle:
      "Pannello Hez Maak 🔐",

    adminDescription:
      "Gestione delle verifiche identità.",

    pendingRequests:
      "Richieste in attesa",

    everythingOk:
      "✓ Tutto in ordine",

    noPending:
      "Non ci sono verifiche in attesa.",

    viewDocument:
      "👁 Visualizza documento",

    approve:
      "✓ Approva",

    reject:
      "✕ Rifiuta",

    user:
      "Utente",

    sent:
      "Inviata",

    noTrips:
      "✈️ Nessun viaggio disponibile",

    publishFirstTrip:
      "Pubblica il primo viaggio.",

    noRequests:
      "📦 Nessuna richiesta",

    publishFirstRequest:
      "Pubblica una richiesta.",

    verifiedTrip:
      "✈️ Viaggio verificato",

    ticketPending:
      "⏳ Biglietto in verifica",

    verificationRejected:
      "⚠️ Verifica non approvata",

    kg:
      "kg",

    contactSoon:
      "La messaggistica sarà collegata alla tabella messages nel prossimo modulo.",

    reviewsComing:
      "Il sistema di recensioni verrà collegato al database nel prossimo modulo.",

    editComing:
      "La modifica del profilo sarà disponibile nel prossimo modulo.",

    noTripsUser:
      "Non hai ancora pubblicato nessun viaggio.",

    noRequestsUser:
      "Non hai ancora pubblicato nessuna richiesta.",


    /* --- Accordo / Consegna / Recensione (chat) --- */

    agreementQuestion:
      "Vi siete messi d'accordo?",

    agreementSubtext:
      "Conferma per chiudere l'annuncio pubblico",

    agreementConfirmButton:
      "Conferma accordo",

    agreementConfirmedTitle:
      "Accordo confermato",

    waitingOtherParty:
      "In attesa dell'altra parte",

    deliveryQuestion:
      "Consegna avvenuta?",

    deliverySubtext:
      "Conferma quando l'oggetto è arrivato",

    deliveryConfirmButton:
      "Conferma",

    deliveryConfirmedTitle:
      "Consegna confermata",

    deliveryConfirmedSubtext:
      "Com'è andata? Lascia una recensione.",

    reviewSentTitle:
      "Recensione inviata",

    reviewSentSubtext:
      "Grazie per il tuo feedback",

    toastAgreementBoth:
      "🤝 Accordo confermato da entrambe le parti!",

    toastAgreementWaiting:
      "🤝 Conferma registrata. In attesa dell'altra parte.",

    toastDeliveryBoth:
      "✓ Consegna confermata da entrambe le parti!",

    toastDeliveryWaiting:
      "✓ Conferma registrata. In attesa dell'altra parte.",

    howWasIt:
      "Com'è andata la spedizione?",

    reviewSentThanks:
      "✓ Recensione inviata. Grazie!",

    selectAtLeastOneStar:
      "Seleziona almeno una stella.",

    alreadyReviewedConversation:
      "Hai già lasciato una recensione per questa conversazione.",

    sendReview:
      "Invia recensione",

    optionalComment:
      "Lascia un commento (opzionale)",


    /* --- Segnalazione --- */

    reportButton:
      "Segnala",

    reportTitle:
      "🚩 Segnala",

    reportIntro:
      "Aiutaci a mantenere la community sicura. La segnalazione sarà esaminata dall'amministrazione.",

    reportReasonLabel:
      "Motivo",

    reportReasonSpam:
      "Spam o annuncio falso",

    reportReasonScam:
      "Sospetta truffa",

    reportReasonInappropriate:
      "Comportamento inappropriato",

    reportReasonFakeProfile:
      "Profilo falso",

    reportReasonOther:
      "Altro",

    reportDescriptionLabel:
      "Descrizione (facoltativa)",

    reportDescriptionPlaceholder:
      "Aggiungi dettagli utili per la revisione...",

    reportSendButton:
      "Invia segnalazione",

    reportSentThanks:
      "✓ Segnalazione inviata. Grazie per averci avvisato.",

    cannotReportYourself:
      "Non puoi segnalare te stesso.",

    reportUserTitle:
      "Segnala utente",


    /* --- Avatar --- */

    changeProfilePhoto:
      "Cambia foto profilo",

    avatarTooLarge:
      "L'immagine supera i 5 MB. Scegline una più leggera.",

    avatarUnsupportedFormat:
      "Formato non supportato. Usa JPG, PNG o WEBP.",

    avatarUpdated:
      "✓ Foto profilo aggiornata",


    /* --- Cookie & Termini --- */

    cookieBannerTitle:
      "🍪 Cookie e preferenze",

    cookieBannerText:
      "Usiamo cookie tecnici necessari al funzionamento del sito (lingua, tema, sessione di accesso). Non usiamo cookie di profilazione o pubblicitari. Per saperne di più leggi la",

    cookieBannerLink:
      "Privacy Policy",

    cookieBannerAccept:
      "Ho capito",

    termsCheckboxText:
      "Accetto i",

    termsCheckboxAnd:
      "e la",

    termsOfServiceLink:
      "Termini di Servizio",

    privacyPolicyLink:
      "Privacy Policy",

    mustAcceptTerms:
      "Devi accettare i Termini di Servizio e la Privacy Policy per registrarti.",


    /* --- Admin --- */

    adminOverview:
      "📊 Panoramica",

    adminIdentityVerifications:
      "Verifiche identità",

    adminTicketsToVerify:
      "Biglietti da verificare",

    adminReportsCount:
      "🚩 Segnalazioni",

    adminIdentitySection:
      "🪪 Verifiche identità",

    adminNoIdentityVerifications:
      "✓ Nessuna verifica identità",

    adminNoIdentityText:
      "Non ci sono documenti in attesa di verifica.",

    adminTripsSection:
      "🎫 Verifica biglietti",

    adminTripsSectionText:
      "Controlla i biglietti caricati dagli utenti prima di approvare il viaggio.",

    adminNoTickets:
      "✓ Nessun biglietto in attesa",

    adminNoTicketsText:
      "Tutti i biglietti sono stati verificati.",

    adminReportsSection:
      "🚩 Segnalazioni",

    adminReportsSectionText:
      "Revisiona le segnalazioni inviate dagli utenti.",

    adminNoReports:
      "✓ Nessuna segnalazione",

    adminNoReportsText:
      "Non ci sono segnalazioni in attesa.",

    adminMarkResolved:
      "✓ Segna come risolta",

    adminDismiss:
      "✕ Ignora",

    adminSecurityLabel:
      "SICUREZZA",

    adminBackToSite:
      "← Torna al sito",

    adminPanelTitle:
      "Pannello Hez Maak 🔐",

    adminPanelText:
      "Gestione verifiche utenti e viaggi.",

    adminViewTicket:
      "👁 Visualizza biglietto",

    adminApproveTicket:
      "✓ Approva biglietto",

    adminRejectTicket:
      "✕ Rifiuta",

    adminTicketToVerify:
      "BIGLIETTO DA VERIFICARE",

    adminUserIdLabel:
      "User ID",

    adminFrom:
      "Da",

    adminAgainst:
      "Contro",

    adminSentOn:
      "Inviata",


    /* --- Varie / azioni comuni --- */

    edit2:
      "✏️ Modifica",

    deleteButton:
      "🗑 Elimina",

    cancelButton:
      "Annulla",

    genericError:
      "Errore",

    sendingInProgress:
      "Invio in corso...",

    uploadingInProgress:
      "Caricamento in corso...",

    minimizeTitle:
      "Minimizza",

    closeTitle:
      "Chiudi",

    openChatTitle:
      "Apri chat",

    openMessagesTitle:
      "Apri messaggi",

    writeMessagePlaceholder:
      "Scrivi un messaggio...",

    sendButton:
      "Invia",

    messagesTitle:
      "Messaggi",

    noMessagesYet:
      "Nessun messaggio",

    newMessageReceived:
      "Nuovo messaggio ricevuto",

    isTyping:
      "sta scrivendo…",

    deliveryConfirmationSentTitle:
      "Conferma inviata",

    footerLegalTitle:
      "Legale",

    footerCookiePreferences:
      "Preferenze Cookie",

    countriesMustDiffer:
      "Partenza e arrivo devono essere in paesi diversi.",

    oneMustBeTunisia:
      "Una delle due tappe (partenza o arrivo) deve essere la Tunisia.",

    europeTunisia:
      "🇪🇺 Europa ↔ 🇹🇳 Tunisia",

    reviewsLabel:
      "LA COMMUNITY DICE",

    reviewsHomeTitle:
      "Storie di chi ha già usato Hez Maak",

    reviewsEmptyTitle:
      "Le prime storie stanno arrivando",

    reviewsEmptyText:
      "Pubblica un viaggio o una richiesta: dopo lo scambio potrai lasciare la prima recensione e comparirà proprio qui."

  },


  /* ===================================================
     ENGLISH
  =================================================== */

  en: {

    navTrips: "Trips",
    navRequests: "Requests",
    navHow: "How it works",
    loginRegister: "Log in / Sign up",

    badge: "🇪🇺 Europe ↔ 🇹🇳 Tunisia",

    heroTitle:
      "Carry what's needed. <span>Connect.</span> Earn.",

    heroText:
      "Hez Maak connects people who need to receive items between Europe and Tunisia with travelers and carriers who have space available.",

    travelButton:
      "✈️ I'm traveling",

    requestButton:
      "📦 I'm looking for someone",

    verifiedUsers:
      "Verified users",

    reviews:
      "Reviews",

    securePayments:
      "Secure payments",

    routeTitle:
      "✈️ One trip, one opportunity",

    italy:
      "Italy",

    tunisia:
      "Tunisia",

    europeLabel:
      "Europe",

    routeDescription:
      "Got space in your suitcase? You can help someone and earn money.",

    howLabel:
      "HOW IT WORKS",

    howTitle:
      "Simple, safe, human.",

    step1Title:
      "Post",

    step1Text:
      "Post your trip or say what you'd like to have carried.",

    step2Title:
      "Connect",

    step2Text:
      "Find someone traveling the same route.",

    step3Title:
      "Arrange",

    step3Text:
      "Contact the other person and agree on the details.",

    step4Title:
      "Review",

    step4Text:
      "After the service, leave a review.",

    tripsLabel:
      "AVAILABLE TRIPS",

    tripsTitle:
      "Find a traveler",

    publishTrip:
      "+ Post a trip",

    requestsLabel:
      "REQUESTS",

    requestsTitle:
      "What are people looking for?",

    publishRequest:
      "+ Post a request",

    loading:
      "Loading...",

    ctaTitle:
      "Got a trip coming up?",

    ctaText:
      "Turn the unused space in your luggage into an opportunity.",

    ctaButton:
      "Post your trip",

    cvLabel1:
      "THE PLATFORM",

    cvTitle1:
      "Bringing Tunisia<br>and Europe closer",

    cvText1:
      "Send or receive parcels thanks to travelers. Simple, safe and human.",

    cvBtn1:
      "Join the community",

    cvLabel2:
      "EUROPE ↔ TUNISIA",

    cvTitle2:
      "Traveling? Help and earn",

    cvText2:
      "Got space in your suitcase? Post your trip and help someone between Europe and Tunisia.",

    cvLabel3:
      "COMMUNITY",

    cvTitle3:
      "More than a service,<br>a community",

    cvText3:
      "Follow us on Facebook for news, travel tips and community stories.",

    cvFbBtn:
      "Follow our Facebook page",

    cvFbShort:
      "Follow on Facebook",

    followBtn:
      "🔔 Follow a destination",

    followTitle:
      "Follow a destination",

    followIntro:
      "Pick the countries you care about: you'll get a notification every time someone posts a trip or a request on that route.",

    followOn:
      "Following",

    followOff:
      "Follow",

    followClose:
      "Close",

    followMenu:
      "📍 Followed destinations",

    followError:
      "I couldn't load your followed destinations. Please try again shortly.",

    sampleBadge:
      "Example",

    sampleNotice:
      "These are sample listings to show you how it works. Real trips and requests will appear here.",

    sampleTraveler:
      "Sample traveler",

    sampleRequester:
      "Sample request",

    sampleItem1:
      "Clothes and shoes",

    sampleItem2:
      "Typical food products",

    sampleItem3:
      "Small gifts for the family",

    faqLabel:
      "FAQ",

    faqTitle:
      "Got questions? Here are the answers",

    faq1Q:
      "How does payment work?",

    faq1A:
      "Payments are agreed directly between the two people, outside the platform. Hez Maak connects users but does not take part in financial agreements.",

    faq2Q:
      "What can I send?",

    faq2A:
      "Illegal, dangerous, counterfeit goods or items subject to customs restrictions are forbidden. Every user must follow the customs laws of the countries involved.",

    faq3Q:
      "Does Hez Maak check the parcels?",

    faq3A:
      "No. The platform does not check the contents of shipments: always verify what is being carried and use common sense in your agreements.",

    faq4Q:
      "What does a verified profile mean?",

    faq4A:
      "The badge means the user uploaded an ID document reviewed by our team. It builds trust but is not an absolute guarantee.",

    faq5Q:
      "How does “Follow a destination” work?",

    faq5A:
      "Pick one or more countries: every time a trip or a request is posted on that route you get a notification, so you never miss an opportunity.",

    spLabel1:
      "SPONSORS · ADVERTISING",

    spTitle1:
      "Get your business<br>noticed",

    spText1:
      "Reach a lively community between Europe and Tunisia.",

    spBtn1:
      "Become a sponsor",

    spLabel2:
      "PARTNERSHIP",

    spTitle2:
      "Become our sponsor",

    spText2:
      "Your brand in front of people who travel and ship every day.",

    spB1T:
      "More visibility",

    spB1S:
      "Logo and banner in the spotlight",

    spB2T:
      "Targeted audience",

    spB2S:
      "People between Italy and Tunisia",

    spB3T:
      "Trusted brand",

    spB3S:
      "Linked to a community",

    spLabel3:
      "YOUR BUSINESS ON THE MOVE",

    spTitle3a:
      "A community on the move,",

    spTitle3b:
      "an audience that listens",

    spText3:
      "Promote your business on Hez Maak.",

    spBtn3:
      "Contact us",

    spPrev:
      "Previous",

    spNext:
      "Next",

    footerBrand:
      "Hez Maak",

    securityTitle:
      "Security",

    verifyIdentity:
      "Verify identity",

    support:
      "Support",

    loginTitle:
      "Log in to Hez Maak",

    loginText:
      "Log in to your account.",

    email:
      "Email",

    password:
      "Password",

    login:
      "Log in",

    noAccount:
      "Don't have an account?",

    register:
      "Sign up",

    createAccount:
      "Create account",

    joinCommunity:
      "Join the Hez Maak community.",

    fullName:
      "Full name",

    accountType:
      "Account type",

    private:
      "👤 Private",

    traveler:
      "✈️ Traveler",

    company:
      "🚚 Company / Carrier",

    country:
      "Country",

    create:
      "Sign up",

    alreadyAccount:
      "Already have an account?",

    backToLogin:
      "Log in",

    fillFields:
      "Please fill in all fields.",

    accountCreated:
      "Account created. Check your email to confirm your account.",

    tripPublished:
      "✓ Trip posted and ticket sent for verification.",

    requestPublished:
      "✓ Request posted!",

    profile:
      "👤 My profile",

    verifiedProfile:
      "✓ Verified profile",

    notVerified:
      "○ Unverified profile",

    personalInfo:
      "Personal information",

    edit:
      "Edit",

    countryLabel:
      "Country",

    accountLabel:
      "Account type",

    security:
      "SECURITY",

    verifyTitle:
      "🪪 Verify your identity",

    verifyText:
      "Verify your identity to get the ✓ badge and increase trust with other users.",

    verifyButton:
      "🪪 Verify identity",

    verified:
      "✓ VERIFIED",

    verifiedIdentity:
      "✓ Your identity has been verified.",

    identityVerified:
      "Identity verified",

    pending:
      "⏳ Verification under review",

    rejected:
      "⚠️ Verification rejected",

    documentType:
      "Document type",

    passport:
      "🛂 Passport",

    identityCard:
      "🪪 ID card",

    document:
      "Document",

    sendDocument:
      "🔐 Send document",

    uploadHelp:
      "Accepted formats: JPG, PNG, PDF. Maximum size: 10 MB.",

    uploadInProgress:
      "Uploading...",

    documentSent:
      "✓ Document sent successfully.",

    reviewText:
      "Your verification is now under review.",

    publishTripTitle:
      "✈️ Post a trip",

    tripDescription:
      "Enter your trip details.",

    departure:
      "Departure",

    arrival:
      "Arrival",

    departureCity:
      "Departure city",

    arrivalCity:
      "Arrival city",

    travelDate:
      "Travel date",

    availableKg:
      "Available kg",

    priceKg:
      "Price €/kg",

    description:
      "Description",

    ticket:
      "📄 Travel ticket",

    ticketHelp:
      "Upload a photo, screenshot or PDF of the ticket. The ticket is private and only visible to the administrator for verification. Maximum 10 MB.",

    publish:
      "Post",

    requestTitle:
      "📦 Post a request",

    itemDescription:
      "What would you like carried?",

    weight:
      "Weight kg",

    budget:
      "Budget €",

    myActivity:
      "My activity",

    myTrips:
      "My trips",

    manageTrips:
      "Manage your trips",

    myRequests:
      "My requests",

    manageRequests:
      "Manage your requests",

    myReviews:
      "My reviews",

    viewReviews:
      "View ratings",

    logout:
      "🚪 Log out",

    backHome:
      "← Back to Hez Maak",

    contact:
      "Contact",

    admin:
      "🔐 Admin",

    administration:
      "ADMINISTRATION",

    adminTitle:
      "Hez Maak Panel 🔐",

    adminDescription:
      "Identity verification management.",

    pendingRequests:
      "Pending requests",

    everythingOk:
      "✓ All clear",

    noPending:
      "There are no pending verifications.",

    viewDocument:
      "👁 View document",

    approve:
      "✓ Approve",

    reject:
      "✕ Reject",

    user:
      "User",

    sent:
      "Sent",

    noTrips:
      "✈️ No trips available",

    publishFirstTrip:
      "Post the first trip.",

    noRequests:
      "📦 No requests",

    publishFirstRequest:
      "Post a request.",

    verifiedTrip:
      "✈️ Verified trip",

    ticketPending:
      "⏳ Ticket under verification",

    verificationRejected:
      "⚠️ Verification not approved",

    kg:
      "kg",

    contactSoon:
      "Messaging will be connected to the messages table in the next module.",

    reviewsComing:
      "The review system will be connected to the database in the next module.",

    editComing:
      "Profile editing will be available in the next module.",

    noTripsUser:
      "You haven't posted any trips yet.",

    noRequestsUser:
      "You haven't posted any requests yet.",


    /* --- Agreement / Delivery / Review (chat) --- */

    agreementQuestion:
      "Have you agreed on the details?",

    agreementSubtext:
      "Confirm to close the public listing",

    agreementConfirmButton:
      "Confirm agreement",

    agreementConfirmedTitle:
      "Agreement confirmed",

    waitingOtherParty:
      "Waiting for the other party",

    deliveryQuestion:
      "Has the delivery happened?",

    deliverySubtext:
      "Confirm once the item has arrived",

    deliveryConfirmButton:
      "Confirm",

    deliveryConfirmedTitle:
      "Delivery confirmed",

    deliveryConfirmedSubtext:
      "How did it go? Leave a review.",

    reviewSentTitle:
      "Review sent",

    reviewSentSubtext:
      "Thanks for your feedback",

    toastAgreementBoth:
      "🤝 Agreement confirmed by both parties!",

    toastAgreementWaiting:
      "🤝 Confirmation recorded. Waiting for the other party.",

    toastDeliveryBoth:
      "✓ Delivery confirmed by both parties!",

    toastDeliveryWaiting:
      "✓ Confirmation recorded. Waiting for the other party.",

    howWasIt:
      "How did the shipment go?",

    reviewSentThanks:
      "✓ Review sent. Thank you!",

    selectAtLeastOneStar:
      "Select at least one star.",

    alreadyReviewedConversation:
      "You've already left a review for this conversation.",

    sendReview:
      "Send review",

    optionalComment:
      "Leave a comment (optional)",


    /* --- Report --- */

    reportButton:
      "Report",

    reportTitle:
      "🚩 Report",

    reportIntro:
      "Help us keep the community safe. The report will be reviewed by the administration.",

    reportReasonLabel:
      "Reason",

    reportReasonSpam:
      "Spam or fake listing",

    reportReasonScam:
      "Suspected scam",

    reportReasonInappropriate:
      "Inappropriate behavior",

    reportReasonFakeProfile:
      "Fake profile",

    reportReasonOther:
      "Other",

    reportDescriptionLabel:
      "Description (optional)",

    reportDescriptionPlaceholder:
      "Add any useful details for review...",

    reportSendButton:
      "Send report",

    reportSentThanks:
      "✓ Report sent. Thanks for letting us know.",

    cannotReportYourself:
      "You can't report yourself.",

    reportUserTitle:
      "Report user",


    /* --- Avatar --- */

    changeProfilePhoto:
      "Change profile photo",

    avatarTooLarge:
      "The image exceeds 5 MB. Please choose a lighter one.",

    avatarUnsupportedFormat:
      "Unsupported format. Use JPG, PNG or WEBP.",

    avatarUpdated:
      "✓ Profile photo updated",


    /* --- Cookies & Terms --- */

    cookieBannerTitle:
      "🍪 Cookies & preferences",

    cookieBannerText:
      "We use technical cookies necessary for the site to work (language, theme, login session). We don't use profiling or advertising cookies. Read more in our",

    cookieBannerLink:
      "Privacy Policy",

    cookieBannerAccept:
      "Got it",

    termsCheckboxText:
      "I accept the",

    termsCheckboxAnd:
      "and the",

    termsOfServiceLink:
      "Terms of Service",

    privacyPolicyLink:
      "Privacy Policy",

    mustAcceptTerms:
      "You must accept the Terms of Service and Privacy Policy to sign up.",


    /* --- Admin --- */

    adminOverview:
      "📊 Overview",

    adminIdentityVerifications:
      "Identity verifications",

    adminTicketsToVerify:
      "Tickets to verify",

    adminReportsCount:
      "🚩 Reports",

    adminIdentitySection:
      "🪪 Identity verifications",

    adminNoIdentityVerifications:
      "✓ No identity verifications",

    adminNoIdentityText:
      "There are no documents pending verification.",

    adminTripsSection:
      "🎫 Verify tickets",

    adminTripsSectionText:
      "Check the tickets uploaded by users before approving the trip.",

    adminNoTickets:
      "✓ No pending tickets",

    adminNoTicketsText:
      "All tickets have been verified.",

    adminReportsSection:
      "🚩 Reports",

    adminReportsSectionText:
      "Review the reports submitted by users.",

    adminNoReports:
      "✓ No reports",

    adminNoReportsText:
      "There are no pending reports.",

    adminMarkResolved:
      "✓ Mark as resolved",

    adminDismiss:
      "✕ Dismiss",

    adminSecurityLabel:
      "SECURITY",

    adminBackToSite:
      "← Back to site",

    adminPanelTitle:
      "Hez Maak Panel 🔐",

    adminPanelText:
      "User and trip verification management.",

    adminViewTicket:
      "👁 View ticket",

    adminApproveTicket:
      "✓ Approve ticket",

    adminRejectTicket:
      "✕ Reject",

    adminTicketToVerify:
      "TICKET TO VERIFY",

    adminUserIdLabel:
      "User ID",

    adminFrom:
      "From",

    adminAgainst:
      "Against",

    adminSentOn:
      "Sent",


    /* --- Common actions --- */

    edit2:
      "✏️ Edit",

    deleteButton:
      "🗑 Delete",

    cancelButton:
      "Cancel",

    genericError:
      "Error",

    sendingInProgress:
      "Sending...",

    uploadingInProgress:
      "Uploading...",

    minimizeTitle:
      "Minimize",

    closeTitle:
      "Close",

    openChatTitle:
      "Open chat",

    openMessagesTitle:
      "Open messages",

    writeMessagePlaceholder:
      "Write a message...",

    sendButton:
      "Send",

    messagesTitle:
      "Messages",

    noMessagesYet:
      "No messages",

    newMessageReceived:
      "New message received",

    isTyping:
      "is typing…",

    deliveryConfirmationSentTitle:
      "Confirmation sent",

    footerLegalTitle:
      "Legal",

    footerCookiePreferences:
      "Cookie Preferences",

    countriesMustDiffer:
      "Departure and arrival must be in different countries.",

    oneMustBeTunisia:
      "One of the two legs (departure or arrival) must be Tunisia.",

    europeTunisia:
      "🇪🇺 Europe ↔ 🇹🇳 Tunisia",

    reviewsLabel:
      "WHAT THE COMMUNITY SAYS",

    reviewsHomeTitle:
      "Stories from people who've used Hez Maak",

    reviewsEmptyTitle:
      "The first stories are on their way",

    reviewsEmptyText:
      "Post a trip or a request: after your exchange you can leave the first review, and it will show up right here."

  },


  /* ===================================================
     FRANÇAIS
  =================================================== */

  fr: {

    navTrips: "Voyages",
    navRequests: "Demandes",
    navHow: "Comment ça marche",
    loginRegister: "Connexion / Inscription",

    badge: "🇪🇺 Europe ↔ 🇹🇳 Tunisie",

    heroTitle:
      "Transportez ce dont les autres ont besoin. <span>Connectez-vous.</span> Gagnez.",

    heroText:
      "Hez Maak met en relation les personnes qui souhaitent recevoir des objets entre l'Europe et la Tunisie avec des voyageurs et transporteurs disposant d'espace.",

    travelButton:
      "✈️ Je voyage",

    requestButton:
      "📦 Je cherche quelqu'un",

    verifiedUsers:
      "Utilisateurs vérifiés",

    reviews:
      "Avis",

    securePayments:
      "Paiements sécurisés",

    routeTitle:
      "✈️ Un voyage, une opportunité",

    italy:
      "Italie",

    tunisia:
      "Tunisie",

    europeLabel:
      "Europe",

    routeDescription:
      "Vous avez de la place dans votre valise ? Aidez quelqu'un et gagnez de l'argent.",

    howLabel:
      "COMMENT ÇA MARCHE",

    howTitle:
      "Simple, sûr et humain.",

    step1Title:
      "Publiez",

    step1Text:
      "Publiez votre voyage ou indiquez ce que vous souhaitez faire transporter.",

    step2Title:
      "Connectez-vous",

    step2Text:
      "Trouvez une personne qui suit le même itinéraire.",

    step3Title:
      "Organisez",

    step3Text:
      "Contactez l'autre personne et convenez des détails.",

    step4Title:
      "Évaluez",

    step4Text:
      "Après le service, laissez un avis.",

    tripsLabel:
      "VOYAGES DISPONIBLES",

    tripsTitle:
      "Trouvez un voyageur",

    publishTrip:
      "+ Publier un voyage",

    requestsLabel:
      "DEMANDES",

    requestsTitle:
      "Que recherchent les gens ?",

    publishRequest:
      "+ Publier une demande",

    loading:
      "Chargement...",

    ctaTitle:
      "Vous avez un voyage prévu ?",

    ctaText:
      "Transformez l'espace inutilisé dans vos bagages en opportunité.",

    ctaButton:
      "Publier votre voyage",

    cvLabel1:
      "LA PLATEFORME",

    cvTitle1:
      "Rapprochons la Tunisie<br>et toute l'Europe",

    cvText1:
      "Envoyez ou recevez des colis grâce aux voyageurs. Simple, sûr et humain.",

    cvBtn1:
      "Rejoindre la communauté",

    cvLabel2:
      "EUROPE ↔ TUNISIE",

    cvTitle2:
      "Vous voyagez ? Aidez et gagnez",

    cvText2:
      "De la place dans votre valise ? Publiez votre voyage et aidez quelqu'un entre l'Europe et la Tunisie.",

    cvLabel3:
      "COMMUNAUTÉ",

    cvTitle3:
      "Plus qu'un service,<br>une communauté",

    cvText3:
      "Suivez-nous sur Facebook pour les nouveautés, conseils de voyage et histoires de la communauté.",

    cvFbBtn:
      "Suivre la page Facebook",

    cvFbShort:
      "Suivre sur Facebook",

    followBtn:
      "🔔 Suivre une destination",

    followTitle:
      "Suivre une destination",

    followIntro:
      "Choisissez les pays qui vous intéressent : vous recevrez une notification chaque fois que quelqu'un publie un voyage ou une demande sur ce trajet.",

    followOn:
      "Suivie",

    followOff:
      "Suivre",

    followClose:
      "Fermer",

    followMenu:
      "📍 Destinations suivies",

    followError:
      "Impossible de charger vos destinations suivies. Réessayez dans un instant.",

    sampleBadge:
      "Exemple",

    sampleNotice:
      "Ce sont des annonces d'exemple pour vous montrer le fonctionnement. Les vrais voyages et demandes apparaîtront ici.",

    sampleTraveler:
      "Voyageur d'exemple",

    sampleRequester:
      "Demande d'exemple",

    sampleItem1:
      "Vêtements et chaussures",

    sampleItem2:
      "Produits alimentaires typiques",

    sampleItem3:
      "Petits cadeaux pour la famille",

    faqLabel:
      "QUESTIONS FRÉQUENTES",

    faqTitle:
      "Des doutes ? Voici les réponses",

    faq1Q:
      "Comment fonctionne le paiement ?",

    faq1A:
      "Les paiements se décident directement entre les deux personnes, en dehors de la plateforme. Hez Maak met les utilisateurs en relation mais n'intervient pas dans les accords financiers.",

    faq2Q:
      "Que puis-je faire transporter ?",

    faq2A:
      "Les marchandises illégales, dangereuses, contrefaites ou soumises à des restrictions douanières sont interdites. Chaque utilisateur doit respecter les lois douanières des pays concernés.",

    faq3Q:
      "Hez Maak contrôle-t-il les colis ?",

    faq3A:
      "Non. La plateforme ne contrôle pas le contenu des envois : vérifiez toujours ce qui est transporté et faites preuve de bon sens.",

    faq4Q:
      "Que signifie un profil vérifié ?",

    faq4A:
      "Le badge indique que l'utilisateur a envoyé une pièce d'identité contrôlée par notre équipe. Il renforce la confiance mais n'est pas une garantie absolue.",

    faq5Q:
      "Comment fonctionne « Suivre une destination » ?",

    faq5A:
      "Choisissez un ou plusieurs pays : chaque fois qu'un voyage ou une demande est publié sur ce trajet, vous recevez une notification.",

    spLabel1:
      "SPONSORS · PUBLICITÉ",

    spTitle1:
      "Faites connaître<br>votre activité",

    spText1:
      "Touchez une communauté active entre l'Europe et la Tunisie.",

    spBtn1:
      "Devenir sponsor",

    spLabel2:
      "PARTENARIAT",

    spTitle2:
      "Devenez notre sponsor",

    spText2:
      "Votre marque devant ceux qui voyagent et envoient des colis chaque jour.",

    spB1T:
      "Plus de visibilité",

    spB1S:
      "Logo et bannière mis en avant",

    spB2T:
      "Public ciblé",

    spB2S:
      "Des personnes entre l'Italie et la Tunisie",

    spB3T:
      "Marque de confiance",

    spB3S:
      "Associée à une communauté",

    spLabel3:
      "VOTRE ACTIVITÉ EN VOYAGE",

    spTitle3a:
      "Une communauté qui voyage,",

    spTitle3b:
      "un public qui vous écoute",

    spText3:
      "Faites la promotion de votre activité sur Hez Maak.",

    spBtn3:
      "Contactez-nous",

    spPrev:
      "Précédent",

    spNext:
      "Suivant",

    footerBrand:
      "Hez Maak",

    securityTitle:
      "Sécurité",

    verifyIdentity:
      "Vérifier l'identité",

    support:
      "Assistance",

    loginTitle:
      "Connectez-vous à Hez Maak",

    loginText:
      "Connectez-vous à votre compte.",

    email:
      "Email",

    password:
      "Mot de passe",

    login:
      "Connexion",

    noAccount:
      "Vous n'avez pas de compte ?",

    register:
      "Inscrivez-vous",

    createAccount:
      "Créer un compte",

    joinCommunity:
      "Rejoignez la communauté Hez Maak.",

    fullName:
      "Nom et prénom",

    accountType:
      "Type de compte",

    private:
      "👤 Particulier",

    traveler:
      "✈️ Voyageur",

    company:
      "🚚 Entreprise / Transporteur",

    country:
      "Pays",

    create:
      "S'inscrire",

    alreadyAccount:
      "Vous avez déjà un compte ?",

    backToLogin:
      "Connexion",

    fillFields:
      "Veuillez remplir tous les champs.",

    accountCreated:
      "Compte créé. Vérifiez votre email pour confirmer votre compte.",

    tripPublished:
      "✓ Voyage publié et billet envoyé pour vérification.",

    requestPublished:
      "✓ Demande publiée !",

    profile:
      "👤 Mon profil",

    verifiedProfile:
      "✓ Profil vérifié",

    notVerified:
      "○ Profil non vérifié",

    personalInfo:
      "Informations personnelles",

    edit:
      "Modifier",

    countryLabel:
      "Pays",

    accountLabel:
      "Type de compte",

    security:
      "SÉCURITÉ",

    verifyTitle:
      "🪪 Vérifiez votre identité",

    verifyText:
      "Vérifiez votre identité pour obtenir le badge ✓ et renforcer la confiance des autres utilisateurs.",

    verifyButton:
      "🪪 Vérifier l'identité",

    verified:
      "✓ VÉRIFIÉ",

    verifiedIdentity:
      "✓ Votre identité a été vérifiée.",

    identityVerified:
      "Identité vérifiée",

    pending:
      "⏳ Vérification en cours",

    rejected:
      "⚠️ Vérification refusée",

    documentType:
      "Type de document",

    passport:
      "🛂 Passeport",

    identityCard:
      "🪪 Carte d'identité",

    document:
      "Document",

    sendDocument:
      "🔐 Envoyer le document",

    uploadHelp:
      "Formats acceptés : JPG, PNG, PDF. Taille maximale : 10 Mo.",

    uploadInProgress:
      "Téléchargement en cours...",

    documentSent:
      "✓ Document envoyé avec succès.",

    reviewText:
      "Votre vérification est maintenant en cours d'examen.",

    publishTripTitle:
      "✈️ Publier un voyage",

    tripDescription:
      "Indiquez les détails de votre voyage.",

    departure:
      "Départ",

    arrival:
      "Arrivée",

    departureCity:
      "Ville de départ",

    arrivalCity:
      "Ville d'arrivée",

    travelDate:
      "Date du voyage",

    availableKg:
      "Kg disponibles",

    priceKg:
      "Prix €/kg",

    description:
      "Description",

    ticket:
      "📄 Billet du voyage",

    ticketHelp:
      "Téléchargez une photo, une capture d'écran ou un PDF du billet. Le billet est privé et visible uniquement par l'administrateur. Maximum 10 Mo.",

    publish:
      "Publier",

    requestTitle:
      "📦 Publier une demande",

    itemDescription:
      "Que souhaitez-vous transporter ?",

    weight:
      "Poids kg",

    budget:
      "Budget €",

    myActivity:
      "Mon activité",

    myTrips:
      "Mes voyages",

    manageTrips:
      "Gérer mes voyages",

    myRequests:
      "Mes demandes",

    manageRequests:
      "Gérer mes demandes",

    myReviews:
      "Mes avis",

    viewReviews:
      "Voir les évaluations",

    logout:
      "🚪 Déconnexion",

    backHome:
      "← Retour à Hez Maak",

    contact:
      "Contacter",

    admin:
      "🔐 Admin",

    administration:
      "ADMINISTRATION",

    adminTitle:
      "Panneau Hez Maak 🔐",

    adminDescription:
      "Gestion des vérifications d'identité.",

    pendingRequests:
      "Demandes en attente",

    everythingOk:
      "✓ Tout est en ordre",

    noPending:
      "Aucune vérification en attente.",

    viewDocument:
      "👁 Voir le document",

    approve:
      "✓ Approuver",

    reject:
      "✕ Refuser",

    user:
      "Utilisateur",

    sent:
      "Envoyée",

    noTrips:
      "✈️ Aucun voyage disponible",

    publishFirstTrip:
      "Publiez le premier voyage.",

    noRequests:
      "📦 Aucune demande",

    publishFirstRequest:
      "Publiez une demande.",

    verifiedTrip:
      "✈️ Voyage vérifié",

    ticketPending:
      "⏳ Billet en vérification",

    verificationRejected:
      "⚠️ Vérification refusée",

    kg:
      "kg",

    contactSoon:
      "La messagerie sera connectée à la table messages dans le prochain module.",

    reviewsComing:
      "Le système d'avis sera connecté à la base de données dans le prochain module.",

    editComing:
      "La modification du profil sera disponible dans le prochain module.",

    noTripsUser:
      "Vous n'avez encore publié aucun voyage.",

    noRequestsUser:
      "Vous n'avez encore publié aucune demande.",


    /* --- Accord / Livraison / Avis (chat) --- */

    agreementQuestion:
      "Vous êtes-vous mis d'accord ?",

    agreementSubtext:
      "Confirmez pour fermer l'annonce publique",

    agreementConfirmButton:
      "Confirmer l'accord",

    agreementConfirmedTitle:
      "Accord confirmé",

    waitingOtherParty:
      "En attente de l'autre partie",

    deliveryQuestion:
      "La livraison a-t-elle eu lieu ?",

    deliverySubtext:
      "Confirmez une fois l'objet arrivé",

    deliveryConfirmButton:
      "Confirmer",

    deliveryConfirmedTitle:
      "Livraison confirmée",

    deliveryConfirmedSubtext:
      "Comment ça s'est passé ? Laissez un avis.",

    reviewSentTitle:
      "Avis envoyé",

    reviewSentSubtext:
      "Merci pour votre retour",

    toastAgreementBoth:
      "🤝 Accord confirmé par les deux parties !",

    toastAgreementWaiting:
      "🤝 Confirmation enregistrée. En attente de l'autre partie.",

    toastDeliveryBoth:
      "✓ Livraison confirmée par les deux parties !",

    toastDeliveryWaiting:
      "✓ Confirmation enregistrée. En attente de l'autre partie.",

    howWasIt:
      "Comment s'est passé l'envoi ?",

    reviewSentThanks:
      "✓ Avis envoyé. Merci !",

    selectAtLeastOneStar:
      "Sélectionnez au moins une étoile.",

    alreadyReviewedConversation:
      "Vous avez déjà laissé un avis pour cette conversation.",

    sendReview:
      "Envoyer l'avis",

    optionalComment:
      "Laissez un commentaire (facultatif)",


    /* --- Signalement --- */

    reportButton:
      "Signaler",

    reportTitle:
      "🚩 Signaler",

    reportIntro:
      "Aidez-nous à garder la communauté sûre. Le signalement sera examiné par l'administration.",

    reportReasonLabel:
      "Motif",

    reportReasonSpam:
      "Spam ou annonce fausse",

    reportReasonScam:
      "Suspicion d'arnaque",

    reportReasonInappropriate:
      "Comportement inapproprié",

    reportReasonFakeProfile:
      "Faux profil",

    reportReasonOther:
      "Autre",

    reportDescriptionLabel:
      "Description (facultative)",

    reportDescriptionPlaceholder:
      "Ajoutez des détails utiles pour l'examen...",

    reportSendButton:
      "Envoyer le signalement",

    reportSentThanks:
      "✓ Signalement envoyé. Merci de nous avoir prévenus.",

    cannotReportYourself:
      "Vous ne pouvez pas vous signaler vous-même.",

    reportUserTitle:
      "Signaler l'utilisateur",


    /* --- Avatar --- */

    changeProfilePhoto:
      "Changer la photo de profil",

    avatarTooLarge:
      "L'image dépasse 5 Mo. Choisissez-en une plus légère.",

    avatarUnsupportedFormat:
      "Format non pris en charge. Utilisez JPG, PNG ou WEBP.",

    avatarUpdated:
      "✓ Photo de profil mise à jour",


    /* --- Cookies & Conditions --- */

    cookieBannerTitle:
      "🍪 Cookies et préférences",

    cookieBannerText:
      "Nous utilisons des cookies techniques nécessaires au fonctionnement du site (langue, thème, session de connexion). Nous n'utilisons pas de cookies de profilage ou publicitaires. Pour en savoir plus, consultez notre",

    cookieBannerLink:
      "Politique de Confidentialité",

    cookieBannerAccept:
      "J'ai compris",

    termsCheckboxText:
      "J'accepte les",

    termsCheckboxAnd:
      "et la",

    termsOfServiceLink:
      "Conditions d'Utilisation",

    privacyPolicyLink:
      "Politique de Confidentialité",

    mustAcceptTerms:
      "Vous devez accepter les Conditions d'Utilisation et la Politique de Confidentialité pour vous inscrire.",


    /* --- Admin --- */

    adminOverview:
      "📊 Vue d'ensemble",

    adminIdentityVerifications:
      "Vérifications d'identité",

    adminTicketsToVerify:
      "Billets à vérifier",

    adminReportsCount:
      "🚩 Signalements",

    adminIdentitySection:
      "🪪 Vérifications d'identité",

    adminNoIdentityVerifications:
      "✓ Aucune vérification d'identité",

    adminNoIdentityText:
      "Il n'y a aucun document en attente de vérification.",

    adminTripsSection:
      "🎫 Vérifier les billets",

    adminTripsSectionText:
      "Vérifiez les billets téléchargés par les utilisateurs avant d'approuver le voyage.",

    adminNoTickets:
      "✓ Aucun billet en attente",

    adminNoTicketsText:
      "Tous les billets ont été vérifiés.",

    adminReportsSection:
      "🚩 Signalements",

    adminReportsSectionText:
      "Examinez les signalements envoyés par les utilisateurs.",

    adminNoReports:
      "✓ Aucun signalement",

    adminNoReportsText:
      "Il n'y a aucun signalement en attente.",

    adminMarkResolved:
      "✓ Marquer comme résolu",

    adminDismiss:
      "✕ Ignorer",

    adminSecurityLabel:
      "SÉCURITÉ",

    adminBackToSite:
      "← Retour au site",

    adminPanelTitle:
      "Panneau Hez Maak 🔐",

    adminPanelText:
      "Gestion des vérifications utilisateurs et voyages.",

    adminViewTicket:
      "👁 Voir le billet",

    adminApproveTicket:
      "✓ Approuver le billet",

    adminRejectTicket:
      "✕ Refuser",

    adminTicketToVerify:
      "BILLET À VÉRIFIER",

    adminUserIdLabel:
      "ID utilisateur",

    adminFrom:
      "De",

    adminAgainst:
      "Contre",

    adminSentOn:
      "Envoyée",


    /* --- Actions courantes --- */

    edit2:
      "✏️ Modifier",

    deleteButton:
      "🗑 Supprimer",

    cancelButton:
      "Annuler",

    genericError:
      "Erreur",

    sendingInProgress:
      "Envoi en cours...",

    uploadingInProgress:
      "Téléchargement en cours...",

    minimizeTitle:
      "Réduire",

    closeTitle:
      "Fermer",

    openChatTitle:
      "Ouvrir le chat",

    openMessagesTitle:
      "Ouvrir les messages",

    writeMessagePlaceholder:
      "Écrivez un message...",

    sendButton:
      "Envoyer",

    messagesTitle:
      "Messages",

    noMessagesYet:
      "Aucun message",

    newMessageReceived:
      "Nouveau message reçu",

    isTyping:
      "est en train d'écrire…",

    deliveryConfirmationSentTitle:
      "Confirmation envoyée",

    footerLegalTitle:
      "Mentions légales",

    footerCookiePreferences:
      "Préférences Cookies",

    countriesMustDiffer:
      "Le départ et l'arrivée doivent être dans des pays différents.",

    oneMustBeTunisia:
      "L'une des deux étapes (départ ou arrivée) doit être la Tunisie.",

    europeTunisia:
      "🇪🇺 Europe ↔ 🇹🇳 Tunisie",

    reviewsLabel:
      "LA COMMUNAUTÉ EN PARLE",

    reviewsHomeTitle:
      "Les témoignages de nos utilisateurs",

    reviewsEmptyTitle:
      "Les premières histoires arrivent",

    reviewsEmptyText:
      "Publiez un voyage ou une demande : après l'échange, vous pourrez laisser le premier avis et il apparaîtra ici."

  },


  /* ===================================================
     العربية التونسية
  =================================================== */

  tn: {

    navTrips: "السفرات",
    navRequests: "الطلبات",
    navHow: "كيفاش تخدم",

    loginRegister:
      "دخول / تسجيل",

    badge:
      "🇪🇺 أوروبا ↔ 🇹🇳 تونس",

    heroTitle:
      "هزّ اللي يلزم. <span>تواصل.</span> واربح.",

    heroText:
      "هزّ معاك تربط بين الناس اللي يحبّوا يبعثوا حاجات بين أوروبا وتونس والمسافرين والناقلين اللي عندهم بلاصة.",

    travelButton:
      "✈️ أنا مسافر",

    requestButton:
      "📦 نلوج على شكون",

    verifiedUsers:
      "مستعملين موثوقين",

    reviews:
      "التقييمات",

    securePayments:
      "خلاص آمن",

    routeTitle:
      "✈️ سفرة وفرصة",

    italy:
      "إيطاليا",

    tunisia:
      "تونس",

    europeLabel:
      "أوروبا",

    routeDescription:
      "عندك بلاصة في الفاليزة؟ تنجم تعاون شكون وتربح فلوس.",

    howLabel:
      "كيفاش تخدم",

    howTitle:
      "ساهلة، آمنة وإنسانية.",

    step1Title:
      "انشر",

    step1Text:
      "انشر سفرتك ولا قول شنوّة تحب تبعث.",

    step2Title:
      "تواصل",

    step2Text:
      "لقى شخص ماشي لنفس الوجهة.",

    step3Title:
      "نظّم",

    step3Text:
      "تواصل مع الشخص الآخر واتفقوا على التفاصيل.",

    step4Title:
      "قيّم",

    step4Text:
      "بعد الخدمة خلّي تقييم.",

    tripsLabel:
      "السفرات الموجودة",

    tripsTitle:
      "لقى مسافر",

    publishTrip:
      "+ انشر سفرة",

    requestsLabel:
      "الطلبات",

    requestsTitle:
      "شنوّة الناس تلوج عليه؟",

    publishRequest:
      "+ انشر طلب",

    loading:
      "جاري التحميل...",

    ctaTitle:
      "عندك سفرة مبرمجة؟",

    ctaText:
      "استغل البلاصة الفارغة في الفاليزة متاعك وحوّلها لفرصة تربح منها.",

    ctaButton:
      "انشر سفرتك",

    cvLabel1:
      "المنصّة",

    cvTitle1:
      "نقرّبو تونس<br>وكل أوروبا",

    cvText1:
      "ابعث ولا استقبل طرود بفضل المسافرين. بسيط، آمن وإنساني.",

    cvBtn1:
      "ادخل للمجتمع",

    cvLabel2:
      "أوروبا ↔ تونس",

    cvTitle2:
      "مسافر؟ عاون واربح",

    cvText2:
      "عندك بلاصة في الفاليزة؟ انشر سفرتك وعاون واحد بين أوروبا وتونس.",

    cvLabel3:
      "مجتمع",

    cvTitle3:
      "أكثر من خدمة،<br>مجتمع",

    cvText3:
      "تبعنا على فيسبوك باش تعرف الجديد ونصايح السفر وقصص المجتمع.",

    cvFbBtn:
      "تبع صفحتنا على فيسبوك",

    cvFbShort:
      "تبعنا على فيسبوك",

    followBtn:
      "🔔 تبع وجهة",

    followTitle:
      "تبع وجهة",

    followIntro:
      "اختار البلدان إلي تهمّك: باش يوصلك إشعار كل ما حدّ ينشر سفرة ولا طلب على نفس الطريق.",

    followOn:
      "تتبعها",

    followOff:
      "تبع",

    followClose:
      "سكّر",

    followMenu:
      "📍 الوجهات إلي تتبعها",

    followError:
      "ما نجمتش نحمّل الوجهات إلي تتبعها. عاود بعد شويّة.",

    sampleBadge:
      "مثال",

    sampleNotice:
      "هذي إعلانات مثال باش تفهم كيفاش يخدم الموقع. السفرات والطلبات الحقيقية باش تظهر هنا.",

    sampleTraveler:
      "مسافر مثال",

    sampleRequester:
      "طلب مثال",

    sampleItem1:
      "ملابس وصبابط",

    sampleItem2:
      "أكلات وبضايع تقليدية",

    sampleItem3:
      "هدايا صغيرة للعايلة",

    faqLabel:
      "أسئلة متكررة",

    faqTitle:
      "عندك أسئلة؟ هذي الإجابات",

    faq1Q:
      "كيفاش الدفع؟",

    faq1A:
      "الدفع يتفق عليه الطرفين مباشرة، برّا الموقع. هزّ معاك يعرّف بين الناس أما ما يتدخلش في الاتفاقات المالية.",

    faq2Q:
      "شنوّة نجم نبعث؟",

    faq2A:
      "ممنوع أي حاجة ممنوعة قانونيا ولا خطيرة ولا مقلّدة ولا عليها قيود في الديوانة. كل واحد لازم يحترم قوانين الديوانة في البلدان المعنية.",

    faq3Q:
      "هزّ معاك يراقب الطرود؟",

    faq3A:
      "لا. الموقع ما يراقبش محتوى الطرود: ديما تأكد شنوّة باش تتبعث واستعمل عقلك في الاتفاقات.",

    faq4Q:
      "شنوّة معناها بروفيل موثّق؟",

    faq4A:
      "الشارة معناها المستخدم حمّل وثيقة هوية وفريقنا راجعها. تزيد الثقة أما موش ضمان كامل.",

    faq5Q:
      "كيفاش يخدم «تبع وجهة»؟",

    faq5A:
      "اختار بلد ولا أكثر: كل ما تنشر سفرة ولا طلب على الطريق هذاكا يوصلك إشعار، وما يفوتك شي.",

    spLabel1:
      "الرعاة · الإشهار",

    spTitle1:
      "خلّي الناس<br>تعرف نشاطك",

    spText1:
      "وصّل لمجتمع حيّ بين أوروبا وتونس.",

    spBtn1:
      "ولّي راعي معانا",

    spLabel2:
      "شراكة",

    spTitle2:
      "ولّي الراعي متاعنا",

    spText2:
      "علامتك قدّام الناس إلي تسافر وتبعث كل يوم.",

    spB1T:
      "ظهور أكثر",

    spB1S:
      "الشعار والبانر في الواجهة",

    spB2T:
      "جمهور مستهدف",

    spB2S:
      "ناس بين إيطاليا وتونس",

    spB3T:
      "علامة موثوقة",

    spB3S:
      "مرتبطة بمجتمع كبير",

    spLabel3:
      "نشاطك في السفر",

    spTitle3a:
      "مجتمع يسافر،",

    spTitle3b:
      "وجمهور يسمعك",

    spText3:
      "اشهر نشاطك على هزّ معاك.",

    spBtn3:
      "اتصل بينا",

    spPrev:
      "السابق",

    spNext:
      "التالي",

    footerBrand:
      "هزّ معاك",

    securityTitle:
      "الأمان",

    verifyIdentity:
      "ثبّت هويتك",

    support:
      "المساعدة",

    loginTitle:
      "ادخل لهزّ معاك",

    loginText:
      "ادخل لحسابك.",

    email:
      "الإيميل",

    password:
      "كلمة السر",

    login:
      "دخول",

    noAccount:
      "ما عندكش حساب؟",

    register:
      "سجّل",

    createAccount:
      "اعمل حساب",

    joinCommunity:
      "انضم لمجتمع هزّ معاك.",

    fullName:
      "الاسم واللقب",

    accountType:
      "نوع الحساب",

    private:
      "👤 شخص عادي",

    traveler:
      "✈️ مسافر",

    company:
      "🚚 شركة / ناقل",

    country:
      "البلاد",

    create:
      "سجّل",

    alreadyAccount:
      "عندك حساب؟",

    backToLogin:
      "ادخل",

    fillFields:
      "عمّر الخانات الكل.",

    accountCreated:
      "الحساب تعمل. ثبّت الإيميل متاعك باش تفعّل الحساب.",

    tripPublished:
      "✓ السفرة تنشرت والتذكرة تبعثت للمراجعة.",

    requestPublished:
      "✓ الطلب تنشر!",

    profile:
      "👤 البروفايل متاعي",

    verifiedProfile:
      "✓ بروفايل موثوق",

    notVerified:
      "○ البروفايل موش موثوق",

    personalInfo:
      "المعلومات الشخصية",

    edit:
      "بدّل",

    countryLabel:
      "البلاد",

    accountLabel:
      "نوع الحساب",

    security:
      "الأمان",

    verifyTitle:
      "🪪 ثبّت هويتك",

    verifyText:
      "ثبّت هويتك باش تاخو علامة ✓ وتزيد ثقة الناس فيك.",

    verifyButton:
      "🪪 ثبّت الهوية",

    verified:
      "✓ موثوق",

    verifiedIdentity:
      "✓ هويتك تثبّتت.",

    identityVerified:
      "الهوية موثوقة",

    pending:
      "⏳ التثبت جاري",

    rejected:
      "⚠️ التثبت ترفض",

    documentType:
      "نوع الوثيقة",

    passport:
      "🛂 باسبورت",

    identityCard:
      "🪪 بطاقة تعريف",

    document:
      "الوثيقة",

    sendDocument:
      "🔐 ابعث الوثيقة",

    uploadHelp:
      "الصيغ المقبولة: JPG, PNG, PDF. الحجم الأقصى: 10 ميغا.",

    uploadInProgress:
      "جاري رفع الملف...",

    documentSent:
      "✓ الوثيقة تبعثت بنجاح.",

    reviewText:
      "الوثيقة توّا تحت المراجعة.",

    publishTripTitle:
      "✈️ انشر سفرة",

    tripDescription:
      "دخل تفاصيل سفرتك.",

    departure:
      "الانطلاق",

    arrival:
      "الوصول",

    departureCity:
      "مدينة الانطلاق",

    arrivalCity:
      "مدينة الوصول",

    travelDate:
      "تاريخ السفر",

    availableKg:
      "الكيلوغرامات المتوفرة",

    priceKg:
      "السعر €/كغ",

    description:
      "الوصف",

    ticket:
      "📄 تذكرة السفر",

    ticketHelp:
      "ارفع صورة ولا screenshot ولا PDF للتذكرة. التذكرة خاصة وما يشوفها كان المسؤول للمراجعة. أقصى حجم 10 ميغا.",

    publish:
      "انشر",

    requestTitle:
      "📦 انشر طلب",

    itemDescription:
      "شنوّة تحب تبعث؟",

    weight:
      "الوزن بالكيلو",

    budget:
      "الميزانية €",

    myActivity:
      "النشاط متاعي",

    myTrips:
      "السفرات متاعي",

    manageTrips:
      "إدارة السفرات",

    myRequests:
      "الطلبات متاعي",

    manageRequests:
      "إدارة الطلبات",

    myReviews:
      "التقييمات متاعي",

    viewReviews:
      "شوف التقييمات",

    logout:
      "🚪 خروج",

    backHome:
      "← ارجع لهزّ معاك",

    contact:
      "اتصل",

    admin:
      "🔐 مسؤول",

    administration:
      "الإدارة",

    adminTitle:
      "لوحة هزّ معاك 🔐",

    adminDescription:
      "إدارة التثبت من الهوية.",

    pendingRequests:
      "طلبات تستنى في المراجعة",

    everythingOk:
      "✓ كل شيء تمام",

    noPending:
      "ما فماش عمليات تثبت تستنى.",

    viewDocument:
      "👁 شوف الوثيقة",

    approve:
      "✓ وافق",

    reject:
      "✕ ارفض",

    user:
      "المستعمل",

    sent:
      "تبعت في",

    noTrips:
      "✈️ ما فماش سفرات متوفرة",

    publishFirstTrip:
      "انشر أول سفرة.",

    noRequests:
      "📦 ما فماش طلبات",

    publishFirstRequest:
      "انشر أول طلب.",

    verifiedTrip:
      "✈️ سفرة موثوقة",

    ticketPending:
      "⏳ التذكرة تحت المراجعة",

    verificationRejected:
      "⚠️ التثبت ما تقبلش",

    kg:
      "كغ",

    contactSoon:
      "المراسلة باش تتربط بجدول messages في المرحلة الجاية.",

    reviewsComing:
      "نظام التقييمات باش يتربط بقاعدة البيانات في المرحلة الجاية.",

    editComing:
      "تعديل البروفايل باش يكون متوفر في المرحلة الجاية.",

    noTripsUser:
      "ما نشرت حتى سفرة.",

    noRequestsUser:
      "ما نشرت حتى طلب.",


    /* --- الاتفاق / التسليم / التقييم (الشات) --- */

    agreementQuestion:
      "اتفقتوا مع بعضكم؟",

    agreementSubtext:
      "أكد باش تسكر الإعلان العمومي",

    agreementConfirmButton:
      "أكد الاتفاق",

    agreementConfirmedTitle:
      "الاتفاق تأكد",

    waitingOtherParty:
      "نستنى الطرف الآخر",

    deliveryQuestion:
      "التسليم صار؟",

    deliverySubtext:
      "أكد كي توصل الحاجة",

    deliveryConfirmButton:
      "أكد",

    deliveryConfirmedTitle:
      "التسليم تأكد",

    deliveryConfirmedSubtext:
      "كيفاش مشات؟ خلي تقييم.",

    reviewSentTitle:
      "التقييم تبعث",

    reviewSentSubtext:
      "شكرا على رأيك",

    toastAgreementBoth:
      "🤝 الاتفاق تأكد من الطرفين!",

    toastAgreementWaiting:
      "🤝 التأكيد تسجل. نستنى الطرف الآخر.",

    toastDeliveryBoth:
      "✓ التسليم تأكد من الطرفين!",

    toastDeliveryWaiting:
      "✓ التأكيد تسجل. نستنى الطرف الآخر.",

    howWasIt:
      "كيفاش مشى البعث؟",

    reviewSentThanks:
      "✓ التقييم تبعث. شكرا!",

    selectAtLeastOneStar:
      "اختار نجمة وحدة على الأقل.",

    alreadyReviewedConversation:
      "خليت تقييم قبل لهاذي المحادثة.",

    sendReview:
      "ابعث التقييم",

    optionalComment:
      "خلي تعليق (مش إجباري)",


    /* --- التبليغ --- */

    reportButton:
      "بلّغ",

    reportTitle:
      "🚩 بلّغ",

    reportIntro:
      "عاوننا نحافظو على أمان المجتمع. التبليغ باش يتراجع من الإدارة.",

    reportReasonLabel:
      "السبب",

    reportReasonSpam:
      "سبام ولا إعلان كاذب",

    reportReasonScam:
      "نصب مشكوك فيه",

    reportReasonInappropriate:
      "تصرف موش مناسب",

    reportReasonFakeProfile:
      "بروفايل كاذب",

    reportReasonOther:
      "حاجة أخرى",

    reportDescriptionLabel:
      "الوصف (مش إجباري)",

    reportDescriptionPlaceholder:
      "زيد تفاصيل تفيد المراجعة...",

    reportSendButton:
      "ابعث التبليغ",

    reportSentThanks:
      "✓ التبليغ تبعث. شكرا على التنبيه.",

    cannotReportYourself:
      "ما تنجمش تبلّغ على روحك.",

    reportUserTitle:
      "بلّغ على المستعمل",


    /* --- الصورة الشخصية --- */

    changeProfilePhoto:
      "بدّل صورة البروفايل",

    avatarTooLarge:
      "الصورة أكبر من 5 ميغا. اختار وحدة أصغر.",

    avatarUnsupportedFormat:
      "الصيغة موش مدعومة. استعمل JPG, PNG ولا WEBP.",

    avatarUpdated:
      "✓ صورة البروفايل تبدلت",


    /* --- الكوكيز و الشروط --- */

    cookieBannerTitle:
      "🍪 الكوكيز والتفضيلات",

    cookieBannerText:
      "نستعملو كوكيز تقنية ضرورية باش الموقع يخدم (اللغة، الثيم، جلسة الدخول). ما نستعملوش كوكيز للإشهار. أكثر تفاصيل في",

    cookieBannerLink:
      "سياسة الخصوصية",

    cookieBannerAccept:
      "فهمت",

    termsCheckboxText:
      "نوافق على",

    termsCheckboxAnd:
      "و",

    termsOfServiceLink:
      "شروط الخدمة",

    privacyPolicyLink:
      "سياسة الخصوصية",

    mustAcceptTerms:
      "لازمك توافق على شروط الخدمة وسياسة الخصوصية باش تسجل.",


    /* --- الإدارة --- */

    adminOverview:
      "📊 نظرة عامة",

    adminIdentityVerifications:
      "التثبت من الهوية",

    adminTicketsToVerify:
      "تذاكر تستنى المراجعة",

    adminReportsCount:
      "🚩 التبليغات",

    adminIdentitySection:
      "🪪 التثبت من الهوية",

    adminNoIdentityVerifications:
      "✓ ما فماش تثبت هوية",

    adminNoIdentityText:
      "ما فماش وثائق تستنى المراجعة.",

    adminTripsSection:
      "🎫 تثبت التذاكر",

    adminTripsSectionText:
      "راجع التذاكر اللي رفعوها المستعملين قبل ما توافق على السفرة.",

    adminNoTickets:
      "✓ ما فماش تذاكر تستنى",

    adminNoTicketsText:
      "كل التذاكر تثبتت.",

    adminReportsSection:
      "🚩 التبليغات",

    adminReportsSectionText:
      "راجع التبليغات اللي بعثوها المستعملين.",

    adminNoReports:
      "✓ ما فماش تبليغات",

    adminNoReportsText:
      "ما فماش تبليغات تستنى.",

    adminMarkResolved:
      "✓ حِلّت",

    adminDismiss:
      "✕ تجاهل",

    adminSecurityLabel:
      "الأمان",

    adminBackToSite:
      "← ارجع للموقع",

    adminPanelTitle:
      "لوحة هزّ معاك 🔐",

    adminPanelText:
      "إدارة تثبت المستعملين والسفرات.",

    adminViewTicket:
      "👁 شوف التذكرة",

    adminApproveTicket:
      "✓ وافق على التذكرة",

    adminRejectTicket:
      "✕ ارفض",

    adminTicketToVerify:
      "تذكرة تستنى المراجعة",

    adminUserIdLabel:
      "معرف المستعمل",

    adminFrom:
      "من",

    adminAgainst:
      "ضد",

    adminSentOn:
      "تبعثت",


    /* --- أفعال عامة --- */

    edit2:
      "✏️ بدّل",

    deleteButton:
      "🗑 امسح",

    cancelButton:
      "الغي",

    genericError:
      "خطأ",

    sendingInProgress:
      "جاري البعث...",

    uploadingInProgress:
      "جاري الرفع...",

    minimizeTitle:
      "صغّر",

    closeTitle:
      "سكّر",

    openChatTitle:
      "افتح الشات",

    openMessagesTitle:
      "افتح الرسائل",

    writeMessagePlaceholder:
      "اكتب رسالة...",

    sendButton:
      "ابعث",

    messagesTitle:
      "الرسائل",

    noMessagesYet:
      "ما فماش رسائل",

    newMessageReceived:
      "توصلت رسالة جديدة",

    isTyping:
      "قاعد يكتب…",

    deliveryConfirmationSentTitle:
      "التأكيد تبعث",

    footerLegalTitle:
      "قانوني",

    footerCookiePreferences:
      "تفضيلات الكوكيز",

    countriesMustDiffer:
      "الانطلاق والوصول لازم يكونوا في بلاد مختلفة.",

    oneMustBeTunisia:
      "لازم واحدة من الوجهتين (الانطلاق ولا الوصول) تكون تونس.",

    europeTunisia:
      "🇪🇺 أوروبا ↔ 🇹🇳 تونس",

    reviewsLabel:
      "المجتمع يحكي",

    reviewsHomeTitle:
      "قصص ناس استعملو هزّ معاك",

    reviewsEmptyTitle:
      "أول القصص جايّة في الطريق",

    reviewsEmptyText:
      "انشر سفرة ولا طلب، وبعد التبادل تنجم تخلي أول تقييم وباش يظهر هنا."

  }

};


/* =====================================================
   TRANSLATION HELPERS
===================================================== */

function t(key) {

  const language =
    translations[currentLanguage] ||
    translations.it;

  return (
    language[key] ||
    translations.it[key] ||
    key
  );

}


function applyTranslations() {

  const language =
    translations[currentLanguage] ||
    translations.it;


  document.documentElement.lang =
    currentLanguage === "tn"
      ? "ar"
      : currentLanguage;


  document.documentElement.dir =
    currentLanguage === "tn"
      ? "rtl"
      : "ltr";


  document
    .querySelectorAll("[data-i18n]")
    .forEach(element => {

      const key =
        element.dataset.i18n;

      if (
        language[key] !== undefined
      ) {

        element.innerHTML =
          language[key];

      }

    });


  const button =
    document.getElementById(
      "languageButton"
    );

  if (button) {

    const selected =
      languages.find(
        language =>
          language.code === currentLanguage
      );

    if (selected) {
      button.textContent =
        selected.label;
    }

  }


  if (typeof refreshSponsorCarousel === "function") {
    refreshSponsorCarousel();
  }

  if (typeof refreshLocalizedForms === "function") {
    refreshLocalizedForms();
  }


  localStorage.setItem(
    "hezmaak_language",
    currentLanguage
  );

}


/* =====================================================
   CHANGE LANGUAGE
===================================================== */

function cycleLanguage() {

  const index =
    languages.findIndex(
      language =>
        language.code === currentLanguage
    );

  const nextIndex =
    index === -1
      ? 0
      : (index + 1) % languages.length;

  currentLanguage =
    languages[nextIndex].code;

  applyTranslations();

  /*
    Ricarica i contenuti dinamici
    nella nuova lingua.
  */

  loadTrips();
  loadRequests();
  loadHomeReviews();

}


/* =====================================================
   START
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    applyTranslations();

    await loadUser();

    createAuthModal();

    createTripModal();

    createRequestModal();

    updateHeader();

    setupActions();

    loadTrips();

    loadRequests();

    loadHomeReviews();

    initPhotoCarousel();

    initContentCarousels();

    initSponsorCarousel();

    initBackToTop();

    initCookieBanner();

  }
);


/* =====================================================
   COOKIE BANNER
===================================================== */

function initCookieBanner() {

  const consent =
    localStorage.getItem("hezmaak_cookie_consent");

  if (!consent) {
    showCookieBanner();
  }

}


function showCookieBanner() {

  const banner =
    document.getElementById("cookieBanner");

  if (banner) {
    banner.style.display = "flex";
  }

}


function acceptCookies() {

  localStorage.setItem("hezmaak_cookie_consent", "1");

  const banner =
    document.getElementById("cookieBanner");

  if (banner) {
    banner.style.display = "none";
  }

}


/* =====================================================
   RECENSIONI IN HOME
===================================================== */

function renderReviewsEmptyState(container) {

  container.innerHTML = `
    <div class="reviews-empty">

      <div class="reviews-empty-icon">⭐</div>

      <h3>${t("reviewsEmptyTitle")}</h3>

      <p>${t("reviewsEmptyText")}</p>

      <button
        type="button"
        class="primary"
        data-action="publish-trip"
      >
        ${t("ctaButton")}
      </button>

    </div>
  `;

  setupActions();

}


async function loadHomeReviews() {

  const container =
    document.getElementById("homeReviewsContainer");

  if (!container) return;

  const { data, error } =
    await supabaseClient
      .from("reviews")
      .select(`
        id,
        rating,
        comment,
        created_at,
        reviewed_user_id,
        profiles!reviews_reviewed_user_id_fkey (
          full_name,
          avatar_url
        )
      `)
      .not("comment", "is", null)
      .order("created_at", { ascending: false })
      .limit(12);

  if (error) {

    console.error("Errore caricamento recensioni home:", error);

    renderReviewsEmptyState(container);

    return;

  }

  if (!data || !data.length) {

    renderReviewsEmptyState(container);

    return;

  }

  container.innerHTML =
    data.map(reviewHomeCard).join("");

}


function reviewHomeCard(review) {

  const profile = review.profiles || {};

  const rating =
    Math.max(1, Math.min(5, Number(review.rating) || 0));

  const stars = "⭐".repeat(rating);

  const date =
    review.created_at
      ? new Date(review.created_at).toLocaleDateString("it-IT")
      : "";

  return `
    <div class="review-home-card">

      <div class="review-home-header">

        ${avatarHtml(profile.avatar_url, 40)}

        <div>
          <strong>${escapeHtml(profile.full_name || "Utente Hez Maak")}</strong>
          <div class="review-home-stars">${stars}</div>
        </div>

      </div>

      <p class="review-home-comment">
        "${escapeHtml(review.comment)}"
      </p>

      <span class="review-home-date">${date}</span>

    </div>
  `;

}


/* =====================================================
   CAROSELLO FOTO
===================================================== */

let carouselIndex = 0;
let carouselSlideCount = 0;

function initPhotoCarousel() {

  const track =
    document.getElementById("photoCarouselTrack");

  const dotsContainer =
    document.getElementById("carouselDots");

  if (!track || !dotsContainer) return;

  const slides =
    track.querySelectorAll(".photo-carousel-slide");

  carouselSlideCount = slides.length;

  dotsContainer.innerHTML =
    Array.from(slides)
      .map((_, i) => `
        <button
          type="button"
          class="carousel-dot ${i === 0 ? "active" : ""}"
          onclick="goToPhotoCarouselSlide(${i})"
        ></button>
      `)
      .join("");

  // Auto-scroll ogni 4 secondi
  setInterval(() => {
    movePhotoCarousel(1);
  }, 4000);

}


function movePhotoCarousel(direction) {

  carouselIndex =
    (carouselIndex + direction + carouselSlideCount) % carouselSlideCount;

  applyCarouselPosition();

}


function goToPhotoCarouselSlide(index) {

  carouselIndex = index;

  applyCarouselPosition();

}


function applyCarouselPosition() {

  const track =
    document.getElementById("photoCarouselTrack");

  if (!track) return;

  track.style.transform =
    `translateX(-${carouselIndex * 100}%)`;

  document
    .querySelectorAll(".carousel-dot")
    .forEach((dot, i) => {
      dot.classList.toggle("active", i === carouselIndex);
    });

}


/* =====================================================
   USER
===================================================== */

async function loadUser() {

  const {
    data: { user }
  } =
    await supabaseClient.auth.getUser();

  currentUser =
    user || null;

  updateAdminButton();

}


/* =====================================================
   HEADER
===================================================== */

function updateHeader() {

  const button =
    document.getElementById(
      "authButton"
    );

  if (!button) return;


  if (currentUser) {

    button.textContent =
      t("profile");

    button.onclick =
      showProfile;

  } else {

    button.textContent =
      t("loginRegister");

    button.onclick =
      () => openAuth("login");

  }

  updateNotificationBell();

  updateMessagesButton();

}


/* =====================================================
   ACTIONS
===================================================== */

function setupActions() {

  document
    .querySelectorAll(
      '[data-action="publish-trip"]'
    )
    .forEach(button => {

      button.onclick =
        event => {

          event.preventDefault();

          if (!currentUser) {

            openAuth("login");

            return;

          }

          openTripModal();

        };

    });


  document
    .querySelectorAll(
      '[data-action="publish-request"]'
    )
    .forEach(button => {

      button.onclick =
        event => {

          event.preventDefault();

          if (!currentUser) {

            openAuth("login");

            return;

          }

          openRequestModal();

        };

    });

}


/* =====================================================
   AUTH MODAL
===================================================== */

function createAuthModal() {

  if (
    document.getElementById(
      "authModal"
    )
  ) return;


  const modal =
    document.createElement(
      "div"
    );

  modal.id =
    "authModal";


  modal.innerHTML = `

    <div class="auth-overlay">

      <div class="auth-box">

        <button
          class="auth-close"
          onclick="closeAuth()">

          ×

        </button>


        <div id="loginView">

          <h2>
            ${t("loginTitle")}
          </h2>

          <p>
            ${t("loginText")}
          </p>


          <input
            id="loginEmail"
            type="email"
            placeholder="${t("email")}"
          >


          <input
            id="loginPassword"
            type="password"
            placeholder="${t("password")}"
          >


          <button
            class="primary auth-button"
            onclick="login()">

            ${t("login")}

          </button>


          <p class="auth-switch">

            ${t("noAccount")}

            <button
              onclick="showRegister()">

              ${t("register")}

            </button>

          </p>

        </div>


        <div
          id="registerView"
          style="display:none"
        >

          <h2>
            ${t("createAccount")}
          </h2>

          <p>
            ${t("joinCommunity")}
          </p>


          <input
            id="registerName"
            type="text"
            placeholder="${t("fullName")}"
          >


          <input
            id="registerEmail"
            type="email"
            placeholder="${t("email")}"
          >


          <input
            id="registerPassword"
            type="password"
            placeholder="${t("password")}"
          >


          <select id="registerType">

            <option value="private">
              ${t("private")}
            </option>

            <option value="traveler">
              ${t("traveler")}
            </option>

            <option value="company">
              ${t("company")}
            </option>

          </select>


          <select id="registerCountry">

            ${countryOptions("tunisia")}

          </select>


          <label class="terms-checkbox-label">

            <input
              type="checkbox"
              id="registerTermsAccepted"
            >

            ${t("termsCheckboxText")}
            <a href="termini.html" target="_blank">${t("termsOfServiceLink")}</a>
            ${t("termsCheckboxAnd")}
            <a href="privacy.html" target="_blank">${t("privacyPolicyLink")}</a>

          </label>


          <button
            class="primary auth-button"
            onclick="register()">

            ${t("create")}

          </button>


          <p class="auth-switch">

            ${t("alreadyAccount")}

            <button
              onclick="showLogin()">

              ${t("backToLogin")}

            </button>

          </p>

        </div>


        <div id="authMessage"></div>

      </div>

    </div>

  `;


  document.body.appendChild(
    modal
  );

}


function openAuth(
  mode = "login"
) {

  const modal =
    document.getElementById(
      "authModal"
    );

  if (!modal) {

    createAuthModal();

  }


  document
    .getElementById(
      "authModal"
    )
    .style.display =
    "block";


  if (mode === "register") {

    showRegister();

  } else {

    showLogin();

  }

}


function closeAuth() {

  const modal =
    document.getElementById(
      "authModal"
    );

  if (modal) {

    modal.style.display =
      "none";

  }

}


function showLogin() {

  document
    .getElementById(
      "loginView"
    )
    .style.display =
    "block";


  document
    .getElementById(
      "registerView"
    )
    .style.display =
    "none";


  clearMessage();

}


function showRegister() {

  document
    .getElementById(
      "loginView"
    )
    .style.display =
    "none";


  document
    .getElementById(
      "registerView"
    )
    .style.display =
    "block";


  clearMessage();

}


function showMessage(
  text,
  error = false
) {

  const element =
    document.getElementById(
      "authMessage"
    );

  if (!element) return;

  element.textContent =
    text;

  element.className =
    error
      ? "auth-error"
      : "auth-success";

}


function clearMessage() {

  const element =
    document.getElementById(
      "authMessage"
    );

  if (!element) return;

  element.textContent =
    "";

  element.className =
    "";

}


/* =====================================================
   REGISTER
===================================================== */

async function register() {

  const name =
    document.getElementById(
      "registerName"
    ).value.trim();

  const email =
    document.getElementById(
      "registerEmail"
    ).value.trim();

  const password =
    document.getElementById(
      "registerPassword"
    ).value;

  const type =
    document.getElementById(
      "registerType"
    ).value;

  const country =
    document.getElementById(
      "registerCountry"
    ).value;

  const termsAccepted =
    document.getElementById(
      "registerTermsAccepted"
    ).checked;


  if (
    !name ||
    !email ||
    !password
  ) {

    showMessage(
      t("fillFields"),
      true
    );

    return;

  }


  if (!termsAccepted) {

    showMessage(
      t("mustAcceptTerms"),
      true
    );

    return;

  }


  const {
    data,
    error
  } =
    await supabaseClient.auth.signUp({

      email,

      password,

      options: {

        data: {
          full_name: name,
          user_type: type,
          country: country
        }

      }

    });


  if (error) {

    showMessage(
      error.message,
      true
    );

    return;

  }


  if (data.user) {

    await supabaseClient
      .from("profiles")
      .upsert({

        id:
          data.user.id,

        full_name:
          name,

        country:
          country,

        user_type:
          type,

        terms_accepted_at:
          new Date().toISOString()

      });

  }


  showMessage(
    t("accountCreated")
  );

}


/* =====================================================
   LOGIN
===================================================== */

async function login() {

  const email =
    document.getElementById(
      "loginEmail"
    ).value.trim();

  const password =
    document.getElementById(
      "loginPassword"
    ).value;


  const {
    error
  } =
    await supabaseClient.auth
      .signInWithPassword({

        email,
        password

      });


  if (error) {

    showMessage(
      error.message,
      true
    );

    return;

  }


  await loadUser();

  closeAuth();

  updateHeader();

  setupActions();

  loadTrips();

  loadRequests();

}


/* =====================================================
   LOGOUT
===================================================== */

async function logout() {

  const {
    error
  } =
    await supabaseClient.auth.signOut();


  if (error) {

    alert(
      error.message
    );

    return;

  }


  currentUser =
    null;

  if (typeof closePro === "function") closePro();


  const profilePage =
    document.getElementById(
      "profilePage"
    );

  if (profilePage) {

    profilePage.remove();

  }


  updateHeader();

  setupActions();

}


/* =====================================================
   PROFILE
===================================================== */

async function showProfile() {

  if (!currentUser) {

    openAuth("login");

    return;

  }


  const {
    data: profile,
    error
  } =
    await supabaseClient
      .from("profiles")
      .select("*")
      .eq(
        "id",
        currentUser.id
      )
      .single();


  if (error) {

    alert(
      error.message
    );

    return;

  }


  const existing =
    document.getElementById(
      "profilePage"
    );

  if (existing) {

    existing.remove();

  }


  const name =
    profile.full_name ||
    "Hez Maak";


  const country =
    countryFlag(profile.country) + " " + countryName(profile.country);


  const type =
    profile.user_type === "company"
      ? t("company")
      : profile.user_type === "traveler"
        ? t("traveler")
        : t("private");


  const verified =
    profile.is_verified === true;


  const rating =
    Number(
      profile.rating || 0
    ).toFixed(1);


  const reviews =
    profile.reviews_count || 0;


  const page =
    document.createElement(
      "div"
    );

  page.id =
    "profilePage";


  page.innerHTML = `

    <div class="profile-page">

      <div class="container">


        <button
          class="back-button"
          onclick="closeProfilePage()">

          ${t("backHome")}

        </button>


        <div class="profile-layout">


          <aside class="profile-sidebar">


            <div class="profile-avatar-wrap">

              <div
                class="profile-avatar"
                id="profileAvatarDisplay"
              >

                ${
                  profile.avatar_url
                    ? `<img src="${escapeHtml(profile.avatar_url)}" alt="${escapeHtml(name)}">`
                    : `<span>👤</span>`
                }

              </div>

              <button
                type="button"
                class="avatar-edit-button"
                title="${t("changeProfilePhoto")}"
                onclick="document.getElementById('avatarUploadInput').click()">

                📷

              </button>

              <input
                type="file"
                id="avatarUploadInput"
                accept=".jpg,.jpeg,.png,.webp"
                style="display:none"
                onchange="uploadAvatar(this)"
              >

            </div>


            <h2>
              ${escapeHtml(name)}
            </h2>


            <p class="profile-email">

              ${escapeHtml(
                currentUser.email || ""
              )}

            </p>


            <div class="profile-badge
              ${
                verified
                  ? "verified-profile"
                  : "not-verified"
              }">

              ${
                verified
                  ? t("verifiedProfile")
                  : t("notVerified")
              }

            </div>


            <div class="profile-rating">

              <strong>
                ⭐ ${rating}
              </strong>

              <span>
                ${reviews} ${t("reviews")}
              </span>

            </div>


            <button
              class="primary profile-action"
              onclick="closeProfilePage(); openTripModal();">

              ${t("travelButton")}

            </button>


            <button
              class="secondary profile-action"
              onclick="closeProfilePage(); openRequestModal();">

              ${t("requestButton")}

            </button>


            <button
              class="logout-button"
              onclick="logout();">

              ${t("logout")}

            </button>


          </aside>



          <main class="profile-main">


            <div class="profile-header">

              <div>

                <span class="section-label">
                  ${t("profile")}
                </span>

                <h1>
                  ${t("profile")} 👋
                </h1>

                <p>
                  ${t("personalInfo")}
                </p>

              </div>

            </div>



            <section class="profile-card">


              <div class="profile-card-title">

                <h3>
                  ${t("personalInfo")}
                </h3>


                <button
                  class="small-button"
                  onclick="editProfile()">

                  ${t("edit")}

                </button>

              </div>



              <div class="profile-info-grid">


                <div>

                  <span>
                    ${t("fullName")}
                  </span>

                  <strong>
                    ${escapeHtml(name)}
                  </strong>

                </div>


                <div>

                  <span>
                    ${t("email")}
                  </span>

                  <strong>
                    ${escapeHtml(
                      currentUser.email || "-"
                    )}
                  </strong>

                </div>


                <div>

                  <span>
                    ${t("countryLabel")}
                  </span>

                  <strong>
                    ${country}
                  </strong>

                </div>


                <div>

                  <span>
                    ${t("accountLabel")}
                  </span>

                  <strong>
                    ${type}
                  </strong>

                </div>


              </div>

            </section>



            <section
              class="profile-card verification-card"
            >


              <div>

                <span class="section-label">
                  ${t("security")}
                </span>


                <h3>
                  ${t("verifyTitle")}
                </h3>


                ${
                  verified

                    ? `

                      <p class="success-text">
                        ${t("verifiedIdentity")}
                      </p>

                    `

                    : `

                      <p>
                        ${t("verifyText")}
                      </p>

                    `
                }

              </div>


              ${
                verified

                  ? `

                    <div class="verification-status">
                      ${t("verified")}
                    </div>

                  `

                  : `

                    <button
                      class="primary"
                      onclick="openVerification()">

                      ${t("verifyButton")}

                    </button>

                  `
              }


            </section>



            <section class="profile-card">


              <h3>
                ${t("myActivity")}
              </h3>


              <div class="profile-menu-grid">

              <button onclick="openMessages()" class="profile-button">
                 💬 Messaggi <span id="unreadCount"></span>
              </button>

              <button onclick="openFollowModal()" class="profile-button">
                 ${t("followMenu")}
              </button>
              <button onclick="openPro()" class="profile-button">
                 🚚 ${t("proMenu")}
              </button>


                <button
                  onclick="showMyTrips()">

                  <span>✈️</span>

                  <strong>
                    ${t("myTrips")}
                  </strong>

                  <small>
                    ${t("manageTrips")}
                  </small>

                </button>


                <button
                  onclick="showMyRequests()">

                  <span>📦</span>

                  <strong>
                    ${t("myRequests")}
                  </strong>

                  <small>
                    ${t("manageRequests")}
                  </small>

                </button>


                <button
                  onclick="showMyReviews()">

                  <span>⭐</span>

                  <strong>
                    ${t("myReviews")}
                  </strong>

                  <small>
                    ${t("viewReviews")}
                  </small>

                </button>


                <button
                  onclick="openVerification()">

                  <span>🪪</span>

                  <strong>
                    ${t("verifyIdentity")}
                  </strong>

                  <small>
                    ${t("verifyText")}
                  </small>

                </button>


              </div>


            </section>


          </main>

        </div>

      </div>

    </div>

  `;


  document.body.appendChild(
    page
  );


  document.body.style.overflow =
    "hidden";
  updateUnreadCount();
}

/*=============================*/
/* =====================================================
   MESSAGGISTICA - LISTA CONVERSAZIONI
===================================================== */

let messagesListChannel = null;

/* =====================================================
   FOTO PROFILO
===================================================== */

async function uploadAvatar(input) {

  if (!currentUser) {
    openAuth("login");
    return;
  }

  if (!input.files || !input.files.length) {
    return;
  }

  const file = input.files[0];

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    alert(t("avatarTooLarge"));
    return;
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
  ];

  if (!allowedTypes.includes(file.type)) {
    alert(t("avatarUnsupportedFormat"));
    return;
  }

  const extension =
    file.name.split(".").pop().toLowerCase();

  const filePath =
    `${currentUser.id}/avatar-${Date.now()}.${extension}`;

  const { error: uploadError } =
    await supabaseClient
      .storage
      .from("avatars")
      .upload(filePath, file, {
        upsert: false,
        contentType: file.type
      });

  if (uploadError) {
    console.error(uploadError);
    alert("Errore caricamento immagine: " + uploadError.message);
    return;
  }

  const { data: publicUrlData } =
    supabaseClient
      .storage
      .from("avatars")
      .getPublicUrl(filePath);

  const avatarUrl = publicUrlData.publicUrl;

  const { error: updateError } =
    await supabaseClient
      .from("profiles")
      .update({ avatar_url: avatarUrl })
      .eq("id", currentUser.id);

  if (updateError) {
    console.error(updateError);
    alert("Errore aggiornamento profilo: " + updateError.message);
    return;
  }

  // Aggiorna subito l'immagine visibile senza ricaricare tutta la pagina
  const display = document.getElementById("profileAvatarDisplay");

  if (display) {
    display.innerHTML = `<img src="${escapeHtml(avatarUrl)}" alt="Avatar">`;
  }

  showToast(t("avatarUpdated"));

}


/* =====================================================
   RECUPERO AVATAR UTENTE (per card/chat)
===================================================== */

async function getUserProfileBasic(userId) {

  const { data, error } =
    await supabaseClient
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", userId)
      .single();

  if (error || !data) {
    return { full_name: "Utente", avatar_url: null };
  }

  return data;

}


function avatarHtml(avatarUrl, size = 44) {

  if (avatarUrl) {

    return `
      <img
        class="avatar-img"
        src="${escapeHtml(avatarUrl)}"
        alt=""
        style="width:${size}px;height:${size}px;"
      >
    `;

  }

  return `
    <div
      class="avatar avatar-placeholder"
      style="width:${size}px;height:${size}px;"
    >
      👤
    </div>
  `;

}




/* =====================================================
   SISTEMA DI NOTIFICHE (rotte di interesse)
===================================================== */

async function notifyMatchingUsers({
  matchTable,
  matchDepartureCountry,
  matchArrivalCountry,
  notificationType,
  title,
  message,
  tripId = null,
  requestId = null
}) {

  try {

    const statusField =
      matchTable === "trips"
        ? "status"
        : "status";

    const statusValue =
      matchTable === "trips"
        ? "active"
        : "open";

    const { data: matches, error } =
      await supabaseClient
        .from(matchTable)
        .select("id, user_id")
        .eq("departure_country", matchDepartureCountry)
        .eq("arrival_country", matchArrivalCountry)
        .eq(statusField, statusValue)
        .neq("user_id", currentUser.id);

    if (error) {
      console.error("Errore ricerca utenti da notificare:", error);
    }

    // Evita di notificare due volte lo stesso utente
    const uniqueUserIds =
      [...new Set((matches || []).map(m => m.user_id))];

    if (uniqueUserIds.length) {

      const notifications =
        uniqueUserIds.map(userId => ({
          user_id: userId,
          type: notificationType,
          title: title,
          message: message,
          trip_id: tripId,
          request_id: requestId
        }));

      await supabaseClient
        .from("notifications")
        .insert(notifications);

    }

    // Utenti che seguono una delle due destinazioni
    // (la funzione SQL esclude chi è già stato notificato)
    const { error: followError } =
      await supabaseClient.rpc(
        "notify_destination_followers",
        {
          p_departure: matchDepartureCountry,
          p_arrival: matchArrivalCountry,
          p_type: notificationType,
          p_title: title,
          p_message: message,
          p_trip_id: tripId ? String(tripId) : null,
          p_request_id: requestId ? String(requestId) : null,
          p_exclude: uniqueUserIds
        }
      );

    if (followError) {
      console.warn("Notifiche destinazioni seguite:", followError);
    }

  } catch (error) {

    console.error("Errore invio notifiche:", error);

  }

}


let notificationsChannel = null;


async function updateNotificationBell() {

  if (!currentUser) {
    removeNotificationBell();
    return;
  }

  showNotificationBell();

  await refreshNotificationBadge();

  if (notificationsChannel) {
    supabaseClient.removeChannel(notificationsChannel);
  }

  notificationsChannel = supabaseClient
    .channel(`notifications_${currentUser.id}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${currentUser.id}`
      },
      payload => {

        showToast("🔔 " + payload.new.title);

        refreshNotificationBadge();

      }
    )
    .subscribe();

}


async function refreshNotificationBadge() {

  if (!currentUser) return;

  const { count, error } =
    await supabaseClient
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .eq("user_id", currentUser.id)
      .eq("is_read", false);

  if (error) {
    console.error(error);
    return;
  }

  const badge =
    document.getElementById("notificationBadge");

  if (badge) {
    badge.textContent = count > 0 ? count : "";
    badge.style.display = count > 0 ? "flex" : "none";
  }

}


function showNotificationBell() {

  let button =
    document.getElementById("notificationBellButton");

  if (button) return;

  button = document.createElement("button");
  button.id = "notificationBellButton";
  button.type = "button";
  button.className = "icon-button notification-bell";
  button.title = "Notifiche";
  button.innerHTML = `
    🔔
    <span id="notificationBadge" class="notify-badge" style="display:none"></span>
  `;
  button.onclick = openNotificationsPanel;

  const nav =
    document.getElementById("mainNav");

  if (nav) {
    const authButton =
      document.getElementById("authButton");

    if (authButton) {
      nav.insertBefore(button, authButton);
    } else {
      nav.appendChild(button);
    }
  }

}


function removeNotificationBell() {

  const button =
    document.getElementById("notificationBellButton");

  if (button) {
    button.remove();
  }

  if (notificationsChannel) {
    supabaseClient.removeChannel(notificationsChannel);
    notificationsChannel = null;
  }

}


/* =====================================================
   ICONA MESSAGGI IN HEADER
   (accessibile da qualsiasi pagina, come le notifiche)
===================================================== */

let messagesBadgeChannel = null;

async function updateMessagesButton() {

  if (!currentUser) {
    removeMessagesButton();
    return;
  }

  showMessagesButton();

  await refreshMessagesUnreadCount();

  if (messagesBadgeChannel) {
    supabaseClient.removeChannel(messagesBadgeChannel);
  }

  messagesBadgeChannel = supabaseClient
    .channel(`messages_badge_${currentUser.id}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages" },
      () => {
        refreshMessagesUnreadCount();
      }
    )
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "messages" },
      () => {
        refreshMessagesUnreadCount();
      }
    )
    .subscribe();

}


function showMessagesButton() {

  let button =
    document.getElementById("messagesBellButton");

  if (button) return;

  button = document.createElement("button");
  button.id = "messagesBellButton";
  button.type = "button";
  button.className = "icon-button notification-bell";
  button.title = "Messaggi";
  button.innerHTML = `
    💬
    <span id="messagesBadge" class="notify-badge" style="display:none"></span>
  `;
  button.onclick = openMessages;

  const nav =
    document.getElementById("mainNav");

  if (nav) {

    const bell =
      document.getElementById("notificationBellButton");

    const authButton =
      document.getElementById("authButton");

    if (bell) {
      nav.insertBefore(button, bell);
    } else if (authButton) {
      nav.insertBefore(button, authButton);
    } else {
      nav.appendChild(button);
    }

  }

}


function removeMessagesButton() {

  const button =
    document.getElementById("messagesBellButton");

  if (button) {
    button.remove();
  }

  if (messagesBadgeChannel) {
    supabaseClient.removeChannel(messagesBadgeChannel);
    messagesBadgeChannel = null;
  }

}


async function refreshMessagesUnreadCount() {

  if (!currentUser) return;

  const { data, error } =
    await supabaseClient
      .from("messages")
      .select("*")
      .is("read_at", null)
      .neq("sender_id", currentUser.id);

  if (error) {
    console.warn("Errore conteggio messaggi:", error);
    return;
  }

  refreshMessagesBadge(data ? data.length : 0);

}


function refreshMessagesBadge(count) {

  const badge =
    document.getElementById("messagesBadge");

  if (!badge) return;

  badge.textContent = count > 0 ? count : "";
  badge.style.display = count > 0 ? "flex" : "none";

}


async function openNotificationsPanel() {

  if (!currentUser) {
    openAuth("login");
    return;
  }

  const { data: notifications, error } =
    await supabaseClient
      .from("notifications")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false })
      .limit(30);

  if (error) {
    console.error(error);
    return;
  }

  const old =
    document.getElementById("notificationsModal");

  if (old) old.remove();

  const modal = document.createElement("div");
  modal.id = "notificationsModal";
  modal.className = "chat-modal";

  let listHtml = "";

  if (!notifications || !notifications.length) {

    listHtml = `
      <div class="empty-state">
        <h3>🔔 Nessuna notifica</h3>
        <p>Ti avviseremo quando ci sarà qualcosa sulla tua rotta.</p>
      </div>
    `;

  } else {

    listHtml = notifications.map(n => {

      const date =
        new Date(n.created_at).toLocaleString("it-IT");

      return `
        <div class="conversation-item ${n.is_read ? "" : "unread"}">
          <strong>${escapeHtml(n.title)}</strong><br>
          <span>${escapeHtml(n.message || "")}</span><br>
          <small style="opacity:.6">${date}</small>
        </div>
      `;

    }).join("");

  }

  modal.innerHTML = `
    <div class="chat-box">
      <div class="chat-header">
        <span>🔔 Notifiche</span>
        <div>
          <button class="chat-close" onclick="closeNotificationsPanel()">×</button>
        </div>
      </div>
      <div class="chat-messages" style="height:400px; overflow-y:auto;">
        ${listHtml}
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Segna tutte come lette all'apertura
  await supabaseClient
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", currentUser.id)
    .eq("is_read", false);

  refreshNotificationBadge();

}


function closeNotificationsPanel() {

  const modal =
    document.getElementById("notificationsModal");

  if (modal) modal.remove();

}




async function openMessages() {

  if (!currentUser) {
    openAuth("login");
    return;
  }

  // Rimuove eventuale canale realtime precedente per evitare duplicati
  if (messagesListChannel) {
    supabaseClient.removeChannel(messagesListChannel);
    messagesListChannel = null;
  }

  const { data: conversations, error } =
    await supabaseClient
      .from("conversations")
      .select("*")
      .or(`participant_1.eq.${currentUser.id},participant_2.eq.${currentUser.id}`)
      .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    alert("Errore nel caricamento dei messaggi.");
    return;
  }

  // Rimuove eventuale modale già aperto prima di ricrearlo
  const oldModal = document.getElementById("messagesModal");
  if (oldModal) {
    oldModal.remove();
  }

  const modal = document.createElement("div");
  modal.id = "messagesModal";
  modal.className = "chat-modal";

  let html = `
    <div class="chat-box">
      <div class="chat-header">
        <span>Messaggi</span>

        <div>
          <button class="chat-minimize" onclick="minimizeMessagesList()">−</button>
          <button class="chat-close" onclick="closeMessages()">×</button>
        </div>
      </div>

      <div class="chat-messages" style="height:400px; overflow-y:auto;">
`;

  for (const conv of conversations) {

    const otherUserId =
      conv.participant_1 === currentUser.id
        ? conv.participant_2
        : conv.participant_1;

    const otherUserName = await getUserName(otherUserId);

    const { data: unreadMessages } = await supabaseClient
      .from("messages")
      .select("*")
      .eq("conversation_id", conv.id)
      .is("read_at", null)
      .neq("sender_id", currentUser.id);

    const isUnread = unreadMessages && unreadMessages.length > 0;

    const { data: lastMsg } =
      await supabaseClient
        .from("messages")
        .select("*")
        .eq("conversation_id", conv.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    const preview =
      lastMsg?.message
        ? lastMsg.message.substring(0, 40) + "..."
        : "Nessun messaggio";

    html += `
      <div class="conversation-item ${isUnread ? "unread" : ""}"
           onclick="openConversation('${otherUserId}', '${conv.trip_id}', '${conv.request_id}')">

        <strong>${otherUserName}</strong><br>
        <span>${preview}</span>

      </div>
    `;
  }

  html += `
      </div>
    </div>
  `;

  modal.innerHTML = html;
  document.body.appendChild(modal);

  updateUnreadCount();

  // Realtime: se arriva un nuovo messaggio mentre la lista è aperta, la ricarica
  messagesListChannel = supabaseClient
    .channel(`messages_list_${currentUser.id}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages" },
      () => {

        const listModal = document.getElementById("messagesModal");

        if (!listModal) {
          return;
        }

        const isMinimized = listModal.style.display === "none";

        if (isMinimized) {
          // Lista minimizzata: aggiorna solo il contatore, non riaprirla
          updateUnreadCount();
          return;
        }

        openMessages();

      }
    )
    .subscribe();

}
/*========CloseMessages==============*/

function closeMessages() {

  const modal = document.getElementById("messagesModal");
  if (modal) modal.remove();

  const button = document.getElementById("messagesMinimizedButton");
  if (button) button.remove();

  if (messagesListChannel) {
    supabaseClient.removeChannel(messagesListChannel);
    messagesListChannel = null;
  }

}
/*==============*/
/* =====================================================
   CONFERMA ACCORDO (chiude viaggio/richiesta dalla lista pubblica)
===================================================== */

async function confirmAgreement(conversationId) {

  if (!currentUser) {
    openAuth("login");
    return;
  }

  const { data: conv, error: fetchError } =
    await supabaseClient
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single();

  if (fetchError) {
    alert("Errore: " + fetchError.message);
    return;
  }

  const isParticipant1 = conv.participant_1 === currentUser.id;

  const updateField =
    isParticipant1
      ? { agreement_confirmed_by_1: true }
      : { agreement_confirmed_by_2: true };

  const bothConfirmed =
    isParticipant1
      ? true && conv.agreement_confirmed_by_2
      : conv.agreement_confirmed_by_1 && true;

  if (bothConfirmed) {
    updateField.agreement_reached_at = new Date().toISOString();
  }

  const { error: updateError } =
    await supabaseClient
      .from("conversations")
      .update(updateField)
      .eq("id", conversationId);

  if (updateError) {
    alert("Errore: " + updateError.message);
    return;
  }

  // Se entrambi hanno confermato, chiudi viaggio/richiesta dalla lista pubblica
  if (bothConfirmed) {

    if (conv.trip_id) {

      await supabaseClient
        .from("trips")
        .update({ status: "in_progress" })
        .eq("id", conv.trip_id);

    }

    if (conv.request_id) {

      await supabaseClient
        .from("requests")
        .update({ status: "closed" })
        .eq("id", conv.request_id);

    }

    // Aggiorna le liste pubbliche se sono a schermo
    if (typeof loadTrips === "function") loadTrips();
    if (typeof loadRequests === "function") loadRequests();

  }

  // Messaggio di sistema per notificare l'altra parte
  const myName = await getUserName(currentUser.id);

  const systemText =
    bothConfirmed
      ? `🤝 ${myName} ha confermato l'accordo. Accordo raggiunto! Il viaggio/richiesta non è più visibile pubblicamente.`
      : `🤝 ${myName} ha confermato l'accordo. In attesa della tua conferma.`;

  await supabaseClient
    .from("messages")
    .insert([
      {
        conversation_id: conversationId,
        sender_id: currentUser.id,
        message: systemText,
        is_system: true
      }
    ]);

  if (bothConfirmed) {
    showToast(t("toastAgreementBoth"));
  } else {
    showToast(t("toastAgreementWaiting"));
  }

  await refreshChatActionButtons(conversationId);

}







 /* =====================================================
   CONFERMA CONSEGNA
===================================================== */
async function confirmDelivery(conversationId) {

  if (!currentUser) {
    openAuth("login");
    return;
  }

  const { data: conv, error: fetchError } =
    await supabaseClient
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single();

  if (fetchError) {
    alert("Errore: " + fetchError.message);
    return;
  }

  const isParticipant1 = conv.participant_1 === currentUser.id;

  const updateField =
    isParticipant1
      ? { confirmed_by_1: true }
      : { confirmed_by_2: true };

  const bothConfirmed =
    isParticipant1
      ? true && conv.confirmed_by_2
      : conv.confirmed_by_1 && true;

  if (bothConfirmed) {
    updateField.completed_at = new Date().toISOString();
  }

  const { error: updateError } =
    await supabaseClient
      .from("conversations")
      .update(updateField)
      .eq("id", conversationId);

  if (updateError) {
    alert("Errore: " + updateError.message);
    return;
  }

  // Messaggio di sistema per notificare l'altra parte
  const myName = await getUserName(currentUser.id);

  const systemText =
    bothConfirmed
      ? `✓ ${myName} ha confermato la consegna. Entrambe le parti hanno confermato!`
      : `✓ ${myName} ha confermato la consegna. In attesa della tua conferma.`;

  await supabaseClient
    .from("messages")
    .insert([
      {
        conversation_id: conversationId,
        sender_id: currentUser.id,
        message: systemText,
        is_system: true
      }
    ]);

  if (bothConfirmed) {
    showToast(t("toastDeliveryBoth"));
  } else {
    showToast(t("toastDeliveryWaiting"));
  }

  await refreshChatActionButtons(conversationId);

}

/* =====================================================
   AGGIORNA BOTTONI AZIONE CHAT
===================================================== */
async function refreshChatActionButtons(conversationId) {

  const { data: conv, error } =
    await supabaseClient
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single();

  if (error) {
    console.error(error);
    return;
  }

  const container =
    document.getElementById("chatActions");

  if (!container) return;

  const isParticipant1 =
    conv.participant_1 === currentUser.id;

  const agreementReached =
    conv.agreement_confirmed_by_1 && conv.agreement_confirmed_by_2;

  const myAgreementConfirmation =
    isParticipant1
      ? conv.agreement_confirmed_by_1
      : conv.agreement_confirmed_by_2;

  const bothConfirmedDelivery =
    conv.confirmed_by_1 && conv.confirmed_by_2;

  const myDeliveryConfirmation =
    isParticipant1
      ? conv.confirmed_by_1
      : conv.confirmed_by_2;

  const alreadyReviewed =
    await hasAlreadyReviewed(conversationId);

  let html = "";


  /* -------------------------------------------
     STADIO 1: Accordo non ancora raggiunto
  ------------------------------------------- */

  if (!agreementReached) {

    if (myAgreementConfirmation) {

      html = `
        <div class="chat-action-banner pending">
          <div class="chat-action-icon">⏳</div>
          <div class="chat-action-text">
            <strong>${t("agreementConfirmedTitle")}</strong>
            <span>${t("waitingOtherParty")}</span>
          </div>
        </div>
      `;

    } else {

      html = `
        <div class="chat-action-banner neutral">
          <div class="chat-action-icon">🤝</div>
          <div class="chat-action-text">
            <strong>${t("agreementQuestion")}</strong>
            <span>${t("agreementSubtext")}</span>
          </div>
          <button
            class="chat-action-button secondary"
            onclick="confirmAgreement('${conversationId}')">
            ${t("agreementConfirmButton")}
          </button>
        </div>
      `;

    }


  /* -------------------------------------------
     STADIO 2: Accordo raggiunto, in attesa consegna
  ------------------------------------------- */

  } else if (bothConfirmedDelivery) {

    if (!alreadyReviewed) {

      html = `
        <div class="chat-action-banner success">
          <div class="chat-action-icon">✓</div>
          <div class="chat-action-text">
            <strong>${t("deliveryConfirmedTitle")}</strong>
            <span>${t("deliveryConfirmedSubtext")}</span>
          </div>
          <button
            class="chat-action-button primary"
            onclick="openReviewForm('${conversationId}')">
            ⭐ ${t("step4Title")}
          </button>
        </div>
      `;

    } else {

      html = `
        <div class="chat-action-banner done">
          <div class="chat-action-icon">✓</div>
          <div class="chat-action-text">
            <strong>${t("reviewSentTitle")}</strong>
            <span>${t("reviewSentSubtext")}</span>
          </div>
        </div>
      `;

    }

  } else if (myDeliveryConfirmation) {

    html = `
      <div class="chat-action-banner pending">
        <div class="chat-action-icon">⏳</div>
        <div class="chat-action-text">
          <strong>${t("deliveryConfirmationSentTitle")}</strong>
          <span>${t("waitingOtherParty")}</span>
        </div>
      </div>
    `;

  } else {

    html = `
      <div class="chat-action-banner neutral">
        <div class="chat-action-icon">📦</div>
        <div class="chat-action-text">
          <strong>${t("deliveryQuestion")}</strong>
          <span>${t("deliverySubtext")}</span>
        </div>
        <button
          class="chat-action-button secondary"
          onclick="confirmDelivery('${conversationId}')">
          ${t("deliveryConfirmButton")}
        </button>
      </div>
    `;

  }

  container.innerHTML = html;

}


/*======================*/

function closeProfilePage() {

  const page =
    document.getElementById(
      "profilePage"
    );

  if (page) {

    page.remove();

  }


  document.body.style.overflow =
    "";

}


/* =====================================================
   TRIP MODAL
===================================================== */

function createTripModal() {

  const modal =
    document.createElement(
      "div"
    );

  modal.id =
    "tripModal";


  modal.innerHTML = `

    <div class="auth-overlay">

      <div class="auth-box">


        <button
          class="auth-close"
          onclick="closeTripModal()">

          ×

        </button>


        <h2>
          ${t("publishTripTitle")}
        </h2>


        <p>
          ${t("tripDescription")}
        </p>


        <label>
          ${t("departure")}
        </label>


        <select
          id="tripDepartureCountry">

          ${countryOptions("italy")}

        </select>


        <label>
          ${t("arrival")}
        </label>


        <select
          id="tripArrivalCountry">

          ${countryOptions("tunisia")}

        </select>


        <input
          id="tripDepartureCity"
          list="cityList"
          autocomplete="off"
          placeholder="${t("departureCity")}"
        >


        <input
          id="tripArrivalCity"
          list="cityList"
          autocomplete="off"
          placeholder="${t("arrivalCity")}"
        >


        <input
          id="tripDate"
          type="date"
        >


        <input
          id="tripKg"
          type="number"
          min="0.1"
          step="0.1"
          placeholder="${t("availableKg")}"
        >


        <input
          id="tripPrice"
          type="number"
          min="0"
          step="0.01"
          placeholder="${t("priceKg")}"
        >


        <textarea
          id="tripDescription"
          rows="4"
          placeholder="${t("description")}"
        ></textarea>


        <label>
          ${t("ticket")}
        </label>


        <input
          id="travelTicket"
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          required
        >


        <small class="upload-help">
          ${t("ticketHelp")}
        </small>


        <button
          class="primary auth-button"
          onclick="publishTrip()">

          ${t("publish")}

        </button>


        <div id="tripMessage"></div>


      </div>

    </div>

  `;


  document.body.appendChild(
    modal
  );

}


function openTripModal() {

  const modal =
    document.getElementById(
      "tripModal"
    );

  if (modal) {

    modal.style.display =
      "block";

  }

}


function closeTripModal() {

  const modal =
    document.getElementById(
      "tripModal"
    );

  if (modal) {

    modal.style.display =
      "none";

  }

}


/* =====================================================
   PUBLISH TRIP
===================================================== */

async function publishTrip() {

  if (!currentUser) {

    openAuth("login");

    return;

  }


  const departureCountry =
    document.getElementById(
      "tripDepartureCountry"
    ).value;


  const arrivalCountry =
    document.getElementById(
      "tripArrivalCountry"
    ).value;


  const departureCity =
    document.getElementById(
      "tripDepartureCity"
    ).value.trim();


  const arrivalCity =
    document.getElementById(
      "tripArrivalCity"
    ).value.trim();


  const date =
    document.getElementById(
      "tripDate"
    ).value;


  const kg =
    parseFloat(
      document.getElementById(
        "tripKg"
      ).value
    );


  const price =
    parseFloat(
      document.getElementById(
        "tripPrice"
      ).value
    ) || null;


  const description =
    document.getElementById(
      "tripDescription"
    ).value.trim();


  const ticketInput =
    document.getElementById(
      "travelTicket"
    );


  const message =
    document.getElementById(
      "tripMessage"
    );


  if (
    !departureCity ||
    !arrivalCity ||
    !date ||
    !kg
  ) {

    message.textContent =
      t("fillFields");

    message.className =
      "auth-error";

    return;

  }


  if (
    departureCountry ===
    arrivalCountry
  ) {

    message.textContent =
      t("countriesMustDiffer");

    message.className =
      "auth-error";

    return;

  }


  if (
    departureCountry !== "tunisia" &&
    arrivalCountry !== "tunisia"
  ) {

    message.textContent =
      t("oneMustBeTunisia");

    message.className =
      "auth-error";

    return;

  }


  if (
    !ticketInput ||
    !ticketInput.files ||
    !ticketInput.files.length
  ) {

    message.textContent =
      currentLanguage === "it"
        ? "Devi caricare il biglietto del volo."
        : currentLanguage === "fr"
          ? "Vous devez télécharger votre billet."
          : "لازمك ترفع تذكرة السفر.";

    message.className =
      "auth-error";

    return;

  }


  const ticketFile =
    ticketInput.files[0];


  const maxSize =
    10 * 1024 * 1024;


  if (
    ticketFile.size >
    maxSize
  ) {

    message.textContent =
      currentLanguage === "it"
        ? "Il biglietto supera il limite di 10 MB."
        : currentLanguage === "fr"
          ? "Le billet dépasse la limite de 10 Mo."
          : "التذكرة أكبر من 10 ميغا.";

    message.className =
      "auth-error";

    return;

  }


  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf"
  ];


  if (
    !allowedTypes.includes(
      ticketFile.type
    )
  ) {

    message.textContent =
      currentLanguage === "it"
        ? "Formato non supportato. Usa JPG, PNG o PDF."
        : currentLanguage === "fr"
          ? "Format non pris en charge. Utilisez JPG, PNG ou PDF."
          : "الصيغة موش مدعومة. استعمل JPG أو PNG أو PDF.";

    message.className =
      "auth-error";

    return;

  }


  message.textContent =
    currentLanguage === "it"
      ? "Caricamento biglietto..."
      : currentLanguage === "fr"
        ? "Téléchargement du billet..."
        : "جاري رفع التذكرة...";


  message.className =
    "auth-success";


  const extension =
    ticketFile.name
      .split(".")
      .pop()
      .toLowerCase();


  const ticketPath =
    `${currentUser.id}/ticket-${Date.now()}.${extension}`;


  const {
    error: uploadError
  } =
    await supabaseClient
      .storage
      .from("travel-tickets")
      .upload(
        ticketPath,
        ticketFile,
        {
          upsert: false,
          contentType:
            ticketFile.type
        }
      );


  if (uploadError) {

    console.error(
      uploadError
    );

    message.textContent =
      "Errore: " +
      uploadError.message;

    message.className =
      "auth-error";

    return;

  }


  const {
    data: insertedTrip,
    error: tripError
  } =
    await supabaseClient
      .from("trips")
      .insert({

        user_id:
          currentUser.id,

        departure_country:
          departureCountry,

        arrival_country:
          arrivalCountry,

        departure_city:
          departureCity,

        arrival_city:
          arrivalCity,

        travel_date:
          date,

        available_kg:
          kg,

        price_per_kg:
          price,

        description:
          description,

        ticket_path:
          ticketPath,

        verification_status:
          "pending",

        status:
          "active"

      })
      .select()
      .single();


  if (tripError) {

    console.error(
      tripError
    );


    await supabaseClient
      .storage
      .from("travel-tickets")
      .remove([
        ticketPath
      ]);


    message.textContent =
      "Errore: " +
      tripError.message;

    message.className =
      "auth-error";

    return;

  }


  // Notifica gli utenti con una richiesta aperta sulla stessa rotta
  notifyMatchingUsers({
    matchTable: "requests",
    matchDepartureCountry: departureCountry,
    matchArrivalCountry: arrivalCountry,
    notificationType: "new_trip_match",
    title: "✈️ Nuovo viaggio sulla tua rotta!",
    message:
      `${countryFlag(departureCountry)} ${departureCity} → ${countryFlag(arrivalCountry)} ${arrivalCity}`,
    tripId: insertedTrip?.id || null
  });


  message.textContent =
    t("tripPublished");

  message.className =
    "auth-success";


  setTimeout(
    () => {

      closeTripModal();

      loadTrips();

    },
    1000
  );

}


/* =====================================================
   LOAD TRIPS
===================================================== */

async function loadTrips() {

  const container =
    document.getElementById(
      "tripsContainer"
    );

  if (!container) return;

  toggleSampleNotice("tripsNotice", false);


  const {
    data,
    error
  } =
    await supabaseClient
      .from("trips")
      .select(`
        *,
        profiles(
          full_name,
          is_verified,
          rating,
          user_type,
          avatar_url
        )
      `)
      .eq(
        "status",
        "active"
      )
      .order(
        "travel_date",
        {
          ascending: true
        }
      );


  if (error) {

    console.error(error);

    container.innerHTML =
      `<div class="loading">
        Errore nel caricamento.
      </div>`;

    return;

  }


  if (!data.length) {

    renderSampleTrips(container);

    return;

  }


  container.innerHTML =
    data
      .map(
        tripCard
      )
      .join("");

}


function tripCard(trip) {

  const profile =
    trip.profiles || {};


  const date =
    new Date(
      trip.travel_date +
      "T12:00:00"
    )
    .toLocaleDateString(
      currentLanguage === "fr"
        ? "fr-FR"
        : currentLanguage === "tn"
          ? "ar-TN"
          : "it-IT"
    );


  let verificationHtml =
    "";


  if (
    trip.verification_status ===
    "approved"
  ) {

    verificationHtml =
      `
      <span class="verified-trip">
        ${t("verifiedTrip")}
      </span>
      `;

  } else if (
    trip.verification_status ===
    "pending"
  ) {

    verificationHtml =
      `
      <span class="pending-trip">
        ${t("ticketPending")}
      </span>
      `;

  } else {

    verificationHtml =
      `
      <span class="rejected-trip">
        ${t("verificationRejected")}
      </span>
      `;

  }


  return `

    <article class="card trip-card">


      ${avatarHtml(profile.avatar_url, 44)}


      <h3>

        ${escapeHtml(
          profile.full_name ||
          "Hez Maak"
        )}

        ${verificationHtml}


        ${
          profile.is_verified

            ? `
              <span class="verified">
                ✓ ${t("verified")}
              </span>
            `

            : ""
        }

      </h3>


      <p>

        ${flag(
          trip.departure_country
        )}

        ${escapeHtml(
          cityName(trip.departure_city)
        )}

        →

        ${flag(
          trip.arrival_country
        )}

        ${escapeHtml(
          cityName(trip.arrival_city)
        )}

      </p>


      <p>
        📅 ${date}
      </p>


      <p>
        📦 ${trip.available_kg} ${t("kg")}
      </p>


      ${
        trip.price_per_kg

          ? `
            <strong>
              €${trip.price_per_kg}/${t("kg")}
            </strong>
          `

          : ""
      }


      ${
        trip.description

          ? `
            <p>
              ${escapeHtml(
                trip.description
              )}
            </p>
          `

          : ""
      }


${
  (
    !currentUser ||
    currentUser.id !== trip.user_id
  )

    ? `
      <div class="card-actions-row">

        <button
          class="primary"
          onclick="contactUser(
            '${trip.user_id}',
            ${trip.id},
            null
          )">

          💬 ${t("contact")}

        </button>

        <button
          class="report-inline-button"
          title="${t("reportButton")}"
          onclick="openReportModal('${trip.user_id}', ${trip.id}, null, null)">

          🚩

        </button>

      </div>
    `

    : ""
}


    </article>

  `;

}



/* =====================================================
   REQUEST MODAL
===================================================== */

function createRequestModal() {

  const modal =
    document.createElement(
      "div"
    );

  modal.id =
    "requestModal";


  modal.innerHTML = `

    <div class="auth-overlay">

      <div class="auth-box">


        <button
          class="auth-close"
          onclick="closeRequestModal()">

          ×

        </button>


        <h2>
          ${t("requestTitle")}
        </h2>


        <select
          id="requestDeparture">

          ${countryOptions("tunisia")}

        </select>


        <select
          id="requestArrival">

          ${countryOptions("italy")}

        </select>


        <input
          id="requestDepartureCity"
          list="cityList"
          autocomplete="off"
          placeholder="${t("departureCity")}"
        >


        <input
          id="requestArrivalCity"
          list="cityList"
          autocomplete="off"
          placeholder="${t("arrivalCity")}"
        >


        <input
          id="requestDate"
          type="date"
        >


        <textarea
          id="requestDescription"
          rows="4"
          placeholder="${t("itemDescription")}"
        ></textarea>


        <input
          id="requestWeight"
          type="number"
          placeholder="${t("weight")}"
        >


        <input
          id="requestBudget"
          type="number"
          placeholder="${t("budget")}"
        >


        <button
          class="primary auth-button"
          onclick="publishRequest()">

          ${t("publish")}

        </button>


        <div id="requestMessage"></div>


      </div>

    </div>

  `;


  document.body.appendChild(
    modal
  );

}


function openRequestModal() {

  const modal =
    document.getElementById(
      "requestModal"
    );

  if (modal) {

    modal.style.display =
      "block";

  }

}


function closeRequestModal() {

  const modal =
    document.getElementById(
      "requestModal"
    );

  if (modal) {

    modal.style.display =
      "none";

  }

}


/* =====================================================
   PUBLISH REQUEST
===================================================== */

async function publishRequest() {

  if (!currentUser) {

    openAuth("login");

    return;

  }


  const departure =
    document.getElementById(
      "requestDeparture"
    ).value;


  const arrival =
    document.getElementById(
      "requestArrival"
    ).value;


  const departureCity =
    document.getElementById(
      "requestDepartureCity"
    ).value.trim();


  const arrivalCity =
    document.getElementById(
      "requestArrivalCity"
    ).value.trim();


  const date =
    document.getElementById(
      "requestDate"
    ).value || null;


  const description =
    document.getElementById(
      "requestDescription"
    ).value.trim();


  const weight =
    parseFloat(
      document.getElementById(
        "requestWeight"
      ).value
    ) || null;


  const budget =
    parseFloat(
      document.getElementById(
        "requestBudget"
      ).value
    ) || null;


  const message =
    document.getElementById(
      "requestMessage"
    );


  if (
    !departureCity ||
    !arrivalCity ||
    !description
  ) {

    message.textContent =
      t("fillFields");

    message.className =
      "auth-error";

    return;

  }


  if (
    departure === arrival
  ) {

    message.textContent =
      t("countriesMustDiffer");

    message.className =
      "auth-error";

    return;

  }


  if (
    departure !== "tunisia" &&
    arrival !== "tunisia"
  ) {

    message.textContent =
      t("oneMustBeTunisia");

    message.className =
      "auth-error";

    return;

  }


  const {
    data: insertedRequest,
    error
  } =
    await supabaseClient
      .from("requests")
      .insert({

        user_id:
          currentUser.id,

        departure_country:
          departure,

        arrival_country:
          arrival,

        departure_city:
          departureCity,

        arrival_city:
          arrivalCity,

        needed_date:
          date,

        item_description:
          description,

        weight_kg:
          weight,

        budget:
          budget,

        status:
          "open"

      })
      .select()
      .single();


  if (error) {

    message.textContent =
      error.message;

    message.className =
      "auth-error";

    return;

  }


  // Notifica gli utenti con un viaggio attivo sulla stessa rotta
  notifyMatchingUsers({
    matchTable: "trips",
    matchDepartureCountry: departure,
    matchArrivalCountry: arrival,
    notificationType: "new_request_match",
    title: "📦 Nuova richiesta sulla tua rotta!",
    message:
      `${countryFlag(departure)} ${departureCity} → ${countryFlag(arrival)} ${arrivalCity}`,
    requestId: insertedRequest?.id || null
  });


  message.textContent =
    t("requestPublished");

  message.className =
    "auth-success";


  setTimeout(
    () => {

      closeRequestModal();

      loadRequests();

    },
    800
  );

}


/* =====================================================
   LOAD REQUESTS
===================================================== */

async function loadRequests() {

  const container =
    document.getElementById(
      "requestsContainer"
    );

  if (!container) return;

  toggleSampleNotice("requestsNotice", false);


  const {
    data,
    error
  } =
    await supabaseClient
      .from("requests")
      .select(`
        *,
        profiles(
          full_name,
          is_verified,
          avatar_url
        )
      `)
      .eq(
        "status",
        "open"
      )
      .order(
        "created_at",
        {
          ascending: false
        }
      );


  if (error) {

    console.error(
      error
    );

    container.innerHTML =
      `
      <div class="loading">
        ${escapeHtml(error.message)}
      </div>
      `;

    return;

  }


  if (!data.length) {

    renderSampleRequests(container);

    return;

  }


  container.innerHTML =
    data
      .map(
        requestCard
      )
      .join("");

}
function requestCard(request) {

  const canContact =
    !currentUser ||
    currentUser.id !== request.user_id;

  return `

    <article class="card">

      ${avatarHtml(request.profiles?.avatar_url, 44)}

      <h3>

        ${escapeHtml(
          request.profiles?.full_name ||
          "Hez Maak"
        )}

        ${
          request.profiles?.is_verified

            ? `
              <span class="verified">
                ✓ ${t("verified")}
              </span>
            `

            : ""
        }

      </h3>

      <p>

        ${flag(
          request.departure_country
        )}

        ${escapeHtml(
          cityName(request.departure_city)
        )}

        →

        ${flag(
          request.arrival_country
        )}

        ${escapeHtml(
          cityName(request.arrival_city)
        )}

      </p>

      <p>

        ${escapeHtml(
          request.item_description
        )}

      </p>

      ${
        request.weight_kg

          ? `
            <p>
              📦 ${request.weight_kg} ${t("kg")}
            </p>
          `

          : ""
      }

      ${
        request.budget

          ? `
            <strong>
              ${t("budget")} €${request.budget}
            </strong>
          `

          : ""
      }

 ${
  (
    !currentUser ||
    currentUser.id !== request.user_id
  )

    ? `
      <div class="card-actions-row">

        <button
          class="primary"
          onclick="contactUser(
            '${request.user_id}',
            null,
            ${request.id}
          )">

          💬 ${t("contact")}

        </button>

        <button
          class="report-inline-button"
          title="${t("reportButton")}"
          onclick="openReportModal('${request.user_id}', null, ${request.id}, null)">

          🚩

        </button>

      </div>
    `

    : ""
}

    </article>

  `;

}
/* ================= RECUPERO NOME UTENTE=============*/
async function getUserName(userId) {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("full_name")
    .eq("id", userId)
    .single();

  if (error || !data) return "Utente";
  return data.full_name;
}

/* ====================================================  CONTACT    
  =====================================================*/ 
/* =====================================================
   SEGNALAZIONE UTENTE / VIAGGIO / RICHIESTA
===================================================== */

async function openReportModal(reportedUserId, tripId = null, requestId = null, conversationId = null) {

  if (!currentUser) {
    openAuth("login");
    return;
  }

  if (reportedUserId === currentUser.id) {
    alert(t("cannotReportYourself"));
    return;
  }

  const old = document.getElementById("reportModal");
  if (old) old.remove();

  const modal = document.createElement("div");
  modal.id = "reportModal";

  modal.innerHTML = `

    <div class="auth-overlay">

      <div class="auth-box report-box">

        <button
          class="auth-close"
          onclick="closeReportModal()">

          ×

        </button>


        <h2>
          ${t("reportTitle")}
        </h2>


        <p>
          ${t("reportIntro")}
        </p>


        <label>
          ${t("reportReasonLabel")}
        </label>

        <select id="reportReason">

          <option value="spam">${t("reportReasonSpam")}</option>
          <option value="scam">${t("reportReasonScam")}</option>
          <option value="inappropriate">${t("reportReasonInappropriate")}</option>
          <option value="fake_profile">${t("reportReasonFakeProfile")}</option>
          <option value="other">${t("reportReasonOther")}</option>

        </select>


        <label>
          ${t("reportDescriptionLabel")}
        </label>

        <textarea
          id="reportDescription"
          rows="4"
          placeholder="${t("reportDescriptionPlaceholder")}"
        ></textarea>


        <div id="reportMessage"></div>


        <button
          class="primary auth-button"
          onclick="submitReport('${reportedUserId}', ${tripId || "null"}, ${requestId || "null"}, ${conversationId || "null"})">

          ${t("reportSendButton")}

        </button>

      </div>

    </div>

  `;

  document.body.appendChild(modal);

}


function closeReportModal() {

  const modal = document.getElementById("reportModal");
  if (modal) modal.remove();

}


async function submitReport(reportedUserId, tripId, requestId, conversationId) {

  const reason =
    document.getElementById("reportReason").value;

  const description =
    document.getElementById("reportDescription").value.trim();

  const message =
    document.getElementById("reportMessage");

  message.innerHTML = `
    <div class="auth-success">
      ${t("sendingInProgress")}
    </div>
  `;

  const { error } =
    await supabaseClient
      .from("reports")
      .insert([
        {
          reporter_id: currentUser.id,
          reported_user_id: reportedUserId,
          trip_id: tripId,
          request_id: requestId,
          conversation_id: conversationId,
          reason: reason,
          description: description || null
        }
      ]);

  if (error) {

    console.error(error);

    message.innerHTML = `
      <div class="auth-error">
        ${escapeHtml(error.message)}
      </div>
    `;

    return;

  }

  message.innerHTML = `
    <div class="auth-success">
      ${t("reportSentThanks")}
    </div>
  `;

  setTimeout(() => {
    closeReportModal();
  }, 1200);

}



async function contactUser(
  userId,
  tripId = null,
  requestId = null
) {

  if (!currentUser) {

    openAuth("login");

    return;

  }


  if (!userId) {

    alert(
      "Impossibile identificare l'utente."
    );

    return;

  }


  if (userId === currentUser.id) {

    alert(
      "Non puoi contattare te stesso."
    );

    return;

  }


  const participant1 =
    currentUser.id < userId
      ? currentUser.id
      : userId;


  const participant2 =
    currentUser.id < userId
      ? userId
      : currentUser.id;


  let query =
    supabaseClient
      .from("conversations")
      .select("*")
      .eq(
        "participant_1",
        participant1
      )
      .eq(
        "participant_2",
        participant2
      );


  if (tripId) {

    query =
      query.eq(
        "trip_id",
        tripId
      );

  }


  if (requestId) {

    query =
      query.eq(
        "request_id",
        requestId
      );

  }


  const {
    data: existingConversation,
    error: searchError
  } =
    await query
      .maybeSingle();


  if (searchError) {

    console.error(
      searchError
    );

    alert(
      "Errore nella ricerca della conversazione: " +
      searchError.message
    );

    return;

  }


  let conversation =
    existingConversation;


  if (!conversation) {

    const {
      data: newConversation,
      error: createError
    } =
      await supabaseClient
        .from("conversations")
        .insert({

          participant_1:
            participant1,

          participant_2:
            participant2,

          trip_id:
            tripId,

          request_id:
            requestId

        })
        .select()
        .single();


    if (createError) {

      console.error(
        createError
      );

      alert(
        "Errore nella creazione della conversazione: " +
        createError.message
      );

      return;

    }


    conversation =
      newConversation;

  }


  const otherUserName = await getUserName(userId);

openChatModal(
  conversation.id,
  otherUserName,
  userId,
  tripId,
  requestId
);

}
/* =====================================================
   MESSAGGING
===================================================== */
async function openChatModal(
  conversationId,
  otherUserName,
  otherUserId,
  tripId,
  requestId
) {

  // Elimina eventuale chat già aperta
  const oldModal = document.getElementById("chatModal");

  if (oldModal) {
    oldModal.remove();
  }

  // Elimina eventuale pulsante minimizzato
  const oldButton = document.getElementById("chatMinimizedButton");

  if (oldButton) {
    oldButton.remove();
  }

  // Crea la finestra chat
  const modal = document.createElement("div");

  modal.id = "chatModal";
  modal.className = "chat-modal";

  modal.innerHTML = `
    <div class="chat-box">

      <div class="chat-header">

        <span>${otherUserName || "Chat"}</span>

        <div>

          <button
            type="button"
            class="chat-report"
            onclick="openReportModal('${otherUserId}', ${tripId || "null"}, ${requestId || "null"}, ${conversationId || "null"})"
            title="${t("reportUserTitle")}"
          >🚩</button>

          <button
            type="button"
            class="chat-minimize"
            onclick="minimizeChat()"
            title="Minimizza"
          >−</button>

          <button
            type="button"
            class="chat-close"
            onclick="closeChat()"
            title="Chiudi"
          >×</button>

        </div>

      </div>

      <div
        id="chatMessages"
        class="chat-messages"
      ></div>

      <div
        id="typingIndicator"
        class="typing"
      ></div>

      <div
        id="chatActions"
        class="chat-actions"
      ></div>

      <div class="chat-input">

        <input
          id="chatText"
          type="text"
          placeholder="Scrivi un messaggio..."
        >

        <button
          type="button"
          id="sendMessageButton"
          onclick="sendMessage(
            '${conversationId}',
            '${otherUserId}',
            '${tripId || ""}',
            '${requestId || ""}'
          )"
        >
          Invia
        </button>

      </div>

    </div>
  `;

  document.body.appendChild(modal);

  
  /* -----------------------------------------
     Pulsante INVIA
  ----------------------------------------- */

  const sendButton =
    document.getElementById(
      "sendMessageButton"
    );


  /* -----------------------------------------
     Invio con ENTER
  ----------------------------------------- */

  const chatInput =
    document.getElementById(
      "chatText"
    );


  if (chatInput) {

    chatInput.addEventListener(
      "keydown",
      function(event) {

        if (
          event.key === "Enter" &&
          !event.shiftKey
        ) {

          event.preventDefault();

          if (sendButton) {
            sendButton.click();
          }

        }

      }
    );

  }


  /* -----------------------------------------
     Carica messaggi
  ----------------------------------------- */

  try {

    await loadMessages(
      conversationId
    );

  } catch (error) {

    console.error(
      "Errore caricamento messaggi:",
      error
    );

  }


  /* -----------------------------------------
     Realtime
  ----------------------------------------- */

  try {

    subscribeToMessages(
      conversationId
    );

  } catch (error) {

    console.error(
      "Errore realtime:",
      error
    );

  }


  /* -----------------------------------------
     Segna messaggi come letti
  ----------------------------------------- */

  if (
    typeof markMessagesAsRead ===
    "function"
  ) {

    try {

      await markMessagesAsRead(
        conversationId
      );

    } catch (error) {

      console.error(
        "Errore marcatura messaggi letti:",
        error
      );

    }

  }


  /* -----------------------------------------
     Aggiorna contatore
  ----------------------------------------- */

  if (
    typeof updateUnreadCount ===
    "function"
  ) {

    try {

      await updateUnreadCount();

    } catch (error) {

      console.error(
        "Errore aggiornamento notifiche:",
        error
      );

    }

  }
  
  /* -----------------------------------------
     Rimuove badge visuali
  ----------------------------------------- */

  document
    .querySelectorAll(".notify-badge")
    .forEach(
      function(badge) {
        badge.remove();
      }
    );


  /* -----------------------------------------
     Typing
  ----------------------------------------- */

  if (
    typeof setupTyping ===
    "function"
  ) {

    try {

      setupTyping(
        conversationId,
        otherUserName || "Utente"
      );

    } catch (error) {

      console.error(
        "Errore typing:",
        error
      );

    }

  }


  /* -----------------------------------------
     Bottoni conferma/recensione
  ----------------------------------------- */

  try {

    await refreshChatActionButtons(
      conversationId
    );

  } catch (error) {

    console.error(
      "Errore bottoni azione chat:",
      error
    );

  }

}


/* =====================================================
   MINIMIZZA CHAT
===================================================== */

function minimizeChat() {

  const modal = document.getElementById("chatModal");

  if (!modal) {
    return;
  }

  // Nasconde la chat
  modal.style.display = "none";

  // Controlla se esiste già il pulsante
  let button = document.getElementById("chatMinimizedButton");

  if (!button) {

    button = document.createElement("button");

    button.id = "chatMinimizedButton";

    button.className = "chat-minimized-button";

    button.type = "button";

    button.title = "Apri chat";

    button.innerHTML = "💬";

    button.onclick = function() {
      restoreChat();
    };

    document.body.appendChild(button);
  }

  // Mostra il pulsante
  button.style.display = "flex";
}


/* =====================================================
   RIAPRI CHAT
===================================================== */

function restoreChat() {

  const modal = document.getElementById("chatModal");

  const button = document.getElementById("chatMinimizedButton");

  if (modal) {

    modal.style.display = "flex";

  }

  if (button) {

    button.remove();

  }
}


/* =====================================================
   MINIMIZZA LISTA MESSAGGI
===================================================== */

function minimizeMessagesList() {

  const modal = document.getElementById("messagesModal");

  if (!modal) {
    return;
  }

  // Nasconde la lista messaggi
  modal.style.display = "none";

  // Controlla se esiste già il pulsante
  let button = document.getElementById("messagesMinimizedButton");

  if (!button) {

    button = document.createElement("button");

    button.id = "messagesMinimizedButton";

    button.className = "chat-minimized-button messages-minimized-button";

    button.type = "button";

    button.title = "Apri messaggi";

    button.innerHTML = "📋";

    button.onclick = function() {
      restoreMessagesList();
    };

    document.body.appendChild(button);
  }

  // Mostra il pulsante
  button.style.display = "flex";
}


/* =====================================================
   RIAPRI LISTA MESSAGGI
===================================================== */

function restoreMessagesList() {

  const modal = document.getElementById("messagesModal");

  const button = document.getElementById("messagesMinimizedButton");

  if (modal) {

    modal.style.display = "flex";

  }

  if (button) {

    button.remove();

  }
}


/* =====================================================
   CHIUDI CHAT
===================================================== */

function closeChat() {

  const modal = document.getElementById("chatModal");

  if (modal) {

    modal.remove();

  }

  const button = document.getElementById("chatMinimizedButton");

  if (button) {

    button.remove();

  }
}

/*=================*/
let typingTimeout;

function setupTyping(conversationId, otherUserName) {

  const input = document.getElementById("chatText");

  input.addEventListener("input", () => {

    supabaseClient
      .from("typing")
      .insert({ conversation_id: conversationId, user_id: currentUser.id })
      .then(() => {});

    clearTimeout(typingTimeout);

    typingTimeout = setTimeout(() => {
      supabaseClient
        .from("typing")
        .delete()
        .eq("conversation_id", conversationId)
        .eq("user_id", currentUser.id);
    }, 2000);
  });

  supabaseClient
    .channel(`typing_${conversationId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "typing" },
      payload => {

        const typingBox = document.getElementById("typingIndicator");

        if (payload.eventType === "INSERT" && payload.new.user_id !== currentUser.id) {
          typingBox.textContent = `${otherUserName} sta scrivendo…`;
        } else {
          typingBox.textContent = "";
        }
      }
    )
    .subscribe();
}

/*=================*/


/*=================*/

/*=================*/





/*=================*/
async function loadMessages(conversationId) {

  const { data: messages } =
    await supabaseClient
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

  const box = document.getElementById("chatMessages");
  box.innerHTML = "";

  messages.forEach(msg => {

    const div = document.createElement("div");

    if (msg.is_system) {

      div.className = "msg msg-system";
      div.textContent = msg.message;
      box.appendChild(div);
      return;

    }

    const isMine = msg.sender_id === currentUser.id;
    const isUnread = !isMine && msg.read_at === null;

    if (isMine) {
      div.className = "msg msg-me";
    } else if (isUnread) {
      div.className = "msg msg-other msg-unread";
    } else {
      div.className = "msg msg-other";
    }

    div.textContent = msg.message;

    box.appendChild(div);
  });

  box.scrollTop = box.scrollHeight;
}
/*===========================*/
async function sendMessage(conversationId) {

  const input = document.getElementById("chatText");
  const text = input.value.trim();

  if (!text) return;

  await supabaseClient
    .from("messages")
    .insert([
      {
        conversation_id: conversationId,
        sender_id: currentUser.id,
        message: text
      }
    ]);

  input.value = "";

  loadMessages(conversationId);
}
function showNotificationBadge(button) {
  if (!button.querySelector(".notify-badge")) {
    const badge = document.createElement("span");
    badge.className = "notify-badge";
    badge.textContent = "1";
    button.appendChild(badge);
  }
}
function showToast(message) {
  const toast = document.createElement("div");
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = "#0066ff";
  toast.style.color = "#fff";
  toast.style.padding = "12px 18px";
  toast.style.borderRadius = "10px";
  toast.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
  toast.style.zIndex = "999999";
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}
/*===================================*/
function subscribeToMessages(conversationId) {

  supabaseClient
    .channel(`conversation_${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`
      },
      payload => {

        const msg = payload.new;

        if (msg.is_system) {

          if (msg.sender_id !== currentUser.id) {
            showToast("📦 " + msg.message);
          }

          const box = document.getElementById("chatMessages");

          if (box) {
            const div = document.createElement("div");
            div.className = "msg msg-system";
            div.textContent = msg.message;
            box.appendChild(div);
            box.scrollTop = box.scrollHeight;
          }

          // Aggiorna i bottoni azione (es. sblocca recensione)
          if (typeof refreshChatActionButtons === "function") {
            refreshChatActionButtons(conversationId);
          }

          return;

        }

        if (msg.sender_id !== currentUser.id) {

          showToast("Nuovo messaggio ricevuto");

          const buttons = document.querySelectorAll('[data-action="contact"]');
          buttons.forEach(btn => showNotificationBadge(btn));

          const box = document.getElementById("chatMessages");

          if (box) {
            const div = document.createElement("div");
            div.className = "msg msg-other msg-unread";
            div.textContent = msg.message;
            box.appendChild(div);
            box.scrollTop = box.scrollHeight;
            return;
          }
        }

        loadMessages(conversationId);
      }
    )
    .subscribe();
}


/*===================================*/
async function openConversation(otherUserId, tripId = null, requestId = null) {

  if (tripId === "null") tripId = null;
  if (requestId === "null") requestId = null;

  if (!currentUser) {
    openAuth("login");
    return;
  }

  const otherUserName = await getUserName(otherUserId);

  let query = supabaseClient
    .from("conversations")
    .select("*")
    .or(`participant_1.eq.${currentUser.id},participant_2.eq.${currentUser.id}`)
    .or(`participant_1.eq.${otherUserId},participant_2.eq.${otherUserId}`);

  if (tripId !== null) query = query.eq("trip_id", tripId);
  else query = query.is("trip_id", null);

  if (requestId !== null) query = query.eq("request_id", requestId);
  else query = query.is("request_id", null);

  const { data: existing, error } = await query;

  if (error) {
    console.error("Errore Supabase:", error);
    return;
  }

  let conversation = existing && existing.length > 0 ? existing[0] : null;

  openChatModal(
    conversation ? conversation.id : null,
    otherUserName,
    otherUserId,
    tripId,
    requestId
  );
}








/* =====================================================
   DARK MODE
===================================================== */

function toggleDarkMode() {

  document.body
    .classList
    .toggle("dark");


  const isDark =
    document.body
      .classList
      .contains("dark");


  localStorage.setItem(
    "hezmaak_dark",
    isDark
      ? "1"
      : "0"
  );

}


if (
  localStorage.getItem(
    "hezmaak_dark"
  ) === "1"
) {

  document.body.classList.add(
    "dark"
  );

}


/* =====================================================
   MOBILE MENU
===================================================== */

function toggleMenu() {

  document
    .getElementById(
      "mainNav"
    )
    .classList
    .toggle("open");

}


/* =====================================================
   HOME
===================================================== */

function goHome() {

  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

}


/* =====================================================
   FLAGS
===================================================== */

function flag(country) {

  return countryFlag(country);

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHtml(
  value
) {

  if (!value)
    return "";


  return String(value)

    .replaceAll(
      "&",
      "&amp;"
    )

    .replaceAll(
      "<",
      "&lt;"
    )

    .replaceAll(
      ">",
      "&gt;"
    )

    .replaceAll(
      '"',
      "&quot;"
    )

    .replaceAll(
      "'",
      "&#039;"
    );

}


/* =====================================================
   PROFILE PLACEHOLDERS
===================================================== */

function editProfile() {

  alert(
    t("editComing")
  );

}

/* =====================================================
   I MIEI VIAGGI
===================================================== */

async function showMyTrips() {

    if (!currentUser) {
        openAuth("login");
        return;
    }


    const {
        data,
        error
    } =
        await supabaseClient
            .from("trips")
            .select("*")
            .eq(
                "user_id",
                currentUser.id
            )
            .order(
                "travel_date",
                {
                    ascending: false
                }
            );


    if (error) {

        showPopup({

            title:
                "Errore",

            message:
                escapeHtml(
                    error.message
                ),

            type:
                "error"

        });

        return;

    }


    const old =
        document.getElementById(
            "myTripsPage"
        );

    if (old) {
        old.remove();
    }


    const page =
        document.createElement("div");

    page.id =
        "myTripsPage";


    page.innerHTML = `

        <div class="profile-page">

            <div class="container">

                <button
                    class="back-button"
                    onclick="closeMyTrips()">

                    ← Torna al profilo

                </button>


                <div class="profile-header">

                    <span class="section-label">
                        LA MIA ATTIVITÀ
                    </span>

                    <h1>
                        ✈️ I miei viaggi
                    </h1>

                    <p>
                        Gestisci i viaggi che hai pubblicato.
                    </p>

                </div>


                <div class="my-trips-list">

                    ${
                        data.length

                        ? data
                            .map(
                                myTripHTML
                            )
                            .join("")

                        : `

                            <div class="profile-card">

                                <h3>
                                    ✈️ Nessun viaggio
                                </h3>

                                <p>
                                    Non hai ancora pubblicato
                                    nessun viaggio.
                                </p>

                                <button
                                    class="primary"
                                    onclick="closeMyTrips(); openTripModal();">

                                    + Pubblica viaggio

                                </button>

                            </div>

                        `
                    }

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(page);

    document.body.style.overflow =
        "hidden";
}
function myTripHTML(trip) {

    const date =
        trip.travel_date
            ? new Date(
                trip.travel_date +
                "T12:00:00"
              ).toLocaleDateString(
                "it-IT"
              )
            : "-";


    let statusHTML = "";


    if (
        trip.verification_status ===
        "approved"
    ) {

        statusHTML = `

            <div class="my-trip-status approved">

                ✓ Biglietto verificato

            </div>

        `;

    }


    else if (
        trip.verification_status ===
        "rejected"
    ) {

        statusHTML = `

            <div class="my-trip-status rejected">

                ⚠️ Biglietto non approvato

            </div>


            <div class="trip-rejection">

                <strong>
                    Motivo del rifiuto:
                </strong>

                <p>
                    ${escapeHtml(
                        trip.verification_rejection_reason ||
                        "Il biglietto non è stato approvato."
                    )}
                </p>

            </div>


            <button
                class="primary"
                onclick="replaceTravelTicket('${trip.id}')">

                🎫 Carica nuovo biglietto

            </button>

        `;

    }


    else {

        statusHTML = `

            <div class="my-trip-status pending">

                ⏳ Biglietto in verifica

                <small>
                    L'amministratore sta controllando
                    il tuo biglietto.
                </small>

            </div>

        `;

    }


    return `

        <div
            class="profile-card my-trip-card"
            id="my-trip-${trip.id}"
        >

            <div class="my-trip-header">

                <div>

                    <span class="section-label">
                        VIAGGIO
                    </span>


                    <h3>

                        ${flag(
                            trip.departure_country
                        )}

                        ${escapeHtml(
                            cityName(trip.departure_city)
                        )}

                        →

                        ${flag(
                            trip.arrival_country
                        )}

                        ${escapeHtml(
                            cityName(trip.arrival_city)
                        )}

                    </h3>

                </div>


                ${statusHTML}

            </div>


            <div class="profile-info-grid">

                <div>

                    <span>
                        Data
                    </span>

                    <strong>
                        📅 ${date}
                    </strong>

                </div>


                <div>

                    <span>
                        Spazio
                    </span>

                    <strong>
                        📦 ${trip.available_kg} kg
                    </strong>

                </div>


                <div>

                    <span>
                        Prezzo
                    </span>

                    <strong>

                        ${
                            trip.price_per_kg
                            ? `€${trip.price_per_kg}/kg`
                            : "Non specificato"
                        }

                    </strong>

                </div>

            </div>


            ${
                trip.description
                ? `
                    <p class="trip-description">

                        ${escapeHtml(
                            trip.description
                        )}

                    </p>
                `
                : ""
            }

        </div>

    `;

}
function closeMyTrips() {

    const page =
        document.getElementById(
            "myTripsPage"
        );

    if (page) {
        page.remove();
    }


    document.body.style.overflow =
        "";


    showProfile();

}
/* =====================================================
   NUOVO BIGLIETTO
===================================================== */

async function replaceTravelTicket(
    tripId
) {

    const old =
        document.getElementById(
            "replaceTicketModal"
        );

    if (old) {
        old.remove();
    }


    const modal =
        document.createElement("div");

    modal.id =
        "replaceTicketModal";


    modal.innerHTML = `

        <div class="popup-overlay">

            <div class="popup-box">

                <button
                    class="popup-close"
                    onclick="closeReplaceTicket()">

                    ×

                </button>


                <div class="popup-icon">
                    🎫
                </div>


                <h3>
                    Carica nuovo biglietto
                </h3>


                <p>
                    Carica il nuovo biglietto
                    per permettere all'amministratore
                    di effettuare una nuova verifica.
                </p>


                <input
                    id="newTravelTicket"
                    type="file"
                    accept=".jpg,.jpeg,.png,.pdf"
                >


                <small class="upload-help">

                    JPG, PNG o PDF.
                    Massimo 10 MB.

                </small>


                <div
                    id="replaceTicketMessage">
                </div>


                <div class="popup-buttons">

                    <button
                        class="secondary"
                        onclick="closeReplaceTicket()">

                        Annulla

                    </button>


                    <button
                        class="primary"
                        onclick="uploadNewTravelTicket('${tripId}')">

                        🎫 Invia nuovo biglietto

                    </button>

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );

}
/* =====================================================
   UPLOAD NUOVO BIGLIETTO
===================================================== */

async function uploadNewTravelTicket(
    tripId
) {

    if (!currentUser) {
        return;
    }


    const input =
        document.getElementById(
            "newTravelTicket"
        );


    const message =
        document.getElementById(
            "replaceTicketMessage"
        );


    if (
        !input.files ||
        !input.files.length
    ) {

        message.innerHTML = `

            <div class="auth-error">

                Seleziona un biglietto.

            </div>

        `;

        return;

    }


    const file =
        input.files[0];


    const maxSize =
        10 * 1024 * 1024;


    if (file.size > maxSize) {

        message.innerHTML = `

            <div class="auth-error">

                Il file supera i 10 MB.

            </div>

        `;

        return;

    }


    const allowedTypes = [

        "image/jpeg",
        "image/png",
        "application/pdf"

    ];


    if (
        !allowedTypes.includes(
            file.type
        )
    ) {

        message.innerHTML = `

            <div class="auth-error">

                Formato non supportato.
                Usa JPG, PNG o PDF.

            </div>

        `;

        return;

    }


    message.innerHTML = `

        <div class="auth-success">

            Upload in corso...

        </div>

    `;


    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    const ticketPath =
        `${currentUser.id}/ticket-${Date.now()}.${extension}`;


    const {
        error: uploadError
    } =
        await supabaseClient
            .storage
            .from("travel-tickets")
            .upload(
                ticketPath,
                file,
                {
                    upsert: false
                }
            );


    if (uploadError) {

        console.error(uploadError);

        message.innerHTML = `

            <div class="auth-error">

                Errore caricamento:
                ${escapeHtml(
                    uploadError.message
                )}

            </div>

        `;

        return;

    }


    const {
        error: updateError
    } =
        await supabaseClient
            .from("trips")
            .update({

                ticket_path:
                    ticketPath,

                verification_status:
                    "pending",

                verification_rejection_reason:
                    null

            })
            .eq(
                "id",
                tripId
            )
            .eq(
                "user_id",
                currentUser.id
            );


    if (updateError) {

        console.error(
            updateError
        );


        await supabaseClient
            .storage
            .from("travel-tickets")
            .remove([
                ticketPath
            ]);


        message.innerHTML = `

            <div class="auth-error">

                Errore aggiornamento viaggio:
                ${escapeHtml(
                    updateError.message
                )}

            </div>

        `;

        return;

    }


    message.innerHTML = `

        <div class="auth-success">

            ✓ Nuovo biglietto inviato.

            <br>

            È ora nuovamente in verifica.

        </div>

    `;


    setTimeout(
        () => {

            closeReplaceTicket();

            showMyTrips();

        },
        1200
    );

}
function closeReplaceTicket() {

    const modal =
        document.getElementById(
            "replaceTicketModal"
        );

    if (modal) {
        modal.remove();
    }

}
function myTripHTML(trip) {

  const date =
    trip.travel_date
      ? new Date(
          trip.travel_date +
          "T12:00:00"
        ).toLocaleDateString(
          "it-IT"
        )
      : "-";


  let verificationHTML = "";

  if (
    trip.verification_status ===
    "approved"
  ) {

    verificationHTML = `
      <span class="verified-trip">
        ✓ Biglietto verificato
      </span>
    `;

  } else if (
    trip.verification_status ===
    "pending"
  ) {

    verificationHTML = `
      <span class="pending-trip">
        ⏳ Biglietto in verifica
      </span>
    `;

  } else {

    verificationHTML = `
      <span class="rejected-trip">
        ⚠️ Verifica non approvata
      </span>
    `;

  }


  return `

    <article
      class="profile-card activity-card"
      id="trip-${trip.id}">

      <div class="activity-header">

        <div>

          <span class="section-label">
            VIAGGIO
          </span>

          <h3>

            ${flag(
              trip.departure_country
            )}

            ${escapeHtml(
              cityName(trip.departure_city)
            )}

            →

            ${flag(
              trip.arrival_country
            )}

            ${escapeHtml(
              cityName(trip.arrival_city)
            )}

          </h3>

        </div>

        ${verificationHTML}

      </div>


      <div class="activity-info">

        <div>

          <span>
            📅 Data
          </span>

          <strong>
            ${date}
          </strong>

        </div>


        <div>

          <span>
            📦 Spazio disponibile
          </span>

          <strong>
            ${trip.available_kg} kg
          </strong>

        </div>


        <div>

          <span>
            💰 Prezzo
          </span>

          <strong>

            ${
              trip.price_per_kg
                ? `€${trip.price_per_kg}/kg`
                : "Non specificato"
            }

          </strong>

        </div>


<div>

  <span>
    📌 Stato
  </span>

  <strong>

    ${
      trip.status === "active"
        ? "🟢 Attivo"
        : trip.status === "in_progress"
          ? "🤝 Accordo raggiunto"
          : "⚪ Chiuso"
    }

  </strong>

</div>

      </div>


      ${
        trip.description

          ? `

            <p class="activity-description">

              ${escapeHtml(
                trip.description
              )}

            </p>

          `

          : ""
      }


      <div class="activity-actions">

        <button
          class="secondary"
          onclick="
            editTrip('${trip.id}')
          ">

          ✏️ Modifica

        </button>


        <button
          class="danger-button"
          onclick="
            deleteTrip('${trip.id}')
          ">

          🗑 Elimina

        </button>

      </div>

    </article>

  `;
}
function closeMyTrips() {

  const page =
    document.getElementById(
      "myTripsPage"
    );

  if (page) {
    page.remove();
  }

  document.body.style.overflow =
    "";

}
/* =====================================================
   DELETE TRIP
===================================================== */

async function deleteTrip(tripId) {

  if (!currentUser) {
    openAuth("login");
    return;
  }

  const confirmed = confirm(
    "Sei sicuro di voler eliminare questo viaggio?\n\n" +
    "Il viaggio e il relativo biglietto verranno eliminati."
  );

  if (!confirmed) {
    return;
  }


  /*
    Recuperiamo prima il viaggio
    per ottenere il percorso del biglietto.
  */

  const {
    data: trip,
    error: tripFetchError
  } = await supabaseClient
    .from("trips")
    .select(`
      id,
      user_id,
      ticket_path
    `)
    .eq("id", tripId)
    .eq("user_id", currentUser.id)
    .single();


  if (tripFetchError) {

    console.error(tripFetchError);

    alert(
      "Errore recupero viaggio: " +
      tripFetchError.message
    );

    return;
  }


  /*
    Controllo sicurezza:
    il viaggio deve appartenere
    all'utente loggato.
  */

  if (
    !trip ||
    trip.user_id !== currentUser.id
  ) {

    alert(
      "Non puoi eliminare questo viaggio."
    );

    return;
  }


  /*
    Eliminiamo il viaggio dal database.
  */

  const {
    error: deleteError
  } = await supabaseClient
    .from("trips")
    .delete()
    .eq("id", tripId)
    .eq("user_id", currentUser.id);


  if (deleteError) {

    console.error(deleteError);

    alert(
      "Errore eliminazione viaggio: " +
      deleteError.message
    );

    return;
  }


  /*
    Se esiste un biglietto,
    eliminiamo anche il file Storage.
  */

  if (trip.ticket_path) {

    const {
      error: storageError
    } = await supabaseClient
      .storage
      .from("travel-tickets")
      .remove([
        trip.ticket_path
      ]);


    if (storageError) {

      console.error(
        "Errore eliminazione biglietto:",
        storageError
      );

      /*
        Il viaggio è comunque stato eliminato.
        Mostriamo solo un avviso.
      */

      alert(
        "Viaggio eliminato, ma non è stato possibile eliminare il biglietto dal deposito."
      );

    }
  }


  /*
    Rimuoviamo la scheda dalla pagina
    senza dover ricaricare tutto.
  */

  const card =
    document.getElementById(
      `trip-${tripId}`
    );

  if (card) {
    card.remove();
  }


  /*
    Se non ci sono più viaggi,
    mostriamo il messaggio vuoto.
  */

  const list =
    document.querySelector(
      ".my-activity-list"
    );

  if (
    list &&
    !list.children.length
  ) {

    list.innerHTML = `

      <div class="profile-card empty-state">

        <div class="avatar">
          ✈️
        </div>

        <h3>
          Non hai più viaggi pubblicati
        </h3>

        <p>
          Pubblica un nuovo viaggio
          quando vuoi.
        </p>

        <button
          class="primary"
          onclick="
            closeMyTrips();
            openTripModal();
          ">

          + Pubblica viaggio

        </button>

      </div>

    `;
  }


  /*
    Aggiorniamo anche la homepage.
  */

  loadTrips();


  alert(
    "✓ Viaggio eliminato correttamente."
  );

}
async function showMyRequests() {

  if (!currentUser) {
    openAuth("login");
    return;
  }

  const {
    data,
    error
  } = await supabaseClient
    .from("requests")
    .select("*")
    .eq("user_id", currentUser.id)
    .order("created_at", {
      ascending: false
    });

  if (error) {

    console.error(error);

    alert(
      "Errore caricamento richieste: " +
      error.message
    );

    return;
  }

  const oldPage =
    document.getElementById("myRequestsPage");

  if (oldPage) {
    oldPage.remove();
  }

  const page =
    document.createElement("div");

  page.id = "myRequestsPage";

  page.innerHTML = `

    <div class="profile-page">

      <div class="container">

        <button
          class="back-button"
          onclick="closeMyRequests()">

          ← Torna al profilo

        </button>

        <div class="profile-header">

          <div>

            <span class="section-label">
              LA MIA ATTIVITÀ
            </span>

            <h1>
              📦 Le mie richieste
            </h1>

            <p>
              Gestisci le richieste che hai pubblicato.
            </p>

          </div>

          <button
            class="primary"
            onclick="closeMyRequests(); openRequestModal();">

            + Nuova richiesta

          </button>

        </div>

        <div class="my-activity-list">

          ${
            data.length
              ? data.map(myRequestCard).join("")
              : `

                <div class="profile-card empty-state">

                  <div class="avatar">
                    📦
                  </div>

                  <h3>
                    Nessuna richiesta
                  </h3>

                  <p>
                    Non hai ancora pubblicato
                    nessuna richiesta.
                  </p>

                  <button
                    class="primary"
                    onclick="closeMyRequests(); openRequestModal();">

                    Pubblica una richiesta

                  </button>

                </div>

              `
          }

        </div>

      </div>

    </div>

  `;

  document.body.appendChild(page);

  document.body.style.overflow = "hidden";
}
function myRequestCard(request) {

  const date = request.needed_date
    ? new Date(
        request.needed_date + "T12:00:00"
      ).toLocaleDateString("it-IT")
    : "Non specificata";



let statusLabel = "Aperta";

if (request.status === "open") {
  statusLabel = "🟢 Aperta";
} else if (request.status === "closed") {
  statusLabel = "🤝 Accordo raggiunto";
} else if (request.status === "cancelled") {
  statusLabel = "🔴 Annullata";
}

  return `

    <div
      class="profile-card activity-card"
      id="my-request-${request.id}">

      <div class="activity-card-header">

        <div>

          <span class="section-label">
            RICHIESTA
          </span>

          <h3>

            ${flag(request.departure_country)}

            ${escapeHtml(cityName(request.departure_city))}

            →

            ${flag(request.arrival_country)}

            ${escapeHtml(cityName(request.arrival_city))}

          </h3>

        </div>

        <span class="activity-status">
          ${statusLabel}
        </span>

      </div>


      <div class="profile-info-grid">

        <div>

          <span>
            Data necessaria
          </span>

          <strong>
            📅 ${date}
          </strong>

        </div>


        <div>

          <span>
            Oggetto
          </span>

          <strong>
            ${escapeHtml(
              request.item_description || "-"
            )}
          </strong>

        </div>


        <div>

          <span>
            Peso
          </span>

          <strong>
            ${
              request.weight_kg
                ? request.weight_kg + " kg"
                : "-"
            }
          </strong>

        </div>


        <div>

          <span>
            Budget
          </span>

          <strong>
            ${
              request.budget
                ? "€" + request.budget
                : "-"
            }
          </strong>

        </div>

      </div>


      <div class="activity-actions">

        ${
          request.status === "open"

            ? `

              <button
                class="danger-button"
                onclick="deleteMyRequest('${request.id}')">

                🗑 Elimina richiesta

              </button>

            `

            : ""

        }

      </div>

    </div>

  `;
}
function closeMyRequests() {

  const page =
    document.getElementById(
      "myRequestsPage"
    );

  if (page) {
    page.remove();
  }

  document.body.style.overflow = "";

}
async function deleteMyRequest(requestId) {

  if (
    !confirm(
      "Vuoi davvero eliminare questa richiesta?"
    )
  ) {
    return;
  }

  const {
    error
  } = await supabaseClient
    .from("requests")
    .delete()
    .eq("id", requestId)
    .eq("user_id", currentUser.id);

  if (error) {

    alert(
      "Errore eliminazione: " +
      error.message
    );

    return;
  }

  const card =
    document.getElementById(
      `my-request-${requestId}`
    );

  if (card) {
    card.remove();
  }

  loadRequests();

}
async function showMyReviews() {

  if (!currentUser) {
    openAuth("login");
    return;
  }

  const {
    data,
    error
  } = await supabaseClient
    .from("reviews")
    .select(`
      id,
      reviewer_id,
      reviewed_user_id,
      rating,
      comment,
      created_at
    `)
    .eq(
      "reviewed_user_id",
      currentUser.id
    )
    .order(
      "created_at",
      {
        ascending: false
      }
    );

  if (error) {

    console.error(error);

    alert(
      "Errore caricamento recensioni: " +
      error.message
    );

    return;
  }

  const oldPage =
    document.getElementById(
      "myReviewsPage"
    );

  if (oldPage) {
    oldPage.remove();
  }

  const page =
    document.createElement("div");

  page.id =
    "myReviewsPage";

  page.innerHTML = `

    <div class="profile-page">

      <div class="container">

        <button
          class="back-button"
          onclick="closeMyReviews()">

          ← Torna al profilo

        </button>


        <div class="profile-header">

          <div>

            <span class="section-label">
              LA MIA ATTIVITÀ
            </span>

            <h1>
              ⭐ Le mie recensioni
            </h1>

            <p>
              Le recensioni ricevute dagli altri utenti.
            </p>

          </div>

        </div>


        <div class="profile-card">

          <div class="profile-card-title">

            <h3>
              Le mie valutazioni
            </h3>

            <strong>
              ${data.length}
            </strong>

          </div>


          ${
            data.length
              ? `
                <div class="reviews-list">

                  ${data
                    .map(reviewCard)
                    .join("")}

                </div>
              `
              : `

                <div class="empty-state">

                  <div class="avatar">
                    ⭐
                  </div>

                  <h3>
                    Nessuna recensione
                  </h3>

                  <p>
                    Non hai ancora ricevuto recensioni.
                  </p>

                </div>

              `
          }

        </div>

      </div>

    </div>

  `;

  document.body.appendChild(page);

  document.body.style.overflow =
    "hidden";
}
function reviewCard(review) {

  const rating =
    Math.max(
      1,
      Math.min(
        5,
        Number(review.rating) || 0
      )
    );

  const stars =
    "⭐".repeat(rating);

  const date =
    review.created_at
      ? new Date(
          review.created_at
        ).toLocaleDateString("it-IT")
      : "";

  return `

    <div class="review-item">

      <div class="review-header">

        <div>

          <strong>
            ${stars}
          </strong>

          <div class="review-date">
            ${date}
          </div>

        </div>

        <span>
          ${rating}/5
        </span>

      </div>


      ${
        review.comment
          ? `
            <p class="review-comment">
              "${escapeHtml(
                review.comment
              )}"
            </p>
          `
          : `
            <p class="review-comment">
              Nessun commento.
            </p>
          `
      }

    </div>

  `;
}
function closeMyReviews() {

  const page =
    document.getElementById(
      "myReviewsPage"
    );

  if (page) {
    page.remove();
  }

  document.body.style.overflow =
    "";
}
/* =====================================================
   IDENTITY VERIFICATION
===================================================== */

async function openVerification() {

  if (!currentUser) {

    openAuth("login");

    return;

  }


  const {
    data: existing,
    error
  } =
    await supabaseClient
      .from("verification_requests")
      .select("*")
      .eq(
        "user_id",
        currentUser.id
      )
      .order(
        "created_at",
        {
          ascending: false
        }
      )
      .limit(1)
      .maybeSingle();


  if (error) {

    alert(
      error.message
    );

    return;

  }


  const modal =
    document.createElement(
      "div"
    );

  modal.id =
    "verificationModal";


  let statusHtml =
    "";


  if (existing) {


    if (
      existing.status ===
      "pending"
    ) {

      statusHtml =
        `

        <div class="verification-pending">

          ⏳

          <strong>
            ${t("pending")}
          </strong>

          <p>
            ${t("reviewText")}
          </p>

        </div>

        `;

    }


    if (
      existing.status ===
      "approved"
    ) {

      statusHtml =
        `

        <div class="verification-approved">

          ✓

          <strong>
            ${t("identityVerified")}
          </strong>

          <p>
            ${t("verifiedIdentity")}
          </p>

        </div>

        `;

    }


    if (
      existing.status ===
      "rejected"
    ) {

      statusHtml =
        `

        <div class="verification-rejected">

          ⚠️

          <strong>
            ${t("rejected")}
          </strong>

          <p>

            ${
              escapeHtml(
                existing.rejection_reason ||
                t("verificationRejected")
              )
            }

          </p>

        </div>

        `;

    }

  }


  modal.innerHTML = `

    <div class="auth-overlay">

      <div class="auth-box verification-modal">


        <button
          class="auth-close"
          onclick="closeVerification()">

          ×

        </button>


        <div class="verification-icon">
          🪪
        </div>


        <h2>
          ${t("verifyTitle")}
        </h2>


        <p>
          ${t("verifyText")}
        </p>


        ${statusHtml}


        ${
          !existing ||
          existing.status === "rejected"

          ? `

            <div class="verification-form">


              <label>
                ${t("documentType")}
              </label>


              <select
                id="documentType">

                <option value="passport">
                  ${t("passport")}
                </option>

                <option value="identity_card">
                  ${t("identityCard")}
                </option>

              </select>


              <label>
                ${t("document")}
              </label>


              <input
                id="documentFile"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
              >


              <small class="upload-help">

                ${t("uploadHelp")}

              </small>


              <div
                id="verificationMessage">
              </div>


              <button
                class="primary auth-button"
                onclick="uploadVerificationDocument()">

                ${t("sendDocument")}

              </button>


            </div>

          `

          : ""

        }


      </div>

    </div>

  `;


  document.body.appendChild(
    modal
  );

}


function closeVerification() {

  const modal =
    document.getElementById(
      "verificationModal"
    );

  if (modal) {

    modal.remove();

  }

}


async function uploadVerificationDocument() {

  if (!currentUser) {
    return;
  }


  const type =
    document.getElementById(
      "documentType"
    ).value;


  const input =
    document.getElementById(
      "documentFile"
    );


  const message =
    document.getElementById(
      "verificationMessage"
    );


  if (
    !input.files ||
    !input.files.length
  ) {

    message.innerHTML =
      `
      <div class="auth-error">
        ${t("document")}
      </div>
      `;

    return;

  }


  const file =
    input.files[0];


  const maxSize =
    10 * 1024 * 1024;


  if (
    file.size >
    maxSize
  ) {

    message.innerHTML =
      `
      <div class="auth-error">
        ${t("uploadHelp")}
      </div>
      `;

    return;

  }


  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf"
  ];


  if (
    !allowedTypes.includes(
      file.type
    )
  ) {

    message.innerHTML =
      `
      <div class="auth-error">
        Formato non supportato.
      </div>
      `;

    return;

  }


  message.innerHTML =
    `
    <div class="auth-success">
      ${t("uploadInProgress")}
    </div>
    `;


  const extension =
    file.name
      .split(".")
      .pop()
      .toLowerCase();


  const fileName =
    `${type}-${Date.now()}.${extension}`;


  const filePath =
    `${currentUser.id}/${fileName}`;


  const {
    error: uploadError
  } =
    await supabaseClient
      .storage
      .from(
        "verification-documents"
      )
      .upload(
        filePath,
        file,
        {
          upsert: false,
          contentType:
            file.type
        }
      );


  if (uploadError) {

    console.error(
      uploadError
    );


    message.innerHTML =
      `
      <div class="auth-error">

        ${escapeHtml(
          uploadError.message
        )}

      </div>
      `;

    return;

  }


  const {
    error: requestError
  } =
    await supabaseClient
      .from(
        "verification_requests"
      )
      .insert({

        user_id:
          currentUser.id,

        document_type:
          type,

        document_path:
          filePath,

        status:
          "pending"

      });


  if (requestError) {

    console.error(
      requestError
    );


    await supabaseClient
      .storage
      .from(
        "verification-documents"
      )
      .remove([
        filePath
      ]);


    message.innerHTML =
      `
      <div class="auth-error">

        ${escapeHtml(
          requestError.message
        )}

      </div>
      `;

    return;

  }


  message.innerHTML =
    `
    <div class="auth-success">

      ${t("documentSent")}

      <br>

      ${t("reviewText")}

    </div>
    `;


  setTimeout(
    () => {

      closeVerification();

      showProfile();

    },
    1200
  );

}


/* =====================================================
   ADMIN
===================================================== */

async function openAdminPanel() {

  if (!currentUser) {

    openAuth("login");

    return;

  }


  const {
    data,
    error
  } =
    await supabaseClient.rpc(
      "is_admin"
    );


  if (error) {

    console.error(
      error
    );

    alert(
      error.message
    );

    return;

  }


  if (!data) {

    alert(
      "Accesso non autorizzato."
    );

    return;

  }


  loadAdminPanel();

}


async function loadAdminPanel() {

    if (!currentUser) {
        openAuth("login");
        return;
    }

    // Controlla che sia admin
    const {
        data: isAdmin,
        error: adminError
    } = await supabaseClient.rpc("is_admin");

    if (adminError || !isAdmin) {

        alert("Accesso non autorizzato.");
        return;
    }


    // ==========================================
    // LISTA UTENTI ISCRITTI
    // ==========================================

    const {
        data: allUsers,
        error: usersError
    } = await supabaseClient
        .from("profiles")
        .select(`
            id,
            full_name,
            country,
            user_type,
            is_verified,
            rating,
            reviews_count,
            created_at
        `)
        .order("created_at", {
            ascending: false
        });

    if (usersError) {

        console.error(
            "Errore caricamento utenti:",
            usersError
        );

    }

    const totalUsers =
        allUsers ? allUsers.length : null;


    // ==========================================
    // RICHIESTE DOCUMENTI IDENTITÀ
    // ==========================================

    const {
        data: verificationRequests,
        error: verificationError
    } = await supabaseClient
        .from("verification_requests")
        .select(`
            id,
            user_id,
            document_type,
            document_path,
            status,
            rejection_reason,
            created_at
        `)
        .eq("status", "pending")
        .order("created_at", {
            ascending: true
        });


    if (verificationError) {

        console.error(
            "Errore verifiche identità:",
            verificationError
        );

        alert(
            "Errore caricamento verifiche: " +
            verificationError.message
        );

        return;
    }


    // ==========================================
    // BIGLIETTI VIAGGI
    // ==========================================

    const {
        data: pendingTrips,
        error: tripsError
    } = await supabaseClient
        .from("trips")
        .select(`
            id,
            user_id,
            departure_country,
            arrival_country,
            departure_city,
            arrival_city,
            travel_date,
            available_kg,
            price_per_kg,
            description,
            ticket_path,
            verification_status,
            created_at
        `)
        .eq(
            "verification_status",
            "pending"
        )
        .not(
            "ticket_path",
            "is",
            null
        )
        .order(
            "created_at",
            {
                ascending: true
            }
        );


    if (tripsError) {

        console.error(
            "Errore biglietti:",
            tripsError
        );

        alert(
            "Errore caricamento biglietti: " +
            tripsError.message
        );

        return;
    }


    // ==========================================
    // SEGNALAZIONI
    // ==========================================

    const {
        data: pendingReports,
        error: reportsError
    } = await supabaseClient
        .from("reports")
        .select(`
            id,
            reporter_id,
            reported_user_id,
            trip_id,
            request_id,
            conversation_id,
            reason,
            description,
            status,
            created_at
        `)
        .eq("status", "pending")
        .order("created_at", {
            ascending: true
        });


    if (reportsError) {

        console.error(
            "Errore segnalazioni:",
            reportsError
        );

        alert(
            "Errore caricamento segnalazioni: " +
            reportsError.message
        );

        return;
    }


    // Arricchiamo ogni segnalazione con i nomi degli utenti coinvolti
    for (const report of pendingReports) {

        report._reporterName =
            await getUserName(report.reporter_id);

        report._reportedName =
            report.reported_user_id
                ? await getUserName(report.reported_user_id)
                : "-";

    }


    // ==========================================
    // RIMUOVE VECCHIO PANNELLO
    // ==========================================

    const old =
        document.getElementById(
            "adminPage"
        );

    if (old) {
        old.remove();
    }


    // ==========================================
    // CREA PAGINA ADMIN
    // ==========================================

    const page =
        document.createElement("div");

    page.id =
        "adminPage";


    page.innerHTML = `

        <div class="profile-page">

            <div class="container">

                <button
                    class="back-button"
                    onclick="closeAdminPanel()">

                    ${t("adminBackToSite")}

                </button>


                <div class="profile-header">

                    <span class="section-label">
                        ${t("administration")}
                    </span>

                    <h1>
                        ${t("adminPanelTitle")}
                    </h1>

                    <p>
                        ${t("adminPanelText")}
                    </p>

                </div>


                <!-- ================================= -->
                <!-- STATISTICHE -->
                <!-- ================================= -->

                <div class="profile-card">

                    <div class="profile-card-title">

                        <h3>
                            ${t("adminOverview")}
                        </h3>

                    </div>


                    <div class="profile-info-grid">

                        <div>

                            <span>
                                👥 Utenti iscritti
                            </span>

                            <strong>
                                ${totalUsers ?? "-"}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Verifiche identità
                            </span>

                            <strong>
                                ${verificationRequests.length}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Biglietti da verificare
                            </span>

                            <strong>
                                ${pendingTrips.length}
                            </strong>

                        </div>


                        <div>

                            <span>
                                🚩 Segnalazioni
                            </span>

                            <strong>
                                ${pendingReports.length}
                            </strong>

                        </div>

                    </div>

                </div>


                <!-- ================================= -->
                <!-- DOCUMENTI IDENTITÀ -->
                <!-- ================================= -->

                <div class="profile-header">

                    <span class="section-label">
                        IDENTITÀ
                    </span>

                    <h2>
                        🪪 Verifiche identità
                    </h2>

                </div>


                <div id="adminVerificationRequests">

                    ${
                        verificationRequests.length

                        ? verificationRequests
                            .map(
                                request =>
                                    adminRequestHTML(request)
                            )
                            .join("")

                        : `

                            <div class="profile-card">

                                <h3>
                                    ✓ Nessuna verifica identità
                                </h3>

                                <p>
                                    Non ci sono documenti
                                    in attesa di verifica.
                                </p>

                            </div>

                        `
                    }

                </div>


                <!-- ================================= -->
                <!-- BIGLIETTI -->
                <!-- ================================= -->

                <div
                    class="profile-header"
                    style="margin-top:40px;"
                >

                    <span class="section-label">
                        VIAGGI
                    </span>

                    <h2>
                        🎫 Verifica biglietti
                    </h2>

                    <p>
                        Controlla i biglietti caricati
                        dagli utenti prima di approvare
                        il viaggio.
                    </p>

                </div>


                <div id="adminTicketRequests">

                    ${
                        pendingTrips.length

                        ? pendingTrips
                            .map(
                                trip =>
                                    adminTripHTML(trip)
                            )
                            .join("")

                        : `

                            <div class="profile-card">

                                <h3>
                                    ✓ Nessun biglietto in attesa
                                </h3>

                                <p>
                                    Tutti i biglietti sono stati
                                    verificati.
                                </p>

                            </div>

                        `
                    }

                </div>


                <!-- ================================= -->
                <!-- SEGNALAZIONI -->
                <!-- ================================= -->

                <div
                    class="profile-header"
                    style="margin-top:40px;"
                >

                    <span class="section-label">
                        SICUREZZA
                    </span>

                    <h2>
                        🚩 Segnalazioni
                    </h2>

                    <p>
                        Revisiona le segnalazioni inviate dagli utenti.
                    </p>

                </div>


                <div id="adminReports">

                    ${
                        pendingReports.length

                        ? pendingReports
                            .map(
                                report =>
                                    adminReportHTML(report)
                            )
                            .join("")

                        : `

                            <div class="profile-card">

                                <h3>
                                    ✓ Nessuna segnalazione
                                </h3>

                                <p>
                                    Non ci sono segnalazioni in attesa.
                                </p>

                            </div>

                        `
                    }

                </div>


                <!-- ================================= -->
                <!-- UTENTI ISCRITTI -->
                <!-- ================================= -->

                <div
                    class="profile-header"
                    style="margin-top:40px;"
                >

                    <span class="section-label">
                        COMMUNITY
                    </span>

                    <h2>
                        👥 Utenti iscritti (${totalUsers ?? 0})
                    </h2>

                    <p>
                        Elenco di tutti gli utenti registrati sulla piattaforma.
                    </p>

                </div>


                <div id="adminUsers">

                    ${
                        allUsers && allUsers.length

                        ? allUsers
                            .map(
                                user =>
                                    adminUserHTML(user)
                            )
                            .join("")

                        : `

                            <div class="profile-card">

                                <h3>
                                    Nessun utente registrato
                                </h3>

                            </div>

                        `
                    }

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(page);

    document.body.style.overflow =
        "hidden";
}


function adminTripHTML(trip) {

    const departureFlag =
        flag(trip.departure_country);

    const arrivalFlag =
        flag(trip.arrival_country);


    const date =
        trip.travel_date
            ? new Date(
                trip.travel_date + "T12:00:00"
              ).toLocaleDateString("it-IT")
            : "-";


    return `

        <div
            class="profile-card admin-request"
            id="admin-trip-${trip.id}"
        >

            <div>

                <span class="section-label">
                    BIGLIETTO DA VERIFICARE
                </span>


                <h3>
                    ✈️

                    ${escapeHtml(
                        cityName(trip.departure_city) || ""
                    )}

                    →

                    ${escapeHtml(
                        cityName(trip.arrival_city) || ""
                    )}
                </h3>


                <p>

                    ${departureFlag}

                    ${escapeHtml(
                        trip.departure_country || ""
                    )}

                    →

                    ${arrivalFlag}

                    ${escapeHtml(
                        trip.arrival_country || ""
                    )}

                </p>


                <p>

                    📅

                    <strong>
                        ${date}
                    </strong>

                </p>


                <p>

                    📦 Spazio disponibile:

                    <strong>
                        ${trip.available_kg || 0} kg
                    </strong>

                </p>


                ${
                    trip.price_per_kg
                    ? `
                        <p>
                            💰 €${trip.price_per_kg}/kg
                        </p>
                    `
                    : ""
                }


                <p>

                    👤 User ID:

                    <br>

                    <code>
                        ${escapeHtml(
                            trip.user_id
                        )}
                    </code>

                </p>


                ${
                    trip.description
                    ? `
                        <p>
                            📝
                            ${escapeHtml(
                                trip.description
                            )}
                        </p>
                    `
                    : ""
                }

            </div>


            <div class="admin-actions">


                <!-- VISUALIZZA BIGLIETTO -->

                <button
                    class="secondary"
                    onclick="viewTravelTicket('${escapeHtml(
                        trip.ticket_path
                    )}')"
                >

                    👁 Visualizza biglietto

                </button>


                <!-- APPROVA -->

                <button
                    class="primary"
                    onclick="approveTravelTicket('${trip.id}')"
                >

                    ✓ Approva biglietto

                </button>


                <!-- RIFIUTA -->

                <button
                    class="danger-button"
                    onclick="rejectTravelTicket('${trip.id}')"
                >

                    ✕ Rifiuta

                </button>


            </div>

        </div>

    `;
}
function adminReportHTML(report) {

    const reasonLabels = {
        spam: "Spam o annuncio falso",
        scam: "Sospetta truffa",
        inappropriate: "Comportamento inappropriato",
        fake_profile: "Profilo falso",
        other: "Altro"
    };

    const reasonLabel =
        reasonLabels[report.reason] || report.reason;

    const date =
        new Date(report.created_at)
            .toLocaleString("it-IT");

    let contextLine = "";

    if (report.trip_id) {
        contextLine = `Relativo al viaggio #${report.trip_id}`;
    } else if (report.request_id) {
        contextLine = `Relativo alla richiesta #${report.request_id}`;
    } else if (report.conversation_id) {
        contextLine = `Relativo alla conversazione #${report.conversation_id}`;
    }

    return `

        <div
            class="profile-card admin-request"
            id="admin-report-${report.id}"
        >

            <div>

                <span class="section-label">
                    ${reasonLabel.toUpperCase()}
                </span>

                <h3>
                    🚩 Segnalazione
                </h3>

                <p>
                    Da:
                    <strong>${escapeHtml(report._reporterName)}</strong>
                </p>

                <p>
                    Contro:
                    <strong>${escapeHtml(report._reportedName)}</strong>
                </p>

                ${
                    contextLine
                        ? `<p>${escapeHtml(contextLine)}</p>`
                        : ""
                }

                ${
                    report.description
                        ? `
                            <p>
                                📝
                                ${escapeHtml(report.description)}
                            </p>
                        `
                        : ""
                }

                <p>
                    Inviata: ${date}
                </p>

            </div>


            <div class="admin-actions">

                <button
                    class="primary"
                    onclick="resolveReport('${report.id}', 'resolved')">

                    ✓ Segna come risolta

                </button>

                <button
                    class="danger-button"
                    onclick="resolveReport('${report.id}', 'dismissed')">

                    ✕ Ignora

                </button>

            </div>

        </div>

    `;

}


async function resolveReport(reportId, newStatus) {

    const { error } =
        await supabaseClient
            .from("reports")
            .update({
                status: newStatus,
                reviewed_at: new Date().toISOString(),
                reviewed_by: currentUser.id
            })
            .eq("id", reportId);

    if (error) {

        console.error(error);

        alert("Errore: " + error.message);

        return;

    }

    const card =
        document.getElementById(`admin-report-${reportId}`);

    if (card) {
        card.remove();
    }

    showToast(
        newStatus === "resolved"
            ? "✓ Segnalazione risolta"
            : "Segnalazione ignorata"
    );

}


function adminUserHTML(user) {

    const date =
        user.created_at
            ? new Date(user.created_at).toLocaleDateString("it-IT")
            : "-";

    const typeLabel =
        user.user_type === "company"
            ? "🚚 Azienda"
            : user.user_type === "traveler"
                ? "✈️ Viaggiatore"
                : "👤 Privato";

    const rating =
        Number(user.rating || 0).toFixed(1);

    return `

        <div class="profile-card admin-request">

            <div>

                <span class="section-label">
                    ISCRITTO IL ${date}
                </span>

                <h3>

                    ${escapeHtml(user.full_name || "Utente senza nome")}

                    ${
                        user.is_verified
                            ? `<span class="verified">✓ Verificato</span>`
                            : ""
                    }

                </h3>

                <p>
                    ${countryFlag(user.country)} ${escapeHtml(countryName(user.country))}
                    &nbsp;·&nbsp;
                    ${typeLabel}
                </p>

                <p>
                    ⭐ ${rating} (${user.reviews_count || 0} recensioni)
                </p>

                <p>
                    <code>${escapeHtml(user.id)}</code>
                </p>

            </div>

        </div>

    `;

}




async function viewTravelTicket(path) {

    if (!path) {

        alert(
            "Questo viaggio non ha un biglietto."
        );

        return;
    }


    const {
        data,
        error
    } = await supabaseClient
        .storage
        .from("travel-tickets")
        .createSignedUrl(
            path,
            300
        );


    if (error) {

        console.error(error);

        alert(
            "Impossibile aprire il biglietto: " +
            error.message
        );

        return;
    }


    window.open(
        data.signedUrl,
        "_blank",
        "noopener,noreferrer"
    );
}
async function approveTicket(ticketId) {

  const confirmed = confirm(
    "✈️ Confermi di aver verificato il biglietto?\n\n" +
    "Il viaggio verrà approvato e sarà considerato verificato."
  );

  if (!confirmed) {
    return;
  }

  if (!currentUser) {
    alert("Devi essere autenticato come amministratore.");
    return;
  }

  try {

    // ==========================================
    // 1. APPROVA IL BIGLIETTO
    // ==========================================

    const { data, error } = await supabaseClient
      .from("trips")
      .update({
        verification_status: "approved"
      })
      .eq("id", ticketId)
      .select()
      .single();

    if (error) {

      console.error(
        "Errore approvazione biglietto:",
        error
      );

      alert(
        "❌ Errore durante l'approvazione:\n\n" +
        error.message
      );

      return;
    }


    // ==========================================
    // 2. CONFERMA
    // ==========================================

    alert(
      "✓ Biglietto approvato!\n\n" +
      "Il viaggio è ora verificato."
    );


    // ==========================================
    // 3. RICARICA PANNELLO ADMIN
    // ==========================================

    await loadAdminTicketPanel();

    // aggiorna anche i viaggi pubblici
    await loadTrips();

  } catch (error) {

    console.error(
      "Errore inatteso approvazione:",
      error
    );

    alert(
      "❌ Si è verificato un errore:\n\n" +
      error.message
    );

  }

}
/* =====================================================
   RIFIUTA BIGLIETTO
===================================================== */

async function rejectTravelTicket(
    tripId
) {

    showRejectTicketPopup(
        tripId
    );

}
/* =====================================================
   CONFERMA RIFIUTO BIGLIETTO
===================================================== */
function showRejectTicketPopup(ticketId) {

  // Rimuove eventuale popup precedente
  const existing =
    document.getElementById("rejectTicketPopup");

  if (existing) {
    existing.remove();
  }


  const popup =
    document.createElement("div");

  popup.id = "rejectTicketPopup";

  popup.innerHTML = `

    <div class="ticket-popup-overlay">

      <div class="ticket-popup">

        <button
          class="ticket-popup-close"
          onclick="closeRejectTicketPopup()">

          ×

        </button>


        <div class="ticket-popup-icon">
          ⚠️
        </div>


        <h2>
          Rifiuta biglietto
        </h2>


        <p>
          Indica il motivo per cui il biglietto
          non può essere approvato.
        </p>


        <textarea
          id="ticketRejectionReason"
          rows="4"
          placeholder="Es. Il biglietto non è leggibile..."
        ></textarea>


        <div
          id="ticketRejectMessage">
        </div>


        <div class="ticket-popup-actions">

          <button
            class="secondary"
            onclick="closeRejectTicketPopup()">

            Annulla

          </button>


          <button
            class="danger-button"
            onclick="confirmRejectTravelTicket('${ticketId}')">

            ✕ Rifiuta biglietto

          </button>

        </div>

      </div>

    </div>

  `;


  document.body.appendChild(popup);

}


function closeRejectTicketPopup() {

  const popup =
    document.getElementById(
      "rejectTicketPopup"
    );

  if (popup) {
    popup.remove();
  }

}
async function confirmRejectTravelTicket(ticketId) {

  const reasonElement =
    document.getElementById(
      "ticketRejectionReason"
    );

  const message =
    document.getElementById(
      "ticketRejectMessage"
    );


  const reason =
    reasonElement
      ? reasonElement.value.trim()
      : "";


  if (!reason) {

    message.innerHTML = `
      <div class="auth-error">
        Inserisci il motivo del rifiuto.
      </div>
    `;

    return;

  }


  message.innerHTML = `
    <div class="auth-success">
      Rifiuto del biglietto in corso...
    </div>
  `;


  try {

    const {
      error
    } = await supabaseClient
      .from("trips")
      .update({

        verification_status:
          "rejected",

        rejection_reason:
          reason

      })
      .eq(
        "id",
        ticketId
      );


    if (error) {

      console.error(
        "Errore rifiuto biglietto:",
        error
      );

      message.innerHTML = `
        <div class="auth-error">
          Errore:
          ${escapeHtml(error.message)}
        </div>
      `;

      return;

    }


    closeRejectTicketPopup();


    alert(
      "✓ Biglietto rifiutato."
    );


    await loadAdminTicketPanel();

    await loadTrips();


  } catch (error) {

    console.error(error);

    message.innerHTML = `
      <div class="auth-error">
        Errore imprevisto:
        ${escapeHtml(error.message)}
      </div>
    `;

  }

}
function adminRequestHTML(
  request
) {

  const type =
    request.document_type ===
    "passport"

      ? t("passport")

      : t("identityCard");


  const date =
    new Date(
      request.created_at
    )
    .toLocaleString(
      currentLanguage === "fr"
        ? "fr-FR"
        : currentLanguage === "tn"
          ? "ar-TN"
          : "it-IT"
    );


  return `

    <div
      class="profile-card admin-request"
      id="request-${request.id}"
    >


      <div>

        <span class="section-label">
          ${t("pendingRequests")}
        </span>


        <h3>
          ${type}
        </h3>


        <p>

          ${t("user")}:

          <br>

          <code>
            ${escapeHtml(
              request.user_id
            )}
          </code>

        </p>


        <p>
          ${t("sent")}: ${date}
        </p>


      </div>


      <div class="admin-actions">


        <button
          class="secondary"
          onclick="viewVerificationDocument('${request.document_path}')">

          ${t("viewDocument")}

        </button>


        <button
          class="primary"
          onclick="approveVerification('${request.id}', '${request.user_id}')">

          ${t("approve")}

        </button>


        <button
          class="danger-button"
          onclick="rejectVerification('${request.id}')">

          ${t("reject")}

        </button>


      </div>


    </div>

  `;

}


async function viewVerificationDocument(
  path
) {

  const {
    data,
    error
  } =
    await supabaseClient
      .storage
      .from(
        "verification-documents"
      )
      .createSignedUrl(
        path,
        300
      );


  if (error) {

    alert(
      error.message
    );

    return;

  }


  window.open(
    data.signedUrl,
    "_blank",
    "noopener,noreferrer"
  );

}


/* =====================================================
   APPROVE VERIFICATION
===================================================== */

async function approveVerification(
  requestId,
  userId
) {

  if (
    !confirm(
      currentLanguage === "it"
        ? "Confermi di aver verificato il documento?"
        : currentLanguage === "fr"
          ? "Confirmez-vous avoir vérifié le document ?"
          : "متأكد اللي تحب توافق على الوثيقة؟"
    )
  ) {

    return;

  }


  const {
    error: requestError
  } =
    await supabaseClient
      .from(
        "verification_requests"
      )
      .update({

        status:
          "approved",

        reviewed_at:
          new Date().toISOString(),

        reviewed_by:
          currentUser.id

      })
      .eq(
        "id",
        requestId
      );


  if (requestError) {

    alert(
      requestError.message
    );

    return;

  }


  const {
    error: profileError
  } =
    await supabaseClient
      .from("profiles")
      .update({

        is_verified:
          true

      })
      .eq(
        "id",
        userId
      );


  if (profileError) {

    alert(
      profileError.message
    );

    return;

  }


  alert(
    currentLanguage === "it"
      ? "✓ Utente verificato."
      : currentLanguage === "fr"
        ? "✓ Utilisateur vérifié."
        : "✓ المستعمل ولى موثوق."
  );


  loadAdminPanel();

}


/* =====================================================
   REJECT VERIFICATION
===================================================== */

async function rejectVerification(
  requestId
) {

  const reason =
    prompt(
      currentLanguage === "it"
        ? "Perché stai rifiutando il documento?"
        : currentLanguage === "fr"
          ? "Pourquoi refusez-vous le document ?"
          : "علاش تحب ترفض الوثيقة؟"
    );


  if (!reason) {
    return;
  }


  const {
    error
  } =
    await supabaseClient
      .from(
        "verification_requests"
      )
      .update({

        status:
          "rejected",

        rejection_reason:
          reason,

        reviewed_at:
          new Date().toISOString(),

        reviewed_by:
          currentUser.id

      })
      .eq(
        "id",
        requestId
      );


  if (error) {

    alert(
      error.message
    );

    return;

  }


  alert(
    currentLanguage === "it"
      ? "Richiesta rifiutata."
      : currentLanguage === "fr"
        ? "Demande refusée."
        : "الطلب ترفض."
  );


  loadAdminPanel();

}


/* =====================================================
   CLOSE ADMIN
===================================================== */

function closeAdminPanel() {

  const page =
    document.getElementById(
      "adminPage"
    );

  if (page) {

    page.remove();

  }


  document.body.style.overflow =
    "";

}


/* =====================================================
   ADMIN BUTTON
===================================================== */

async function updateAdminButton() {

  if (!currentUser) {

    removeAdminButton();

    return;

  }


  try {

    const {
      data,
      error
    } =
      await supabaseClient.rpc(
        "is_admin"
      );


    if (error) {

      console.error(
        "Errore controllo admin:",
        error
      );

      removeAdminButton();

      return;

    }


    if (data === true) {

      showAdminButton();

    } else {

      removeAdminButton();

    }


  } catch (error) {

    console.error(
      error
    );

    removeAdminButton();

  }

}


function showAdminButton() {

  let button =
    document.getElementById(
      "adminHeaderButton"
    );


  if (button) {

    return;

  }


  button =
    document.createElement(
      "button"
    );


  button.id =
    "adminHeaderButton";


  button.type =
    "button";


  button.className =
    "admin-header-button";


  button.innerHTML =
    t("admin");


  button.onclick =
    openAdminPanel;


  const nav =
    document.getElementById(
      "mainNav"
    );


  if (nav) {

    nav.appendChild(
      button
    );

  }

}


function removeAdminButton() {

  const button =
    document.getElementById(
      "adminHeaderButton"
    );


  if (button) {

    button.remove();

  }}
/* =====================================================
   POPUP SISTEMA
===================================================== */

function showPopup({
    title = "",
    message = "",
    type = "info",
    confirmText = "OK",
    cancelText = null,
    onConfirm = null
}) {

    const old =
        document.getElementById("systemPopup");

    if (old) {
        old.remove();
    }


    const popup =
        document.createElement("div");

    popup.id =
        "systemPopup";


    let icon = "ℹ️";

    if (type === "success") {
        icon = "✓";
    }

    if (type === "error") {
        icon = "⚠️";
    }

    if (type === "warning") {
        icon = "⚠️";
    }


    popup.innerHTML = `

        <div class="popup-overlay">

            <div class="popup-box ${type}">

                <button
                    class="popup-close"
                    onclick="closeSystemPopup()">

                    ×

                </button>


                <div class="popup-icon">
                    ${icon}
                </div>


                <h3>
                    ${escapeHtml(title)}
                </h3>


                <p>
                    ${message}
                </p>


                <div class="popup-buttons">

                    ${
                        cancelText
                        ? `
                            <button
                                class="secondary"
                                onclick="closeSystemPopup()">

                                ${escapeHtml(cancelText)}

                            </button>
                        `
                        : ""
                    }


                    <button
                        class="primary"
                        id="popupConfirmButton">

                        ${escapeHtml(confirmText)}

                    </button>

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(popup);


    const confirmButton =
        document.getElementById(
            "popupConfirmButton"
        );


    confirmButton.onclick =
        async () => {

            if (onConfirm) {

                confirmButton.disabled =
                    true;

                confirmButton.textContent =
                    "Attendi...";

                await onConfirm();

            }

        };


    // Chiudi cliccando fuori

    popup
        .querySelector(".popup-overlay")
        .addEventListener(
            "click",
            event => {

                if (
                    event.target.classList
                        .contains("popup-overlay")
                ) {

                    closeSystemPopup();

                }

            }
        );
}


function closeSystemPopup() {

    const popup =
        document.getElementById(
            "systemPopup"
        );

    if (popup) {
        popup.remove();
    }

}
   /* =====================================================
   POPUP RIFIUTO BIGLIETTO
===================================================== */

function showRejectTicketPopup(
    tripId
) {

    const old =
        document.getElementById(
            "systemPopup"
        );

    if (old) {
        old.remove();
    }


    const popup =
        document.createElement("div");

    popup.id =
        "systemPopup";


    popup.innerHTML = `

        <div class="popup-overlay">

            <div class="popup-box warning">

                <button
                    class="popup-close"
                    onclick="closeSystemPopup()">

                    ×

                </button>


                <div class="popup-icon">
                    ⚠️
                </div>


                <h3>
                    Rifiuta biglietto
                </h3>


                <p>
                    Indica all'utente perché
                    il biglietto non può essere approvato.
                </p>


                <textarea
                    id="rejectTicketReason"
                    class="popup-textarea"
                    rows="5"
                    placeholder="Es. Il biglietto non è leggibile..."
                ></textarea>


                <div class="popup-buttons">

                    <button
                        class="secondary"
                        onclick="closeSystemPopup()">

                        Annulla

                    </button>


                    <button
                        class="danger-button"
                        id="confirmRejectTicket">

                        ✕ Rifiuta biglietto

                    </button>

                </div>

            </div>

        </div>

    `;


    document.body.appendChild(popup);


    document
        .getElementById(
            "confirmRejectTicket"
        )
        .onclick =
        () => {

            rejectTravelTicketConfirmed(
                tripId
            );

        };

}

// =====================================================
// ADMIN - VERIFICA BIGLIETTI VIAGGIO
// =====================================================

window.approveTravelTicket = async function(ticketId) {

  if (!currentUser) {
    alert("Devi essere autenticato.");
    return;
  }

  const conferma = confirm(
    "✈️ Approva biglietto\n\n" +
    "Confermi che il biglietto è valido?"
  );

  if (!conferma) {
    return;
  }

  try {

    const { error } = await supabaseClient
      .from("trips")
      .update({
        verification_status: "approved",
        rejection_reason: null
      })
      .eq("id", ticketId);

    if (error) {

      console.error(
        "Errore approvazione biglietto:",
        error
      );

      alert(
        "❌ Errore approvazione:\n\n" +
        error.message
      );

      return;
    }

    alert(
      "✓ Biglietto approvato!\n\n" +
      "Il viaggio è stato verificato."
    );

    if (
      typeof loadAdminTicketPanel === "function"
    ) {
      await loadAdminTicketPanel();
    }

    if (
      typeof loadTrips === "function"
    ) {
      await loadTrips();
    }

  } catch (error) {

    console.error(error);

    alert(
      "❌ Errore:\n\n" +
      error.message
    );

  }

};
window.rejectTravelTicket = function(ticketId) {

  if (
    typeof showRejectTicketPopup === "function"
  ) {
    showRejectTicketPopup(ticketId);
  } else {

    alert(
      "Errore: popup rifiuto biglietto non disponibile."
    );

  }

};
/*============================*/

async function updateUnreadCount() {

  const { data, error } = await supabaseClient
    .from("messages")
    .select("*")
    .is("read_at", null)
    .neq("sender_id", currentUser.id);

  const target = document.getElementById("unreadCount");

  if (error || !data) {
    console.warn("Errore unreadCount:", error);
    if (target) target.textContent = "";
    return;
  }

  const count = data.length;

  if (target) {
    target.textContent = count > 0 ? `(${count})` : "";
  }

  refreshMessagesBadge(count);
}
async function markMessagesAsRead(conversationId) {
  const { error } = await supabaseClient
    .from("messages")
    .update({
      read_at: new Date().toISOString()
    })
    .eq("conversation_id", conversationId)
    .neq("sender_id", currentUser.id)
    .is("read_at", null);

  if (error) {
    console.error("Errore nel segnare i messaggi come letti:", error);
  }
}
/*======================*/

/* =====================================================
   FORM RECENSIONE
===================================================== */

let selectedRating = 0;

async function openReviewForm(conversationId) {

  if (!currentUser) {
    openAuth("login");
    return;
  }

  const { data: conv, error } =
    await supabaseClient
      .from("conversations")
      .select("*")
      .eq("id", conversationId)
      .single();

  if (error) {
    alert("Errore: " + error.message);
    return;
  }

  const otherUserId =
    conv.participant_1 === currentUser.id
      ? conv.participant_2
      : conv.participant_1;

  const otherUserName = await getUserName(otherUserId);

  selectedRating = 0;

  const old = document.getElementById("reviewModal");
  if (old) old.remove();

  const modal = document.createElement("div");
  modal.id = "reviewModal";

  modal.innerHTML = `

    <div class="auth-overlay">

      <div class="auth-box review-box">

        <button
          class="auth-close"
          onclick="closeReviewForm()">

          ×

        </button>


        <h2>
          ⭐ ${t("step4Title")} ${escapeHtml(otherUserName)}
        </h2>


        <p>
          ${t("howWasIt")}
        </p>


        <div id="starRating" class="star-rating">

          <span class="star" data-value="1">★</span>
          <span class="star" data-value="2">★</span>
          <span class="star" data-value="3">★</span>
          <span class="star" data-value="4">★</span>
          <span class="star" data-value="5">★</span>

        </div>


        <textarea
          id="reviewComment"
          rows="4"
          placeholder="${t("optionalComment")}"
        ></textarea>


        <div id="reviewMessage"></div>


        <button
          class="primary auth-button"
          onclick="submitReview('${conversationId}', '${otherUserId}')">

          ${t("sendReview")}

        </button>

      </div>

    </div>

  `;

  document.body.appendChild(modal);

  setupStarRating();

}


function closeReviewForm() {

  const modal = document.getElementById("reviewModal");
  if (modal) modal.remove();

}


function setupStarRating() {

  const stars = document.querySelectorAll("#starRating .star");

  stars.forEach(star => {

    star.addEventListener("click", () => {

      selectedRating = parseInt(star.dataset.value);
      highlightStars(selectedRating);

    });

    star.addEventListener("mouseenter", () => {
      highlightStars(parseInt(star.dataset.value));
    });

  });

  const container = document.getElementById("starRating");

  container.addEventListener("mouseleave", () => {
    highlightStars(selectedRating);
  });

}


function highlightStars(count) {

  const stars = document.querySelectorAll("#starRating .star");

  stars.forEach(star => {

    const value = parseInt(star.dataset.value);

    star.classList.toggle("filled", value <= count);

  });

}


async function submitReview(conversationId, otherUserId) {

  const message = document.getElementById("reviewMessage");

  if (!selectedRating || selectedRating < 1) {

    message.innerHTML = `
      <div class="auth-error">
        ${t("selectAtLeastOneStar")}
      </div>
    `;

    return;

  }

  const comment =
    document.getElementById("reviewComment").value.trim();

  message.innerHTML = `
    <div class="auth-success">
      ${t("sendingInProgress")}
    </div>
  `;

  const { error } =
    await supabaseClient
      .from("reviews")
      .insert([
        {
          conversation_id: conversationId,
          reviewer_id: currentUser.id,
          reviewed_user_id: otherUserId,
          rating: selectedRating,
          comment: comment || null
        }
      ]);

  if (error) {

    // Codice 23505 = violazione vincolo UNIQUE (già recensito)
    if (error.code === "23505") {

      message.innerHTML = `
        <div class="auth-error">
          ${t("alreadyReviewedConversation")}
        </div>
      `;

    } else {

      message.innerHTML = `
        <div class="auth-error">
          ${escapeHtml(error.message)}
        </div>
      `;

    }

    return;

  }

  message.innerHTML = `
    <div class="auth-success">
      ${t("reviewSentThanks")}
    </div>
  `;

  setTimeout(() => {

    closeReviewForm();

    refreshChatActionButtons(conversationId);

  }, 1000);

}
async function hasAlreadyReviewed(conversationId) {

  const { data, error } =
    await supabaseClient
      .from("reviews")
      .select("id")
      .eq("conversation_id", conversationId)
      .eq("reviewer_id", currentUser.id)
      .maybeSingle();

  if (error) {
    console.error(error);
    return false;
  }

  return !!data;

}


/* =====================================================
   CAROSELLI CONTENUTI
   (Come funziona / Viaggi / Richieste)
===================================================== */

function initContentCarousels() {

  document
    .querySelectorAll(".hm-carousel")
    .forEach(setupContentCarousel);

}


function setupContentCarousel(carousel) {

  const track =
    carousel.querySelector(".hm-track");

  if (!track) return;

  const prev =
    carousel.querySelector(".hm-prev");

  const next =
    carousel.querySelector(".hm-next");


  const stepSize = () => {

    const first =
      track.firstElementChild;

    const gap =
      parseFloat(
        getComputedStyle(track).columnGap
      ) || 20;

    return first
      ? first.getBoundingClientRect().width + gap
      : track.clientWidth * 0.8;

  };


  const update = () =>
    updateCarouselArrows(track, prev, next);


  if (prev) {
    prev.addEventListener("click", () => {
      scrollCarouselTrack(track, -1, stepSize());
    });
  }

  if (next) {
    next.addEventListener("click", () => {
      scrollCarouselTrack(track, 1, stepSize());
    });
  }


  track.addEventListener(
    "scroll",
    update,
    { passive: true }
  );

  window.addEventListener("resize", update);

  // Le card di viaggi e richieste arrivano da Supabase:
  // aggiorniamo le frecce quando il contenuto cambia.
  new MutationObserver(update)
    .observe(track, { childList: true });

  update();

}


function scrollCarouselTrack(track, direction, amount) {

  const rtl =
    document.documentElement.dir === "rtl";

  track.scrollBy({
    left: amount * direction * (rtl ? -1 : 1),
    behavior: "smooth"
  });

}


function updateCarouselArrows(track, prev, next) {

  const position =
    Math.abs(track.scrollLeft);

  const max =
    track.scrollWidth - track.clientWidth;

  const scrollable = max > 4;

  if (prev) {
    prev.disabled =
      !scrollable || position <= 2;
  }

  if (next) {
    next.disabled =
      !scrollable || position >= max - 2;
  }

}



/* =====================================================
   CAROSELLI A SLIDE (sponsor + copertina)
   Testi tradotti tramite data-i18n, supporto RTL, swipe e autoplay.
===================================================== */

const slideCarousels = [];


function createSlideCarousel(rootId, intervalMs = 6500) {

  const root = document.getElementById(rootId);

  if (!root) return null;

  const track = root.querySelector(".sp-track");
  const dots  = root.querySelector(".sp-dots");

  if (!track || !dots) return null;

  const state = {
    index: 0,
    count: track.children.length,
    timer: null,
    startX: null
  };

  dots.innerHTML = "";

  for (let i = 0; i < state.count; i++) {

    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "sp-dot";
    dot.setAttribute("aria-label", String(i + 1));
    dot.onclick = () => { go(i); restart(); };
    dots.appendChild(dot);

  }

  function refresh() {

    const rtl = document.documentElement.dir === "rtl";

    track.style.transform =
      `translateX(${(rtl ? 1 : -1) * state.index * 100}%)`;

    dots.querySelectorAll(".sp-dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === state.index);
    });

    Array.from(track.children).forEach((slide, i) => {
      slide.setAttribute("aria-hidden", i === state.index ? "false" : "true");
      slide.toggleAttribute("inert", i !== state.index);
    });

    const lang = translations[currentLanguage] || translations.it;
    const prev = root.querySelector(".sp-prev");
    const next = root.querySelector(".sp-next");

    if (prev && lang.spPrev) prev.setAttribute("aria-label", lang.spPrev);
    if (next && lang.spNext) next.setAttribute("aria-label", lang.spNext);

  }

  function go(i) {
    state.index = (i + state.count) % state.count;
    refresh();
  }

  function stop() {
    if (state.timer) {
      clearInterval(state.timer);
      state.timer = null;
    }
  }

  function start() {

    stop();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    state.timer = setInterval(() => go(state.index + 1), intervalMs);

  }

  function restart() { start(); }

  root.querySelector(".sp-prev").onclick = () => { go(state.index - 1); restart(); };
  root.querySelector(".sp-next").onclick = () => { go(state.index + 1); restart(); };

  root.addEventListener("touchstart", e => {
    state.startX = e.touches[0].clientX;
  }, { passive: true });

  root.addEventListener("touchend", e => {

    if (state.startX === null) return;

    const delta = e.changedTouches[0].clientX - state.startX;

    state.startX = null;

    if (Math.abs(delta) < 40) return;

    const rtl = document.documentElement.dir === "rtl";
    const forward = rtl ? delta > 0 : delta < 0;

    go(state.index + (forward ? 1 : -1));
    restart();

  }, { passive: true });

  root.addEventListener("mouseenter", stop);
  root.addEventListener("mouseleave", start);
  root.addEventListener("focusin", stop);
  root.addEventListener("focusout", start);

  refresh();
  start();

  return { refresh, go, stop, start };

}


function initSponsorCarousel() {

  slideCarousels.length = 0;

  ["spCarousel", "cvCarousel"].forEach(id => {

    const carousel = createSlideCarousel(id);

    if (carousel) slideCarousels.push(carousel);

  });

}


function refreshSponsorCarousel() {

  slideCarousels.forEach(carousel => carousel.refresh());

}


/* =====================================================
   ANNUNCI DI ESEMPIO (mostrati solo se non ci sono dati reali)
===================================================== */

function currentLocaleCode() {
  return currentLanguage === "fr" ? "fr-FR"
       : currentLanguage === "tn" ? "ar-TN"
       : currentLanguage === "en" ? "en-GB"
       : "it-IT";
}

function sampleDate(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toLocaleDateString(currentLocaleCode());
}

function toggleSampleNotice(id, show) {
  const el = document.getElementById(id);
  if (el) el.hidden = !show;
}

const SAMPLE_TRIPS = [
  { from: "italy",   fromCity: "Milano", to: "tunisia", toCity: "Tunisi",   days: 9,  kg: 8,  price: 12 },
  { from: "france",  fromCity: "Parigi", to: "tunisia", toCity: "Sfax",     days: 16, kg: 5,  price: 15 },
  { from: "tunisia", fromCity: "Tunisi", to: "italy",   toCity: "Roma",     days: 23, kg: 10, price: 10 },
  { from: "germany", fromCity: "Berlino", to: "tunisia", toCity: "Monastir", days: 31, kg: 7,  price: 14 }
];

const SAMPLE_REQUESTS = [
  { from: "italy",   fromCity: "Torino", to: "tunisia", toCity: "Sousse", days: 12, item: "sampleItem1" },
  { from: "tunisia", fromCity: "Tunisi", to: "italy",   toCity: "Bologna", days: 20, item: "sampleItem2" },
  { from: "france",  fromCity: "Lione",  to: "tunisia", toCity: "Tunisi", days: 28, item: "sampleItem3" }
];

function sampleTripCard(s) {
  return `
    <article class="card trip-card sample-card">
      <span class="sample-badge">${t("sampleBadge")}</span>
      ${avatarHtml(null, 44)}
      <h3>${t("sampleTraveler")}</h3>
      <p>${countryFlag(s.from)} ${cityName(s.fromCity)} → ${countryFlag(s.to)} ${cityName(s.toCity)}</p>
      <p>📅 ${sampleDate(s.days)}</p>
      <p>📦 ${s.kg} ${t("kg")}</p>
      <strong>€${s.price}/${t("kg")}</strong>
      <div class="card-actions-row">
        <button type="button" class="primary" data-action="publish-trip">${t("ctaButton")}</button>
      </div>
    </article>
  `;
}

function sampleRequestCard(s) {
  return `
    <article class="card request-card sample-card">
      <span class="sample-badge">${t("sampleBadge")}</span>
      ${avatarHtml(null, 44)}
      <h3>${t("sampleRequester")}</h3>
      <p>${countryFlag(s.from)} ${cityName(s.fromCity)} → ${countryFlag(s.to)} ${cityName(s.toCity)}</p>
      <p>📅 ${sampleDate(s.days)}</p>
      <p>📦 ${t(s.item)}</p>
      <div class="card-actions-row">
        <button type="button" class="primary" data-action="publish-request">${t("publishRequest")}</button>
      </div>
    </article>
  `;
}

function renderSampleTrips(container) {
  container.innerHTML = SAMPLE_TRIPS.map(sampleTripCard).join("");
  toggleSampleNotice("tripsNotice", true);
  setupActions();
}

function renderSampleRequests(container) {
  container.innerHTML = SAMPLE_REQUESTS.map(sampleRequestCard).join("");
  toggleSampleNotice("requestsNotice", true);
  setupActions();
}


/* =====================================================
   SEGUI UNA DESTINAZIONE
===================================================== */

let followedCountries = new Set();

async function loadFollowedCountries() {

  if (!currentUser) {
    followedCountries = new Set();
    return true;
  }

  const { data, error } =
    await supabaseClient
      .from("destination_follows")
      .select("country")
      .eq("user_id", currentUser.id);

  if (error) {
    console.warn("Destinazioni seguite:", error);
    return false;
  }

  followedCountries =
    new Set((data || []).map(row => row.country));

  return true;

}


async function openFollowModal() {

  if (!currentUser) {
    openAuth("login");
    return;
  }

  closeFollowModal();

  const overlay = document.createElement("div");
  overlay.id = "followModal";
  overlay.className = "follow-overlay";

  overlay.innerHTML = `
    <div class="follow-box" role="dialog" aria-modal="true">

      <button type="button" class="follow-close" aria-label="${t("followClose")}">×</button>

      <h3>🔔 ${t("followTitle")}</h3>

      <p class="follow-intro">${t("followIntro")}</p>

      <div id="followGrid" class="follow-grid">
        <div class="loading">${t("loading")}</div>
      </div>

      <p id="followMsg" class="follow-msg"></p>

    </div>
  `;

  overlay.addEventListener("click", e => {
    if (e.target === overlay) closeFollowModal();
  });

  overlay.querySelector(".follow-close").onclick = closeFollowModal;

  document.body.appendChild(overlay);

  document.addEventListener("keydown", followEscHandler);

  const ok = await loadFollowedCountries();

  if (!ok) {
    document.getElementById("followGrid").innerHTML = "";
    document.getElementById("followMsg").textContent = t("followError");
    return;
  }

  renderFollowGrid();

}


function followEscHandler(e) {
  if (e.key === "Escape") closeFollowModal();
}


function closeFollowModal() {

  const modal = document.getElementById("followModal");

  if (modal) modal.remove();

  document.removeEventListener("keydown", followEscHandler);

}


function renderFollowGrid() {

  const grid = document.getElementById("followGrid");

  if (!grid) return;

  grid.innerHTML = COUNTRIES.map(c => {

    const on = followedCountries.has(c.code);

    return `
      <button type="button" class="follow-chip ${on ? "on" : ""}" data-country="${c.code}" aria-pressed="${on}">
        <span class="follow-flag">${c.flag}</span>
        <b>${c.names[currentLanguage] || c.names.it}</b>
        <i>${on ? "✓ " + t("followOn") : t("followOff")}</i>
      </button>
    `;

  }).join("");

  grid.querySelectorAll(".follow-chip").forEach(button => {
    button.onclick = () => toggleFollow(button.dataset.country);
  });

}


async function toggleFollow(code) {

  const msg = document.getElementById("followMsg");

  if (msg) msg.textContent = "";

  const alreadyFollowing = followedCountries.has(code);

  let error;

  if (alreadyFollowing) {

    ({ error } = await supabaseClient
      .from("destination_follows")
      .delete()
      .eq("user_id", currentUser.id)
      .eq("country", code));

  } else {

    ({ error } = await supabaseClient
      .from("destination_follows")
      .insert({ user_id: currentUser.id, country: code }));

  }

  if (error) {
    console.warn("Segui destinazione:", error);
    if (msg) msg.textContent = t("followError");
    return;
  }

  if (alreadyFollowing) {
    followedCountries.delete(code);
  } else {
    followedCountries.add(code);
  }

  renderFollowGrid();

}


/* =====================================================
   TORNA SU
===================================================== */

function initBackToTop() {

  const button = document.getElementById("toTop");

  if (!button) return;

  const update = () => {
    button.classList.toggle("visible", window.scrollY > 700);
  };

  window.addEventListener("scroll", update, { passive: true });

  button.onclick = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  update();

}



/* =====================================================
   NOMI DELLE CITTÀ TRADOTTI
   Formato: [italiano, inglese, francese, arabo tunisino, ...alias]
   Le città non presenti nell'elenco restano come scritte dall'utente.
===================================================== */

const CITY_LANGS = ["it", "en", "fr", "tn"];

const CITY_DATA = [

  // ---- Tunisia ----
  ["Tunisi", "Tunis", "Tunis", "تونس", "Tunes"],
  ["Sfax", "Sfax", "Sfax", "صفاقس"],
  ["Sousse", "Sousse", "Sousse", "سوسة", "Susa"],
  ["Monastir", "Monastir", "Monastir", "المنستير"],
  ["Nabeul", "Nabeul", "Nabeul", "نابل"],
  ["Hammamet", "Hammamet", "Hammamet", "الحمامات"],
  ["Biserta", "Bizerte", "Bizerte", "بنزرت", "Bizerta"],
  ["Kairouan", "Kairouan", "Kairouan", "القيروان", "Qayrawan"],
  ["Gabes", "Gabes", "Gabès", "قابس"],
  ["Gafsa", "Gafsa", "Gafsa", "قفصة"],
  ["Gerba", "Djerba", "Djerba", "جربة", "Jerba"],
  ["Mahdia", "Mahdia", "Mahdia", "المهدية"],
  ["Tozeur", "Tozeur", "Tozeur", "توزر"],
  ["Kasserine", "Kasserine", "Kasserine", "القصرين"],
  ["Beja", "Beja", "Béja", "باجة"],
  ["Jendouba", "Jendouba", "Jendouba", "جندوبة"],
  ["El Kef", "El Kef", "Le Kef", "الكاف", "Kef"],
  ["Siliana", "Siliana", "Siliana", "سليانة"],
  ["Zaghouan", "Zaghouan", "Zaghouan", "زغوان"],
  ["Ariana", "Ariana", "Ariana", "أريانة"],
  ["Ben Arous", "Ben Arous", "Ben Arous", "بن عروس"],
  ["La Manouba", "Manouba", "La Manouba", "منوبة", "Manouba"],
  ["Medenine", "Medenine", "Médenine", "مدنين"],
  ["Tataouine", "Tataouine", "Tataouine", "تطاوين"],
  ["Kebili", "Kebili", "Kébili", "قبلي"],
  ["Sidi Bouzid", "Sidi Bouzid", "Sidi Bouzid", "سيدي بوزيد"],
  ["Hammam Sousse", "Hammam Sousse", "Hammam Sousse", "حمام سوسة"],
  ["Kelibia", "Kelibia", "Kélibia", "قليبية"],
  ["Zarzis", "Zarzis", "Zarzis", "جرجيس", "Jarjis"],

  // ---- Italia ----
  ["Milano", "Milan", "Milan", "ميلانو"],
  ["Roma", "Rome", "Rome", "روما"],
  ["Torino", "Turin", "Turin", "تورينو"],
  ["Napoli", "Naples", "Naples", "نابولي"],
  ["Bologna", "Bologna", "Bologne", "بولونيا"],
  ["Firenze", "Florence", "Florence", "فلورنسا"],
  ["Venezia", "Venice", "Venise", "البندقية"],
  ["Genova", "Genoa", "Gênes", "جنوة"],
  ["Palermo", "Palermo", "Palerme", "باليرمو"],
  ["Bari", "Bari", "Bari", "باري"],
  ["Verona", "Verona", "Vérone", "فيرونا"],
  ["Padova", "Padua", "Padoue", "بادوفا"],
  ["Brescia", "Brescia", "Brescia", "بريشيا"],
  ["Bergamo", "Bergamo", "Bergame", "برغامو"],
  ["Modena", "Modena", "Modène", "مودينا"],
  ["Parma", "Parma", "Parme", "بارما"],
  ["Trieste", "Trieste", "Trieste", "تريستي"],
  ["Perugia", "Perugia", "Pérouse", "بيروجيا"],
  ["Cagliari", "Cagliari", "Cagliari", "كالياري"],
  ["Catania", "Catania", "Catane", "كاتانيا"],
  ["Pisa", "Pisa", "Pise", "بيزا"],
  ["Rimini", "Rimini", "Rimini", "ريميني"],
  ["Ravenna", "Ravenna", "Ravenne", "رافينا"],
  ["Reggio Emilia", "Reggio Emilia", "Reggio d'Émilie", "ريدجو إميليا"],
  ["Ancona", "Ancona", "Ancône", "أنكونا"],
  ["Pescara", "Pescara", "Pescara", "بيسكارا"],
  ["Trento", "Trento", "Trente", "ترينتو"],
  ["Ferrara", "Ferrara", "Ferrare", "فيرارا"],
  ["Mantova", "Mantua", "Mantoue", "مانتوفا"],
  ["Vicenza", "Vicenza", "Vicence", "فيتشينزا"],
  ["Treviso", "Treviso", "Trévise", "تريفيزو"],
  ["Como", "Como", "Côme", "كومو"],
  ["Monza", "Monza", "Monza", "مونزا"],
  ["Piacenza", "Piacenza", "Plaisance", "بياتشينزا"],
  ["Salerno", "Salerno", "Salerne", "ساليرنو"],
  ["Messina", "Messina", "Messine", "ميسينا"],
  ["Lecce", "Lecce", "Lecce", "ليتشي"],
  ["Udine", "Udine", "Udine", "أوديني"],

  // ---- Francia ----
  ["Parigi", "Paris", "Paris", "باريس"],
  ["Marsiglia", "Marseille", "Marseille", "مرسيليا"],
  ["Lione", "Lyon", "Lyon", "ليون"],
  ["Nizza", "Nice", "Nice", "نيس"],
  ["Tolosa", "Toulouse", "Toulouse", "تولوز"],
  ["Bordeaux", "Bordeaux", "Bordeaux", "بوردو"],
  ["Lilla", "Lille", "Lille", "ليل"],
  ["Strasburgo", "Strasbourg", "Strasbourg", "ستراسبورغ"],
  ["Nantes", "Nantes", "Nantes", "نانت"],
  ["Montpellier", "Montpellier", "Montpellier", "مونبلييه"],
  ["Grenoble", "Grenoble", "Grenoble", "غرونوبل"],
  ["Rennes", "Rennes", "Rennes", "رين"],
  ["Avignone", "Avignon", "Avignon", "أفينيون"],
  ["Digione", "Dijon", "Dijon", "ديجون"],
  ["Nimes", "Nîmes", "Nîmes", "نيم"],
  ["Saint-Etienne", "Saint-Étienne", "Saint-Étienne", "سان إتيان"],

  // ---- Germania ----
  ["Berlino", "Berlin", "Berlin", "برلين"],
  ["Monaco di Baviera", "Munich", "Munich", "ميونخ", "Munchen"],
  ["Francoforte", "Frankfurt", "Francfort", "فرانكفورت"],
  ["Amburgo", "Hamburg", "Hambourg", "هامبورغ"],
  ["Colonia", "Cologne", "Cologne", "كولونيا"],
  ["Stoccarda", "Stuttgart", "Stuttgart", "شتوتغارت"],
  ["Dusseldorf", "Düsseldorf", "Düsseldorf", "دوسلدورف"],
  ["Dortmund", "Dortmund", "Dortmund", "دورتموند"],
  ["Norimberga", "Nuremberg", "Nuremberg", "نورمبرغ"],
  ["Hannover", "Hanover", "Hanovre", "هانوفر"],
  ["Lipsia", "Leipzig", "Leipzig", "لايبزيغ"],
  ["Brema", "Bremen", "Brême", "بريمن"],

  // ---- Belgio ----
  ["Bruxelles", "Brussels", "Bruxelles", "بروكسل"],
  ["Anversa", "Antwerp", "Anvers", "أنتويرب"],
  ["Liegi", "Liège", "Liège", "لياج"],
  ["Gand", "Ghent", "Gand", "غنت"],
  ["Charleroi", "Charleroi", "Charleroi", "شارلروا"],

  // ---- Paesi Bassi ----
  ["Amsterdam", "Amsterdam", "Amsterdam", "أمستردام"],
  ["Rotterdam", "Rotterdam", "Rotterdam", "روتردام"],
  ["L'Aia", "The Hague", "La Haye", "لاهاي"],
  ["Utrecht", "Utrecht", "Utrecht", "أوتريخت"],

  // ---- Svizzera ----
  ["Zurigo", "Zurich", "Zurich", "زيورخ"],
  ["Ginevra", "Geneva", "Genève", "جنيف"],
  ["Berna", "Bern", "Berne", "برن"],
  ["Basilea", "Basel", "Bâle", "بازل"],
  ["Losanna", "Lausanne", "Lausanne", "لوزان"],
  ["Lugano", "Lugano", "Lugano", "لوغانو"],

  // ---- Spagna ----
  ["Madrid", "Madrid", "Madrid", "مدريد"],
  ["Barcellona", "Barcelona", "Barcelone", "برشلونة"],
  ["Valencia", "Valencia", "Valence", "فالنسيا"],
  ["Siviglia", "Seville", "Séville", "إشبيلية"],
  ["Malaga", "Malaga", "Malaga", "مالقة"],

  // ---- Austria ----
  ["Vienna", "Vienna", "Vienne", "فيينا"],
  ["Salisburgo", "Salzburg", "Salzbourg", "سالزبورغ"],
  ["Innsbruck", "Innsbruck", "Innsbruck", "إنسبروك"],
  ["Graz", "Graz", "Graz", "غراتس"],

  // ---- Svezia ----
  ["Stoccolma", "Stockholm", "Stockholm", "ستوكهولم"],
  ["Goteborg", "Gothenburg", "Göteborg", "غوتنبرغ"],
  ["Malmo", "Malmö", "Malmö", "مالمو"],

  // ---- Regno Unito ----
  ["Londra", "London", "Londres", "لندن"],
  ["Manchester", "Manchester", "Manchester", "مانشستر"],
  ["Birmingham", "Birmingham", "Birmingham", "برمنغهام"],
  ["Liverpool", "Liverpool", "Liverpool", "ليفربول"],
  ["Edimburgo", "Edinburgh", "Édimbourg", "إدنبرة"]

];


function normalizeCityKey(text) {

  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f\u064b-\u065f\u0640]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, " ")
    .trim();

}


const CITY_INDEX = new Map();

CITY_DATA.forEach(entry => {

  entry.forEach(name => {

    const key = normalizeCityKey(name);

    if (key && !CITY_INDEX.has(key)) {
      CITY_INDEX.set(key, entry);
    }

  });

});


function cityName(raw) {

  if (!raw) return raw;

  const entry = CITY_INDEX.get(normalizeCityKey(raw));

  if (!entry) return raw;

  const index = Math.max(0, CITY_LANGS.indexOf(currentLanguage));

  return entry[index];

}


function refreshCityList() {

  let list = document.getElementById("cityList");

  if (!list) {
    list = document.createElement("datalist");
    list.id = "cityList";
    document.body.appendChild(list);
  }

  const index = Math.max(0, CITY_LANGS.indexOf(currentLanguage));

  list.innerHTML = CITY_DATA
    .map(entry => `<option value="${escapeHtml(entry[index])}"></option>`)
    .join("");

}


/*
  Aggiorna i form già creati (pubblica viaggio / richiesta / registrazione)
  quando cambia la lingua: nomi dei paesi, placeholder città, suggerimenti.
*/
function refreshLocalizedForms() {

  refreshCityList();

  document.querySelectorAll("select").forEach(select => {

    const options = Array.from(select.options).filter(o => o.value);

    if (!options.length) return;

    const allCountries =
      options.every(o => COUNTRIES.some(c => c.code === o.value));

    if (!allCountries) return;

    options.forEach(option => {

      const country = COUNTRIES.find(c => c.code === option.value);

      option.textContent =
        `${country.flag} ${country.names[currentLanguage] || country.names.it}`;

    });

  });

  [
    ["tripDepartureCity", "departureCity"],
    ["tripArrivalCity", "arrivalCity"],
    ["requestDepartureCity", "departureCity"],
    ["requestArrivalCity", "arrivalCity"]
  ].forEach(([id, key]) => {

    const input = document.getElementById(id);

    if (input) input.placeholder = t(key);

  });

}
