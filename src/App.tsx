/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { GuidaSection } from './GuidaInstructions';
import { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { Mic, MicOff, Volume2, Sparkles, Camera, CameraOff, ChevronRight, RotateCcw, Settings, MessageSquare, Trophy, Save, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface Message {
  role: 'user' | 'model';
  nl: string;
  it: string;
  ph?: string;
  score?: number;
  heard?: string;
}

const SYSTEM_PROMPT = `Je bent Sofie, een vriendelijke en geduldige Nederlandse vrouw uit Amsterdam. Je helpt Italiaanse sprekers om Nederlands te oefenen via spiegelgesprekken en shadowing.
REGELS: ÉÉN korte Nederlandse zin per beurt (max 12 woorden). Eindig altijd met een vraag. Gebruik natuurlijk, modern Nederlands. Spreek warm en bemoedigend. Verbeter fouten vriendelijk met ✏️ Je kunt zeggen: [correctie] op een nieuwe regel in "nl".
ANTWOORD ALLEEN met geldige JSON: {"nl":"Nederlandse zin","it":"Italiaanse vertaling","ph":"fonetische hint"}`;

export default function App() {
  const [isCamOn, setIsCamOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [level, setLevel] = useState('B1');
  const [topic, setTopic] = useState('dagelijks leven');
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('Pronto · Klaar');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [customKey, setCustomKey] = useState(localStorage.getItem('specchio_nederlands_api_key') || '');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showFlags = windowWidth >= 480;

  const getAI = () => new GoogleGenAI({ apiKey: customKey || process.env.GEMINI_API_KEY || "" });

  const saveCustomKey = (key: string) => {
    localStorage.setItem('specchio_nederlands_api_key', key);
    setCustomKey(key);
    setShowKeyModal(false);
    setStatus('API Key opgeslagen! · Salvato!');
  };

  const prevMessagesLength = useRef(0);
  useEffect(() => {
    if (messages.length > prevMessagesLength.current || isThinking) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevMessagesLength.current = messages.length;
  }, [messages.length, isThinking]);

  const toggleCam = async () => {
    if (isCamOn) {
      streamRef.current?.getTracks().forEach(t => t.stop());
      streamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;
      setIsCamOn(false);
      setStatus('Spiegel uit · Specchio spento');
    } else {
      try {
        setStatus('Avvio fotocamera...');
        if (!navigator.mediaDevices?.getUserMedia) throw new Error("No camera support");
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setTimeout(() => videoRef.current?.play().catch(console.error), 100);
        }
        streamRef.current = stream;
        setIsCamOn(true);
        setStatus('Spiegel actief! ✨ · Specchio attivo!');
      } catch {
        setStatus('Toegang camera geweigerd · Accesso negato');
        setIsCamOn(false);
      }
    }
  };

  const speakIt = async (text: string) => {
    if (!text) return;
    setIsSpeaking(true);
    setStatus('De spiegel spreekt... · Lo specchio parla...');
    try {
      const aiInstance = getAI();
      const response = await aiInstance.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Zeg duidelijk in het Nederlands: ${text}` }] }],
        config: { responseModalities: [Modality.AUDIO] },
      });
      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
        const int16Data = new Int16Array(bytes.buffer);
        const float32Data = new Float32Array(int16Data.length);
        for (let i = 0; i < int16Data.length; i++) float32Data[i] = int16Data[i] / 32768.0;
        const audioBuffer = audioContextRef.current.createBuffer(1, float32Data.length, 24000);
        audioBuffer.getChannelData(0).set(float32Data);
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        source.onended = () => { setIsSpeaking(false); setStatus('Druk 🎤 om te antwoorden · Premi 🎤 per rispondere'); };
        source.start();
      } else throw new Error("No audio");
    } catch {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'nl-NL'; utterance.rate = 0.85;
      utterance.onend = () => { setIsSpeaking(false); setStatus('Druk 🎤 om te antwoorden · Premi 🎤 per rispondere'); };
      window.speechSynthesis.speak(utterance);
      setStatus('Browserstem gebruikt (fallback)');
    }
  };

  const startRecording = () => {
    try {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SR) { setStatus('Spraakherkenning niet ondersteund'); return; }
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (recognitionRef.current) { try { recognitionRef.current.stop(); } catch(_) {} }
      recognitionRef.current = new SR();
      recognitionRef.current.lang = 'nl-NL';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.onstart = () => { setIsRecording(true); setStatus('Ik luister... · Ascolto...'); };
      recognitionRef.current.onresult = (e: any) => { setIsRecording(false); processHeard(e.results[0][0].transcript); };
      recognitionRef.current.onerror = () => { setIsRecording(false); setStatus('Microfoon fout · Errore microfono'); };
      recognitionRef.current.onend = () => setIsRecording(false);
      recognitionRef.current.start();
    } catch { setStatus('Microfoon kon niet starten'); setIsRecording(false); }
  };

  const stopRecording = () => { recognitionRef.current?.stop(); setIsRecording(false); };

  const processHeard = async (heard: string) => {
    if (!heard.trim()) return;
    const lastModelMsg = messages.filter(m => m.role === 'model').pop();
    let currentScore = 0;
    if (lastModelMsg) {
      const sim = calculateSimilarity(lastModelMsg.nl, heard);
      if (sim > 0.7) currentScore = 2; else if (sim > 0.4) currentScore = 1;
      setScore(prev => prev + currentScore);
    }
    const userMsg: Message = { role: 'user', nl: heard, it: '', heard, score: currentScore };
    setMessages(prev => [...prev, userMsg]);
    generateAIResponse([...messages, userMsg]);
  };

  const calculateSimilarity = (s1: string, s2: string) => {
    const a = s1.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
    const b = s2.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
    if (a === b) return 1;
    if (a.includes(b) || b.includes(a)) return 0.8;
    return 0.5;
  };

  const generateAIResponse = async (history: Message[]) => {
    setIsThinking(true);
    setStatus('De spiegel denkt na... · Lo specchio pensa...');
    const systemPrompt = `${SYSTEM_PROMPT}\nNiveau: ${level}. Huidig onderwerp: ${topic}.`;
    const contents = history.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.role === 'user' ? m.nl : JSON.stringify({ nl: m.nl, it: m.it, ph: m.ph }) }]
    }));
    try {
      const aiInstance = getAI();
      const response = await aiInstance.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents.length > 0 ? contents : [{ role: 'user', parts: [{ text: 'Start het gesprek met een warme Nederlandse begroeting en één openingsvraag.' }] }],
        config: { systemInstruction: systemPrompt, responseMimeType: "application/json" },
      });
      const data = JSON.parse(response.text || "{}");
      const aiMsg: Message = { role: 'model', nl: data.nl || "Hoe gaat het met je?", it: data.it || "", ph: data.ph || "" };
      setMessages(prev => [...prev, aiMsg]);
      setIsThinking(false);
      speakIt(aiMsg.nl);
    } catch {
      setIsThinking(false);
      setStatus('Oeps, de spiegel is wazig · Lo specchio è appannato');
    }
  };

  const startNewConversation = () => { setMessages([]); setScore(0); generateAIResponse([]); };

  const downloadTranscript = () => {
    if (!messages.length) return;
    const text = messages.map(m => `[${m.role === 'user' ? 'JIJ' : 'SOFIE'}]\nNL: ${m.nl}\nIT: ${m.it || '-'}\n`).join('\n---\n\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    a.download = 'gesprek-nederlands.txt';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen w-full bg-[#080810] text-[#f5f0e8] font-sans selection:bg-[#e8883a]/30 flex flex-col pb-8">
      <div className="flex flex-col max-w-md mx-auto w-full px-4 pt-4 relative z-10">

        <header className="text-center pb-4">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="font-serif text-3xl font-light tracking-widest text-[#f0a860] drop-shadow-[0_0_20px_rgba(232,136,58,0.4)]">
            Specchio Nederlands
          </motion.h1>
          <a href="#guida"
            className="text-[0.55rem] tracking-[0.15em] uppercase opacity-40 hover:opacity-80 transition-opacity mt-1 block"
            style={{ color: 'inherit' }}>
            Come iniziare · Hoe te beginnen · How to start ↓
          </a>
          <p className="text-[0.6rem] tracking-[0.2em] uppercase text-[#e8883a]/50 mt-1">
            Sofie · Amsterdam · Nederlands
          </p>
        </header>

        {/* Mirror + Flanking Flags */}
        <div className="relative flex items-center justify-center mb-5">

          {showFlags && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-col items-center gap-1 mr-5 select-none">
              <span className="text-4xl drop-shadow-lg">🇮🇹</span>
              <span className="text-[0.5rem] tracking-widest uppercase text-[#e8883a]/40">Italiano</span>
            </motion.div>
          )}

          <div className="relative w-full max-w-[200px] aspect-[3/4]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#b5341a] via-[#e8883a] to-[#8b2210] rounded-[50%_50%_46%_46%_/_28%_28%_72%_72%] p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
              <div className="w-full h-full bg-[#180808] rounded-[47%_47%_44%_44%_/_26%_26%_74%_74%] overflow-hidden relative">
                <video ref={videoRef} autoPlay playsInline muted
                  className={`w-full h-full object-cover scale-x-[-1] transition-opacity duration-1000 ${isCamOn ? 'opacity-100' : 'opacity-0'}`} />
                <AnimatePresence>
                  {!isCamOn && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                      <Sparkles className="w-8 h-8 text-[#e8883a] mb-2 animate-pulse" />
                      <small className="text-[#e8883a]/60 text-[0.6rem] uppercase tracking-wider leading-relaxed">Spiegel uit<br/>Specchio spento</small>
                    </motion.div>
                  )}
                </AnimatePresence>
                {isSpeaking && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                    {[0, 0.15, 0.3].map((d, i) => (
                      <div key={i} className="w-1 h-3 bg-[#f0a860]/80 rounded-full animate-bounce" style={{ animationDelay: `${d}s` }} />
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button type="button" onClick={(e) => { e.preventDefault(); toggleCam(); }}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#080810] border border-[#e8883a]/30 px-3 py-1.5 rounded-full text-[0.55rem] tracking-widest uppercase text-[#f0a860]/80 flex flex-col items-center gap-0.5 z-20 w-[130px] text-center">
              <div className="flex items-center gap-1.5">
                {isCamOn ? <CameraOff size={10} /> : <Camera size={10} />}
                <span>{isCamOn ? 'Stop Spiegel' : 'Start Spiegel'}</span>
              </div>
              <span className="text-[0.45rem] opacity-60">{isCamOn ? 'Spegni specchio' : 'Accendi specchio'}</span>
            </button>
          </div>

          {showFlags && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="flex flex-col items-center gap-1 ml-5 select-none">
              <span className="text-4xl drop-shadow-lg">🇳🇱</span>
              <span className="text-[0.5rem] tracking-widest uppercase text-[#e8883a]/40">Nederlands</span>
            </motion.div>
          )}
        </div>

        {/* Settings */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="space-y-1">
            <label className="text-[0.55rem] uppercase tracking-widest text-[#e8883a]/50 ml-1 flex items-center gap-1"><Settings size={8} /> Niveau · Livello</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-[#e8883a]/5 border border-[#e8883a]/20 rounded-lg px-2 py-2 text-[0.7rem] outline-none text-[#f0a860]">
              <option value="A1">A1 - Principiante</option>
              <option value="A2">A2 - Elementare</option>
              <option value="B1">B1 - Intermedio</option>
              <option value="B2">B2 - Avanzato</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[0.55rem] uppercase tracking-widest text-[#e8883a]/50 ml-1 flex items-center gap-1"><MessageSquare size={8} /> Onderwerp · Argomento</label>
            <select value={topic} onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-[#e8883a]/5 border border-[#e8883a]/20 rounded-lg px-2 py-2 text-[0.7rem] outline-none text-[#f0a860]">
              <option value="dagelijks leven">Dagelijks Leven</option>
              <option value="restaurant">Restaurant</option>
              <option value="reizen">Reizen</option>
              <option value="familie">Familie</option>
              <option value="werk">Werk</option>
              <option value="weer">Het Weer</option>
              <option value="Amsterdam">Amsterdam</option>
            </select>
          </div>
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-center gap-6 mb-2">
          <div className="flex flex-col items-center gap-1">
            <button type="button" onClick={() => messages.length > 0 && speakIt(messages[messages.length-1].nl)}
              className="w-10 h-10 rounded-full bg-[#e8883a]/10 border border-[#e8883a]/20 flex items-center justify-center text-[#f0a860]">
              <Volume2 size={16} />
            </button>
            <span className="text-[0.5rem] uppercase tracking-widest text-[#e8883a]/60 text-center leading-tight">Herhaal<br/><span className="text-[#e8883a]/40">Ripeti</span></span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <button type="button" onClick={isRecording ? stopRecording : startRecording}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl ${isRecording ? 'bg-red-500/20 border-2 border-red-500 animate-pulse' : 'bg-gradient-to-br from-[#e8883a] to-[#8b2210]'}`}>
              {isRecording ? <MicOff size={24} className="text-red-500" /> : <Mic size={24} className="text-white" />}
            </button>
            <span className={`text-[0.55rem] uppercase tracking-widest font-bold text-center leading-tight ${isRecording ? 'text-red-500' : 'text-[#f0a860]'}`}>
              {isRecording ? <>Luisteren...<br/><span className="opacity-60">Ascolto</span></> : <>Antwoord<br/><span className="opacity-60">Rispondi</span></>}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <button type="button" onClick={() => generateAIResponse(messages)}
              className="w-10 h-10 rounded-full bg-[#e8883a]/10 border border-[#e8883a]/20 flex items-center justify-center text-[#f0a860]">
              <ChevronRight size={16} />
            </button>
            <span className="text-[0.5rem] uppercase tracking-widest text-[#e8883a]/60 text-center leading-tight">Sla over<br/><span className="text-[#e8883a]/40">Salta</span></span>
          </div>
        </div>

        <div className="text-center mb-3">
          <p className="text-[0.65rem] text-[#f0a860]/60 min-h-[1em] italic font-medium">{status}</p>
        </div>

        {/* Chat */}
        <div className="w-full h-[35vh] min-h-[250px] bg-black/30 border border-[#e8883a]/10 rounded-xl overflow-y-auto p-3 space-y-3 scrollbar-thin mb-4">
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[90%] px-3 py-2 rounded-xl text-[0.8rem] leading-relaxed ${msg.role === 'user' ? 'bg-white/5 border border-white/10 rounded-br-none italic text-white/80' : 'bg-gradient-to-br from-[#e8883a]/10 to-[#e8883a]/5 border border-[#e8883a]/20 rounded-bl-none'}`}>
                {msg.role === 'model' ? (
                  <>
                    <span className="font-serif italic text-base text-[#f0a860] block mb-0.5">{msg.nl}</span>
                    <span className="text-[0.65rem] text-white/40 block leading-tight">{msg.it}</span>
                    {msg.ph && <span className="text-[0.6rem] text-[#e8883a]/50 italic block mt-1">/{msg.ph}/</span>}
                  </>
                ) : (
                  <>
                    <span>{msg.nl}</span>
                    {msg.score !== undefined && (
                      <div className={`mt-1.5 text-[0.55rem] font-bold uppercase px-1.5 py-0.5 rounded-sm inline-block ${msg.score === 2 ? 'bg-green-500/10 text-green-400' : msg.score === 1 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>
                        {msg.score === 2 ? '✓ Prima!' : msg.score === 1 ? '~ Bijna!' : '↻ Probeer opnieuw'}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          ))}
          {isThinking && (
            <div className="flex gap-1.5 p-2 bg-[#e8883a]/5 border border-[#e8883a]/10 rounded-xl rounded-bl-none w-12">
              <div className="w-1 h-1 bg-[#f0a860] rounded-full animate-bounce" />
              <div className="w-1 h-1 bg-[#f0a860] rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1 h-1 bg-[#f0a860] rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-[#e8883a]/10 pb-3">
            <div className="flex items-center gap-1.5 text-[#e8883a]/60 text-[0.6rem] uppercase tracking-widest"><Trophy size={12} /> Score · Punteggio</div>
            <div className="text-[#f0a860] font-bold text-lg">⭐ {score}</div>
          </div>

          <button type="button" onClick={startNewConversation}
            className="w-full py-3 border border-[#e8883a]/30 bg-[#e8883a]/5 rounded-xl text-[0.7rem] tracking-[0.2em] uppercase text-[#f0a860] hover:bg-[#e8883a]/10 flex flex-col items-center justify-center gap-1">
            <div className="flex items-center gap-2"><RotateCcw size={14} /> Nieuw Gesprek</div>
            <span className="text-[0.55rem] opacity-60">Nuova conversazione</span>
          </button>

          <div className="flex gap-2">
            <button type="button" onClick={downloadTranscript}
              className="flex-1 py-2 border border-[#e8883a]/10 rounded-lg text-[0.6rem] tracking-widest uppercase text-[#e8883a]/60 hover:text-[#f0a860] flex flex-col items-center gap-0.5">
              <div className="flex items-center gap-1"><Save size={12} /> Opslaan</div>
              <span className="text-[0.45rem] opacity-60">Salva trascrizione</span>
            </button>
            <button type="button" onClick={() => setShowKeyModal(true)}
              className="px-4 py-2 border border-[#e8883a]/10 rounded-lg text-[0.6rem] text-[#e8883a]/60 hover:text-[#f0a860] flex flex-col items-center gap-0.5">
              <Key size={12} />
              <span className="text-[0.45rem] opacity-60 uppercase tracking-widest">API</span>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showKeyModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#1a0808] border border-[#e8883a]/30 p-6 rounded-2xl w-full max-w-xs shadow-2xl">
              <h2 className="font-serif text-xl text-[#f0a860] mb-1 text-center">Gemini API Key</h2>
              <p className="text-[0.6rem] text-[#e8883a]/60 text-center mb-3">Eigen sleutel per app · Chiave separata per app</p>
              <input type="password" defaultValue={customKey} id="keyInput" className="w-full bg-black/40 border border-[#e8883a]/20 rounded-lg px-4 py-2.5 text-sm mb-4 outline-none text-white" />
              <div className="flex gap-2">
                <button onClick={() => setShowKeyModal(false)} className="flex-1 py-2 text-xs text-[#e8883a]/50 border border-transparent rounded-lg">Annuleren</button>
                <button onClick={() => { saveCustomKey((document.getElementById('keyInput') as HTMLInputElement).value); }}
                  className="flex-1 py-2 bg-gradient-to-r from-[#e8883a] to-[#8b2210] rounded-lg text-white text-xs font-bold">Opslaan</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <GuidaSection accentColor="#e8883a" />
      <div style={{
        textAlign: 'center',
        padding: '1.5rem 1rem 2rem',
        fontSize: '0.72rem',
        lineHeight: 1.8,
        color: 'white',
        opacity: 0.85,
      }}>
        🇮🇹 Questa app è gratuita. Se la usi spesso, ti consigliamo di creare la tua chiave API personale — è facile e gratuita su aistudio.google.com.<br /><br />
        🇳🇱 Deze app is gratis. Gebruik je hem regelmatig, maak dan je eigen API-sleutel aan — eenvoudig en gratis via aistudio.google.com.<br /><br />
        🇬🇧 This app is free to use. If you use it regularly, we recommend creating your own API key — quick and free at aistudio.google.com.
      </div>
    </div>
  );
}
