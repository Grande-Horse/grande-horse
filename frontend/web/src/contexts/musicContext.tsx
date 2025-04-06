import { createContext, useContext, useRef, useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type MusicContextType = {
  isPlaying: boolean;
  togglePlay: () => void;
};

const MusicContext = createContext<MusicContextType | null>(null);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { pathname } = useLocation();
  const [src, setSrc] = useState<string>('');

  useEffect(() => {
    if (pathname.startsWith('/racetrack')) {
      setSrc('/music/race.mp3');
    } else if (pathname === '/' || pathname.startsWith('/landing')) {
      setSrc('/music/stall.mp3');
    } else {
      setSrc('/music/default.mp3');
    }
  }, [pathname]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.warn('자동 재생 차단:', err));
      }
    }
  }, [src]);

  const play = useCallback(() => {
    audioRef.current
      ?.play()
      .then(() => setIsPlaying(true))
      .catch((err) => console.warn('재생 차단:', err));
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  return (
    <MusicContext.Provider value={{ isPlaying, togglePlay }}>
      {src && <audio ref={audioRef} src={src} loop />}
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusic must be used within MusicProvider');
  return context;
};
