<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Magische Spiegel · Nederlands Shadowing</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --goud: #c9a84c;
    --goud-licht: #e8c97a;
    --goud-donker: #8b6010;
    --bg: #080810;
    --tekst: #f5f0e8;
  }

  html { scroll-behavior: smooth; }

  body {
    min-height: 100vh;
    background: var(--bg);
    color: var(--tekst);
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 3rem;
    user-select: none;
  }

  body::before {
    content: '';
    position: fixed; inset: 0; z-index: 0;
    background: radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,168,76,0.06) 0%, transparent 70%);
    pointer-events: none;
  }

  .container {
    position: relative; z-index: 1;
    width: 100%; max-width: 420px;
    padding: 1rem 1.25rem;
    display: flex; flex-direction: column;
  }

  /* HEADER */
  header { text-align: center; padding-bottom: 1.25rem; }

  h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem; font-weight: 300;
    letter-spacing: 0.25em;
    color: var(--goud-licht);
    text-shadow: 0 0 30px rgba(201,168,76,0.35);
    margin-bottom: 0.15rem;
  }

  .header-sub {
    font-size: 0.55rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: rgba(201,168,76,0.45);
    margin-top: 0.2rem;
  }

  .header-link {
    display: block; margin-top: 0.4rem;
    font-size: 0.52rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: var(--tekst);
    opacity: 0.35; text-decoration: none;
    transition: opacity 0.2s;
  }
  .header-link:hover { opacity: 0.75; }

  /* SPIEGEL */
  .spiegel-wrap {
    position: relative; margin: 0 auto 1.6rem;
    width: 100%; max-width: 200px;
    aspect-ratio: 3/4;
  }

  .spiegel-rand {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #7a5810, var(--goud), #5a3e08);
    border-radius: 50% 50% 46% 46% / 28% 28% 72% 72%;
    padding: 6px;
    box-shadow: 0 12px 40px rgba(0,0,0,0.8), 0 0 20px rgba(201,168,76,0.15);
    transition: box-shadow 0.4s;
  }

  .spiegel-rand.spreekt {
    animation: gloei 0.9s ease-in-out infinite alternate;
  }
  @keyframes gloei {
    from { box-shadow: 0 12px 40px rgba(0,0,0,0.8), 0 0 20px rgba(201,168,76,0.15); }
    to   { box-shadow: 0 12px 40px rgba(0,0,0,0.8), 0 0 50px rgba(201,168,76,0.55), 0 0 90px rgba(201,168,76,0.2); }
  }

  .spiegel-inner {
    width: 100%; height: 100%;
    background: #111128;
    border-radius: 47% 47% 44% 44% / 26% 26% 74% 74%;
    overflow: hidden; position: relative;
  }

  video {
    width: 100%; height: 100%;
    object-fit: cover;
    transform: scaleX(-1);
    transition: opacity 1s;
    opacity: 0;
  }
  video.aan { opacity: 1; }

  .spiegel-placeholder {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    text-align: center; padding: 1rem;
    transition: opacity 0.5s;
  }
  .spiegel-placeholder.verborgen { opacity: 0; pointer-events: none; }

  .ster-svg {
    width: 2rem; height: 2rem; color: var(--goud);
    margin-bottom: 0.5rem;
    animation: puls 2.2s ease-in-out infinite;
  }
  @keyframes puls { 0%,100%{opacity:.45;transform:scale(1)} 50%{opacity:1;transform:scale(1.12)} }

  .spiegel-placeholder small {
    font-size: 0.55rem; letter-spacing: 0.12em;
    text-transform: uppercase; color: rgba(201,168,76,0.55);
    line-height: 1.7;
  }

  .cam-knop {
    position: absolute; bottom: -1rem; left: 50%;
    transform: translateX(-50%);
    background: var(--bg);
    border: 1px solid rgba(201,168,76,0.3);
    border-radius: 999px;
    padding: 0.38rem 0.9rem;
    font-size: 0.5rem; letter-spacing: 0.14em;
    font-family: 'Jost', sans-serif;
    text-transform: uppercase; color: rgba(201,168,76,0.8);
    cursor: pointer; white-space: nowrap;
    display: flex; flex-direction: column; align-items: center; gap: 2px;
    z-index: 10; min-width: 130px; text-align: center;
    transition: background 0.2s, color 0.2s;
  }
  .cam-knop:hover { background: rgba(201,168,76,0.08); color: var(--goud-licht); }
  .cam-knop .knop-hoofd { display: flex; align-items: center; gap: 5px; }
  .cam-knop .knop-sub { font-size: 0.42rem; opacity: 0.45; }

  /* INSTELLINGEN */
  .instellingen {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 0.6rem; margin-bottom: 1rem;
  }

  .instelling-groep { display: flex; flex-direction: column; gap: 4px; }

  .instelling-label {
    font-size: 0.5rem; letter-spacing: 0.15em;
    text-transform: uppercase; color: rgba(201,168,76,0.45);
    margin-left: 4px;
    display: flex; align-items: center; gap: 4px;
  }

  select {
    width: 100%;
    background: rgba(201,168,76,0.04);
    border: 1px solid rgba(201,168,76,0.18);
    border-radius: 0.6rem;
    padding: 0.5rem 0.5rem;
    font-size: 0.7rem; font-family: 'Jost', sans-serif;
    color: var(--goud-licht); outline: none; cursor: pointer;
  }
  select option { background: #1a1a2e; }

  /* ACTIES */
  .acties {
    display: flex; align-items: center;
    justify-content: center; gap: 2.2rem;
    margin-bottom: 0.75rem;
  }

  .actie-item { display: flex; flex-direction: column; align-items: center; gap: 5px; }

  .actie-knop-klein {
    width: 2.5rem; height: 2.5rem; border-radius: 50%;
    background: rgba(201,168,76,0.07);
    border: 1px solid rgba(201,168,76,0.2);
    color: var(--goud); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  .actie-knop-klein:hover { background: rgba(201,168,76,0.16); }

  .mic-knop {
    width: 4rem; height: 4rem; border-radius: 50%;
    background: linear-gradient(135deg, var(--goud), var(--goud-donker));
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 20px rgba(0,0,0,0.55);
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .mic-knop:hover { transform: scale(1.05); }
  .mic-knop.opneemt {
    background: rgba(239,68,68,0.15);
    border: 2px solid #ef4444;
    animation: klop 1s ease-in-out infinite;
  }
  @keyframes klop { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }

  .actie-label {
    font-size: 0.48rem; letter-spacing: 0.12em;
    text-transform: uppercase; text-align: center;
    line-height: 1.5; color: rgba(201,168,76,0.6); font-weight: 500;
  }
  .actie-label.rood { color: #ef4444; }
  .actie-label .sub { opacity: 0.5; display: block; font-size: 0.4rem; }

  /* STATUS */
  .status-balk { text-align: center; margin-bottom: 0.75rem; min-height: 1.2em; }
  .status-balk p {
    font-size: 0.62rem; font-style: italic;
    color: rgba(201,168,76,0.55); font-family: 'Jost', sans-serif;
  }

  /* CHAT */
  .chat {
    width: 100%;
    height: 35vh; min-height: 240px;
    background: rgba(0,0,0,0.28);
    border: 1px solid rgba(201,168,76,0.1);
    border-radius: 1rem;
    overflow-y: auto; padding: 0.75rem;
    display: flex; flex-direction: column; gap: 0.75rem;
    margin-bottom: 1rem;
    scroll-behavior: smooth;
  }

  .chat::-webkit-scrollbar { width: 4px; }
  .chat::-webkit-scrollbar-track { background: transparent; }
  .chat::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 2px; }

  .bericht {
    display: flex; flex-direction: column;
    animation: inschuiven 0.3s ease;
  }
  @keyframes inschuiven { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

  .bericht.spiegel { align-items: flex-start; }
  .bericht.gebruiker { align-items: flex-end; }

  .bericht-ballon {
    max-width: 90%;
    padding: 0.5rem 0.75rem;
    border-radius: 0.75rem;
    font-size: 0.8rem; line-height: 1.55;
  }

  .bericht.spiegel .bericht-ballon {
    background: linear-gradient(135deg, rgba(201,168,76,0.1), rgba(201,168,76,0.05));
    border: 1px solid rgba(201,168,76,0.2);
    border-bottom-left-radius: 2px;
  }

  .bericht.gebruiker .bericht-ballon {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-bottom-right-radius: 2px;
    font-style: italic; color: rgba(255,255,255,0.75);
  }

  .nl-tekst {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1rem; font-style: italic;
    color: var(--goud-licht); display: block; margin-bottom: 2px;
  }

  .vertaling {
    font-size: 0.62rem; color: rgba(255,255,255,0.38);
    display: block; line-height: 1.4;
  }

  .fonetiek {
    font-size: 0.58rem; color: rgba(201,168,76,0.45);
    font-style: italic; display: block; margin-top: 3px;
  }

  .score-badge {
    display: inline-block; margin-top: 5px;
    font-size: 0.52rem; font-weight: 500;
    letter-spacing: 0.08em; text-transform: uppercase;
    padding: 2px 6px; border-radius: 3px;
  }
  .score-badge.goed    { background: rgba(74,222,128,0.1); color: #4ade80; }
  .score-badge.bijna   { background: rgba(250,204,21,0.1); color: #facc15; }
  .score-badge.opnieuw { background: rgba(248,113,113,0.1); color: #f87171; }

  /* Denk-animatie */
  .denken {
    display: flex; gap: 5px; padding: 0.5rem 0.75rem;
    background: rgba(201,168,76,0.05);
    border: 1px solid rgba(201,168,76,0.1);
    border-radius: 0.75rem; border-bottom-left-radius: 2px;
    width: fit-content;
  }
  .denken span {
    width: 6px; height: 6px; background: var(--goud);
    border-radius: 50%; animation: stuit 1s ease-in-out infinite;
  }
  .denken span:nth-child(2) { animation-delay: 0.2s; }
  .denken span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes stuit { 0%,100%{transform:translateY(0);opacity:.5} 50%{transform:translateY(-5px);opacity:1} }

  /* ONDERIN */
  .onderin { display: flex; flex-direction: column; gap: 0.75rem; }

  .score-rij {
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid rgba(201,168,76,0.1); padding-bottom: 0.75rem;
  }

  .score-label {
    display: flex; align-items: center; gap: 5px;
    font-size: 0.58rem; letter-spacing: 0.12em;
    text-transform: uppercase; color: rgba(201,168,76,0.55);
  }

  .score-getal { font-size: 1.1rem; font-weight: 500; color: var(--goud); }

  .nieuw-gesprek-knop {
    width: 100%; padding: 0.85rem;
    border: 1px solid rgba(201,168,76,0.28);
    background: rgba(201,168,76,0.04);
    border-radius: 0.85rem;
    font-size: 0.68rem; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--goud);
    font-family: 'Jost', sans-serif;
    cursor: pointer;
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    transition: background 0.2s;
  }
  .nieuw-gesprek-knop:hover { background: rgba(201,168,76,0.1); }
  .nieuw-gesprek-knop .knop-hoofd { display: flex; align-items: center; gap: 8px; }
  .nieuw-gesprek-knop .knop-sub { font-size: 0.52rem; opacity: 0.5; }

  .hulp-rij { display: flex; gap: 0.5rem; }

  .hulp-knop {
    flex: 1; padding: 0.55rem;
    border: 1px solid rgba(201,168,76,0.1);
    background: transparent; border-radius: 0.65rem;
    font-size: 0.58rem; letter-spacing: 0.1em;
    text-transform: uppercase; color: rgba(201,168,76,0.55);
    font-family: 'Jost', sans-serif; cursor: pointer;
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    transition: color 0.2s, border-color 0.2s;
  }
  .hulp-knop:hover { color: var(--goud); border-color: rgba(201,168,76,0.3); }
  .hulp-knop .knop-sub { font-size: 0.42rem; opacity: 0.5; }

  /* API SLEUTEL MODAL */
  .modal-overlay {
    display: none; position: fixed; inset: 0; z-index: 100;
    background: rgba(0,0,0,0.8); backdrop-filter: blur(6px);
    align-items: center; justify-content: center; padding: 1.5rem;
  }
  .modal-overlay.zichtbaar { display: flex; }

  .modal-box {
    background: #12122a;
    border: 1px solid rgba(201,168,76,0.3);
    border-radius: 1.25rem; padding: 1.5rem;
    width: 100%; max-width: 300px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.8);
  }

  .modal-box h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem; color: var(--goud-licht);
    text-align: center; margin-bottom: 1rem; font-weight: 300;
  }

  .modal-input {
    width: 100%;
    background: rgba(0,0,0,0.4);
    border: 1px solid rgba(201,168,76,0.2);
    border-radius: 0.65rem; padding: 0.65rem 0.9rem;
    font-size: 0.85rem; color: white;
    font-family: 'Jost', sans-serif; outline: none;
    margin-bottom: 1rem;
  }

  .modal-knoppen { display: flex; gap: 0.5rem; }

  .modal-annuleer {
    flex: 1; padding: 0.6rem;
    font-size: 0.7rem; color: rgba(201,168,76,0.45);
    background: transparent; border: 1px solid transparent;
    border-radius: 0.65rem; cursor: pointer; font-family: 'Jost', sans-serif;
    transition: color 0.2s;
  }
  .modal-annuleer:hover { color: rgba(201,168,76,0.75); }

  .modal-opslaan {
    flex: 1; padding: 0.6rem;
    font-size: 0.7rem; font-weight: 500;
    background: linear-gradient(135deg, var(--goud), var(--goud-donker));
    color: #080810; border: none; border-radius: 0.65rem;
    cursor: pointer; font-family: 'Jost', sans-serif;
  }

  /* HANDLEIDING SECTIE */
  .handleiding {
    margin-top: 2rem; padding: 1.5rem 1.25rem;
    border-top: 1px solid rgba(201,168,76,0.1);
    width: 100%; max-width: 420px;
  }

  .handleiding h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; color: var(--goud-licht);
    font-weight: 300; letter-spacing: 0.1em;
    margin-bottom: 0.75rem; text-align: center;
  }

  .stap {
    display: flex; gap: 0.75rem; margin-bottom: 0.65rem;
    align-items: flex-start;
  }

  .stap-nr {
    width: 1.4rem; height: 1.4rem; flex-shrink: 0;
    border-radius: 50%; border: 1px solid rgba(201,168,76,0.3);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.55rem; color: var(--goud); font-weight: 500;
  }

  .stap p { font-size: 0.7rem; color: rgba(255,255,255,0.6); line-height: 1.6; }
  .stap strong { color: rgba(201,168,76,0.85); font-weight: 400; }

  /* VOETTEKST */
  .voettekst {
    text-align: center; padding: 1.5rem 1rem 2rem;
    font-size: 0.7rem; line-height: 1.9;
    color: white; opacity: 0.75;
    width: 100%; max-width: 420px;
  }

  /* ICONEN als inline SVG */
  svg.icoon { display: inline-block; vertical-align: middle; }
</style>
</head>
<body>

<div class="container">

  <!-- HEADER -->
  <header>
    <h1>Magische Spiegel</h1>
    <p class="header-sub">Jouw Nederlandse Gesprekspartner</p>
    <a href="#handleiding" class="header-link">Hoe te beginnen · How to start ↓</a>
  </header>

  <!-- SPIEGEL -->
  <div class="spiegel-wrap">
    <div class="spiegel-rand" id="spiegelRand">
      <div class="spiegel-inner">
        <video id="videoEl" autoplay playsinline muted></video>
        <div class="spiegel-placeholder" id="placeholder">
          <svg class="ster-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 3l2.09 6.26L20 10.27l-4.91 3.54L16.18 21 12 17.77 7.82 21l1.09-7.19L4 10.27l5.91-.01z"/>
          </svg>
          <small>Spiegel uit<br/>Activeer de spiegel</small>
        </div>
      </div>
    </div>
    <button class="cam-knop" id="camKnop" onclick="wisselCamera()">
      <span class="knop-hoofd">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" id="camIcoon">
          <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
          <circle cx="12" cy="13" r="4"/>
        </svg>
        <span id="camTekst">Spiegel aan</span>
      </span>
      <span class="knop-sub" id="camSub">Activeren</span>
    </button>
  </div>

  <!-- INSTELLINGEN -->
  <div class="instellingen">
    <div class="instelling-groep">
      <label class="instelling-label">
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>
        </svg>
        Niveau
      </label>
      <select id="niveauSelect">
        <option value="A1">A1 – Beginner</option>
        <option value="A2" selected>A2 – Elementair</option>
        <option value="B1">B1 – Gemiddeld</option>
        <option value="B2">B2 – Gevorderd</option>
      </select>
    </div>
    <div class="instelling-groep">
      <label class="instelling-label">
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
        Onderwerp
      </label>
      <select id="onderwerpSelect">
        <option value="dagelijks leven">Dagelijks leven</option>
        <option value="boodschappen">Boodschappen</option>
        <option value="reizen">Reizen</option>
        <option value="familie">Familie</option>
        <option value="werk">Werk</option>
        <option value="het weer">Het weer</option>
        <option value="hobby's">Hobby's</option>
      </select>
    </div>
  </div>

  <!-- ACTIEKNOPPEN -->
  <div class="acties">

    <!-- Herhaal -->
    <div class="actie-item">
      <button class="actie-knop-klein" onclick="herhaalLaatste()" title="Herhaal laatste zin">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
        </svg>
      </button>
      <span class="actie-label">Herhaal<span class="sub">Luister opnieuw</span></span>
    </div>

    <!-- Microfoon -->
    <div class="actie-item">
      <button class="mic-knop" id="micKnop" onclick="wisselOpname()">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#080810" stroke-width="2" id="micIcoon">
          <rect x="9" y="2" width="6" height="12" rx="3"/>
          <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v3M8 22h8"/>
        </svg>
      </button>
      <span class="actie-label" id="micLabel">Antwoord<span class="sub">Spreek Nederlands</span></span>
    </div>

    <!-- Sla over -->
    <div class="actie-item">
      <button class="actie-knop-klein" onclick="genereerAIAntwoord(berichten)" title="Sla over">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
      <span class="actie-label">Verder<span class="sub">Sla over</span></span>
    </div>

  </div>

  <!-- STATUS -->
  <div class="status-balk">
    <p id="statusTekst">Klaar · Druk op 🎤 om te beginnen</p>
  </div>

  <!-- CHAT -->
  <div class="chat" id="chatVenster">
    <!-- berichten komen hier -->
    <div id="chatEinde"></div>
  </div>

  <!-- ONDERIN -->
  <div class="onderin">
    <div class="score-rij">
      <span class="score-label">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 9H4.5a2.5 2.5 0 000 5H6M18 9h1.5a2.5 2.5 0 010 5H18M8 9h8M8 15h8M12 3v6M12 15v6"/>
        </svg>
        Score · Punten
      </span>
      <span class="score-getal">⭐ <span id="scoreGetal">0</span></span>
    </div>

    <button class="nieuw-gesprek-knop" onclick="nieuwGesprek()">
      <span class="knop-hoofd">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12a9 9 0 019-9 9.75 9.75 0 016.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 01-9 9 9.75 9.75 0 01-6.74-2.74L3 16M3 21v-5h5"/>
        </svg>
        Nieuw gesprek
      </span>
      <span class="knop-sub">Begin opnieuw</span>
    </button>

    <div class="hulp-rij">
      <button class="hulp-knop" onclick="slaGespreksopTranscript()">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
        </svg>
        Opslaan
        <span class="knop-sub">Transcript</span>
      </button>
      <button class="hulp-knop" onclick="toonApiModal()">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
        API Sleutel
        <span class="knop-sub">Instellingen</span>
      </button>
    </div>
  </div>

</div><!-- /container -->

<!-- API MODAL -->
<div class="modal-overlay" id="apiModal">
  <div class="modal-box">
    <h2>API Sleutel</h2>
    <input type="password" class="modal-input" id="apiSleutelInput" placeholder="Voer je Gemini API sleutel in…"/>
    <div class="modal-knoppen">
      <button class="modal-annuleer" onclick="sluitApiModal()">Annuleren</button>
      <button class="modal-opslaan" onclick="slaApiSleutelOp()">Opslaan</button>
    </div>
  </div>
</div>

<!-- HANDLEIDING -->
<div class="handleiding" id="handleiding">
  <h3>🇳🇱 Hoe te beginnen</h3>
  <div class="stap">
    <div class="stap-nr">1</div>
    <p>Druk op <strong>Spiegel aan</strong> om je spiegelbeeld te activeren. Zo zie je jezelf terwijl je spreekt — ideaal voor shadowing.</p>
  </div>
  <div class="stap">
    <div class="stap-nr">2</div>
    <p>Kies je <strong>niveau</strong> en een <strong>onderwerp</strong>. Druk op de grote microfoonknop om te beginnen.</p>
  </div>
  <div class="stap">
    <div class="stap-nr">3</div>
    <p><strong>Luister</strong> naar de spiegel. Spreek de zin <strong>na</strong> (shadowing) of antwoord zelf. De spiegel beoordeelt je uitspraak.</p>
  </div>
  <div class="stap">
    <div class="stap-nr">4</div>
    <p>Druk op <strong>Herhaal</strong> om de laatste zin opnieuw te horen. Druk op <strong>Verder</strong> als je een nieuwe prompt wilt.</p>
  </div>
  <div class="stap">
    <div class="stap-nr">5</div>
    <p>Gebruik je de app regelmatig? Maak dan een gratis eigen <strong>API sleutel</strong> aan via <strong>aistudio.google.com</strong>.</p>
  </div>
</div>

<!-- VOETTEKST -->
<div class="voettekst">
  🇳🇱 Deze app is gratis. Gebruik je hem regelmatig, maak dan je eigen API-sleutel aan — eenvoudig en gratis via aistudio.google.com.<br/><br/>
  🇬🇧 This app is free to use. If you use it regularly, we recommend creating your own API key — quick and free at aistudio.google.com.
</div>

<script type="module">
  // ── STATE ──
  let berichten = [];
  let score = 0;
  let isSpeaking = false;
  let isCamAan = false;
  let isOpname = false;
  let herkenning = null;
  let audioCtx = null;
  let streamRef = null;

  const videoEl        = document.getElementById('videoEl');
  const placeholder    = document.getElementById('placeholder');
  const spiegelRand    = document.getElementById('spiegelRand');
  const camKnop        = document.getElementById('camKnop');
  const camTekst       = document.getElementById('camTekst');
  const camSub         = document.getElementById('camSub');
  const camIcoon       = document.getElementById('camIcoon');
  const micKnop        = document.getElementById('micKnop');
  const micIcoon       = document.getElementById('micIcoon');
  const micLabel       = document.getElementById('micLabel');
  const statusTekst    = document.getElementById('statusTekst');
  const chatVenster    = document.getElementById('chatVenster');
  const chatEinde      = document.getElementById('chatEinde');
  const scoreGetal     = document.getElementById('scoreGetal');
  const apiModal       = document.getElementById('apiModal');
  const apiSleutelInput = document.getElementById('apiSleutelInput');

  // ── API SLEUTEL ──
  function getApiSleutel() {
    return sessionStorage.getItem('magischespiegel_api_key') ||
           localStorage.getItem('magischespiegel_api_key') || '';
  }

  window.toonApiModal = () => {
    apiSleutelInput.value = getApiSleutel();
    apiModal.classList.add('zichtbaar');
  };
  window.sluitApiModal = () => apiModal.classList.remove('zichtbaar');
  window.slaApiSleutelOp = () => {
    const sleutel = apiSleutelInput.value.trim();
    sessionStorage.setItem('magischespiegel_api_key', sleutel);
    localStorage.setItem('magischespiegel_api_key', sleutel);
    apiModal.classList.remove('zichtbaar');
    setStatus('API sleutel opgeslagen! ✓');
  };

  // ── CAMERA ──
  window.wisselCamera = async () => {
    if (isCamAan) {
      if (streamRef) { streamRef.getTracks().forEach(t => t.stop()); streamRef = null; }
      videoEl.srcObject = null;
      videoEl.classList.remove('aan');
      placeholder.classList.remove('verborgen');
      isCamAan = false;
      camTekst.textContent = 'Spiegel aan';
      camSub.textContent = 'Activeren';
      setStatus('Spiegel uitgeschakeld');
    } else {
      try {
        setStatus('Camera starten…');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        videoEl.srcObject = stream;
        setTimeout(() => videoEl.play().catch(() => {}), 100);
        streamRef = stream;
        isCamAan = true;
        videoEl.classList.add('aan');
        placeholder.classList.add('verborgen');
        camTekst.textContent = 'Spiegel uit';
        camSub.textContent = 'Deactiveren';
        setStatus('Spiegel actief ✨');
      } catch {
        setStatus('Camera toegang geweigerd.');
      }
    }
  };

  // ── STATUS ──
  function setStatus(tekst) { statusTekst.textContent = tekst; }

  // ── SPRAAK AFSPELEN (Gemini TTS) ──
  async function spreekNL(tekst) {
    if (!tekst) return;
    isSpeaking = true;
    spiegelRand.classList.add('spreekt');
    setStatus('De spiegel spreekt…');

    const sleutel = getApiSleutel();
    if (!sleutel) {
      // Terugval: browser TTS
      const utt = new SpeechSynthesisUtterance(tekst);
      utt.lang = 'nl-NL'; utt.rate = 0.88;
      utt.onend = () => {
        isSpeaking = false;
        spiegelRand.classList.remove('spreekt');
        setStatus('Druk op 🎤 om te antwoorden');
      };
      window.speechSynthesis.speak(utt);
      return;
    }

    try {
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${sleutel}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Spreek duidelijk in het Nederlands: ${tekst}` }] }],
            generationConfig: { responseModalities: ['AUDIO'], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Leda' } } } }
          })
        }
      );
      const data = await resp.json();
      const base64Audio = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const bin = atob(base64Audio);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        const int16 = new Int16Array(bytes.buffer);
        const f32 = new Float32Array(int16.length);
        for (let i = 0; i < int16.length; i++) f32[i] = int16[i] / 32768.0;
        const buf = audioCtx.createBuffer(1, f32.length, 24000);
        buf.getChannelData(0).set(f32);
        const src = audioCtx.createBufferSource();
        src.buffer = buf;
        src.connect(audioCtx.destination);
        src.onended = () => {
          isSpeaking = false;
          spiegelRand.classList.remove('spreekt');
          setStatus('Druk op 🎤 om te antwoorden');
        };
        src.start();
      } else {
        throw new Error('Geen audio data');
      }
    } catch {
      // Terugval browser TTS
      const utt = new SpeechSynthesisUtterance(tekst);
      utt.lang = 'nl-NL'; utt.rate = 0.88;
      utt.onend = () => {
        isSpeaking = false;
        spiegelRand.classList.remove('spreekt');
        setStatus('Browser stem gebruikt (fallback)');
      };
      window.speechSynthesis.speak(utt);
    }
  }

  // ── OPNAME ──
  window.wisselOpname = () => {
    if (isOpname) {
      stopOpname();
    } else {
      startOpname();
    }
  };

  function startOpname() {
    try {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) { setStatus('Spraakherkenning niet ondersteund.'); return; }
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (herkenning) { try { herkenning.stop(); } catch {} }
      herkenning = new SR();
      herkenning.lang = 'nl-NL';
      herkenning.continuous = false;
      herkenning.interimResults = false;
      herkenning.onstart = () => {
        isOpname = true;
        micKnop.classList.add('opneemt');
        micLabel.classList.add('rood');
        micLabel.innerHTML = 'Luisteren…<span class="sub">Ik luister</span>';
        // Verwissel mic icoon naar stop
        micIcoon.innerHTML = '<line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v3M8 22h8"/>';
        setStatus('Luisteren… · Spreek nu');
      };
      herkenning.onresult = (e) => {
        isOpname = false;
        herstelMicKnop();
        verwerkGehoord(e.results[0][0].transcript);
      };
      herkenning.onerror = () => { isOpname = false; herstelMicKnop(); setStatus('Microfoon fout.'); };
      herkenning.onend   = () => { isOpname = false; herstelMicKnop(); };
      herkenning.start();
    } catch { setStatus('Microfoon kan niet starten.'); isOpname = false; }
  }

  function stopOpname() {
    herkenning?.stop();
    isOpname = false;
    herstelMicKnop();
  }

  function herstelMicKnop() {
    micKnop.classList.remove('opneemt');
    micLabel.classList.remove('rood');
    micLabel.innerHTML = 'Antwoord<span class="sub">Spreek Nederlands</span>';
    micIcoon.innerHTML = '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v3M8 22h8"/>';
  }

  // ── VERWERK GEHOORD ──
  async function verwerkGehoord(gehoord) {
    if (!gehoord.trim()) return;
    const laasteSpiegelBericht = [...berichten].reverse().find(m => m.rol === 'spiegel');
    let huidigeScore = 0;
    if (laasteSpiegelBericht) {
      const gelijkenis = berekenGelijkenis(laasteSpiegelBericht.nl, gehoord);
      if (gelijkenis > 0.7) huidigeScore = 2;
      else if (gelijkenis > 0.4) huidigeScore = 1;
      score += huidigeScore;
      scoreGetal.textContent = score;
    }
    const gebruikersBericht = { rol: 'gebruiker', nl: gehoord, it: '', gehoord: gehoord, score: huidigeScore };
    berichten.push(gebruikersBericht);
    voegBerichtToe(gebruikersBericht);
    await genereerAIAntwoord(berichten);
  }

  function berekenGelijkenis(s1, s2) {
    const a = s1.toLowerCase().replace(/[.,!?;:'"()\-]/g, '');
    const b = s2.toLowerCase().replace(/[.,!?;:'"()\-]/g, '');
    if (a === b) return 1;
    if (a.includes(b) || b.includes(a)) return 0.8;
    // Eenvoudige woordoverlap
    const woorden1 = new Set(a.split(' '));
    const woorden2 = b.split(' ');
    const overlap = woorden2.filter(w => woorden1.has(w)).length;
    return overlap / Math.max(woorden1.size, woorden2.length);
  }

  // ── AI ANTWOORD (Gemini) ──
  window.genereerAIAntwoord = async (geschiedenis) => {
    toonDenken();
    setStatus('De spiegel denkt na…');

    const niveau = document.getElementById('niveauSelect').value;
    const onderwerp = document.getElementById('onderwerpSelect').value;

    const systeemPrompt = `Je bent een vriendelijke Nederlandse gesprekspartner — als een magische spiegel die praat.
Niveau: ${niveau}. Huidig onderwerp: ${onderwerp}.
REGELS: ÉÉN korte zin in het Nederlands per beurt (max 12 woorden). Eindig altijd met een vraag.
Antwoord ALLEEN met geldig JSON: {"nl":"Nederlandse zin","it":"Italiaanse vertaling","ph":"fonetische uitspraak"}
Voorbeeld: {"nl":"Wat doe jij graag in het weekend?","it":"Cosa ti piace fare nel fine settimana?","ph":"vat doo yay khraakh in het weeekend"}`;

    const inhoud = geschiedenis.map(m => ({
      role: m.rol === 'gebruiker' ? 'user' : 'model',
      parts: [{ text: m.rol === 'gebruiker' ? m.nl : JSON.stringify({ nl: m.nl, it: m.it, ph: m.ph }) }]
    }));

    const sleutel = getApiSleutel();

    try {
      let nlTekst, itTekst, phTekst;

      if (sleutel) {
        // Gemini API direct
        const resp = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${sleutel}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: systeemPrompt }] },
              contents: inhoud.length > 0 ? inhoud : [{ role: 'user', parts: [{ text: 'Begin het gesprek.' }] }],
              generationConfig: { responseMimeType: 'application/json' }
            })
          }
        );
        const data = await resp.json();
        const tekst = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
        const parsed = JSON.parse(tekst.replace(/```json|```/g, '').trim());
        nlTekst = parsed.nl || 'Hallo! Hoe gaat het?';
        itTekst = parsed.it || '';
        phTekst = parsed.ph || '';
      } else {
        // Geen sleutel: terugval
        nlTekst = 'Voer een API sleutel in om te beginnen.';
        itTekst = 'Inserisci una chiave API per iniziare.';
        phTekst = '';
      }

      verwijderDenken();
      const spiegelBericht = { rol: 'spiegel', nl: nlTekst, it: itTekst, ph: phTekst };
      berichten.push(spiegelBericht);
      voegBerichtToe(spiegelBericht);
      spreekNL(nlTekst);
    } catch (err) {
      verwijderDenken();
      setStatus('Oeps, de spiegel is beslagen. Probeer opnieuw.');
    }
  };

  // ── BERICHTEN WEERGEVEN ──
  function voegBerichtToe(bericht) {
    // Verwijder denk-indicator als aanwezig
    const denken = chatVenster.querySelector('.denken-wrapper');
    if (denken) denken.remove();

    const div = document.createElement('div');
    div.className = `bericht ${bericht.rol === 'spiegel' ? 'spiegel' : 'gebruiker'}`;

    if (bericht.rol === 'spiegel') {
      div.innerHTML = `
        <div class="bericht-ballon">
          <span class="nl-tekst">${bericht.nl}</span>
          ${bericht.it ? `<span class="vertaling">${bericht.it}</span>` : ''}
          ${bericht.ph ? `<span class="fonetiek">/${bericht.ph}/</span>` : ''}
        </div>`;
    } else {
      let badgeHtml = '';
      if (bericht.score !== undefined) {
        if (bericht.score === 2) badgeHtml = '<div class="score-badge goed">✓ Uitstekend!</div>';
        else if (bericht.score === 1) badgeHtml = '<div class="score-badge bijna">~ Bijna!</div>';
        else badgeHtml = '<div class="score-badge opnieuw">↻ Probeer opnieuw</div>';
      }
      div.innerHTML = `
        <div class="bericht-ballon">
          <span>${bericht.nl}</span>
          ${badgeHtml}
        </div>`;
    }

    chatVenster.insertBefore(div, chatEinde);
    chatEinde.scrollIntoView({ behavior: 'smooth' });
  }

  function toonDenken() {
    const wrapper = document.createElement('div');
    wrapper.className = 'bericht spiegel denken-wrapper';
    wrapper.innerHTML = '<div class="denken"><span></span><span></span><span></span></div>';
    chatVenster.insertBefore(wrapper, chatEinde);
    chatEinde.scrollIntoView({ behavior: 'smooth' });
  }

  function verwijderDenken() {
    const el = chatVenster.querySelector('.denken-wrapper');
    if (el) el.remove();
  }

  // ── HERHAAL LAATSTE ──
  window.herhaalLaatste = () => {
    const laatste = [...berichten].reverse().find(m => m.rol === 'spiegel');
    if (laatste) spreekNL(laatste.nl);
  };

  // ── NIEUW GESPREK ──
  window.nieuwGesprek = () => {
    berichten = [];
    score = 0;
    scoreGetal.textContent = '0';
    // Verwijder alle chatberichten
    const kinderen = Array.from(chatVenster.children).filter(c => c !== chatEinde);
    kinderen.forEach(c => c.remove());
    genereerAIAntwoord([]);
  };

  // ── TRANSCRIPT OPSLAAN ──
  window.slaGespreksopTranscript = () => {
    if (berichten.length === 0) return;
    const tekst = berichten.map(m =>
      `[${m.rol === 'gebruiker' ? 'JIJ' : 'SPIEGEL'}]\nNL: ${m.nl}\nIT: ${m.it || '-'}\n`
    ).join('\n---\n\n');
    const blob = new Blob([tekst], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `gesprek_nl_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
  };

  // ── INIT ──
  window.addEventListener('load', () => {
    // Laad opgeslagen API sleutel
    const opgeslagen = localStorage.getItem('magischespiegel_api_key') || '';
    if (opgeslagen) sessionStorage.setItem('magischespiegel_api_key', opgeslagen);
    // Start eerste AI beurt
    genereerAIAntwoord([]);
  });
</script>
</body>
</html>
