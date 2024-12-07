import { useState, useCallback, useRef } from "react";
// bruh sound sounds horrid ill fix later
export const useTypewriter = (text: string, speed = 50, soundEnabled = false) => {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio i think?  
  if (!audioRef.current) {
    audioRef.current = new Audio("/sounds/typewriter.mp3"); 
    audioRef.current.volume = 0.1; // volume thing
  }

  const playTypeSound = () => {
    if (soundEnabled && audioRef.current) {
      const sound = audioRef.current.cloneNode() as HTMLAudioElement;
      // this for pitch am too lazy to get diff sound files
      sound.playbackRate = 1 + Math.random() * 0.4;
      sound.play().catch(err => console.warn("Audio playback failed", err));
    }
  };

  const startTyping = useCallback((text: string) => {
    setIsTyping(true);
    setDisplayText("");
    let i = 0;
    
    const intervalId = setInterval(() => {
      setDisplayText((prev) => {
        playTypeSound();
        return prev + text[i];
      });
      i++;
      
      if (i === text.length) {
        clearInterval(intervalId);
        setIsTyping(false);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [soundEnabled, speed]);

  return { 
    displayText, 
    isTyping, 
    startTyping,
    setVolume: (vol: number) => {
      if (audioRef.current) audioRef.current.volume = Math.max(0, Math.min(1, vol));
    }
  };
};
