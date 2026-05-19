import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function KivoVoiceCommand() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'pt-BR';

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const t = event.results[current][0].transcript.toLowerCase();
      setTranscript(t);
      
      if (t.includes('invoice') || t.includes('fatura') || t.includes('100')) {
        setTimeout(() => {
          // Trigger global invoice simulation
          window.location.hash = "#invoice";
          // We can dispatch a custom event if we want components to react
          window.dispatchEvent(new CustomEvent('kivo-voice-simulate-invoice', { detail: { amount: 100 } }));
        }, 1000);
      }
      setTimeout(() => setListening(false), 2000);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === 'Space' && !listening) {
        e.preventDefault();
        setListening(true);
        recognition.start();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [listening]);

  if (!supported) return null;

  return (
    <AnimatePresence>
      {listening && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] bg-black/90 backdrop-blur-md border border-white/20 p-4 px-6 rounded-full shadow-[0_0_40px_rgba(16,185,129,0.3)] flex items-center gap-4"
        >
          <div className="flex gap-1 items-end h-4">
            <motion.div animate={{ height: ['4px', '16px', '4px'] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-emerald-400 rounded-full"></motion.div>
            <motion.div animate={{ height: ['4px', '12px', '4px'] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1 bg-emerald-400 rounded-full"></motion.div>
            <motion.div animate={{ height: ['4px', '16px', '4px'] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1 bg-emerald-400 rounded-full"></motion.div>
          </div>
          <span className="text-white font-medium text-sm">
            {transcript ? `"${transcript}"` : "Ouvindo... (Diga 'Kivo, simule um invoice de 100')"}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
