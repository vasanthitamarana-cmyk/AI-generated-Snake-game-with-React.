import React, { useState, useRef, useEffect } from 'react';
import { DUMMY_TRACKS } from '../constants';
import { Play, Pause, SkipBack, SkipForward, Terminal } from 'lucide-react';

const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-md bg-black border-4 border-[#00FFFF] p-6 flex flex-col gap-6 relative animate-tear">
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[#FF00FF] -translate-x-1 -translate-y-1" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-[#FF00FF] translate-x-1 translate-y-1" />

      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
      
      <div className="flex items-center gap-2 text-[#FF00FF] border-b-2 border-[#FF00FF] pb-2">
        <Terminal size={24} />
        <span className="text-2xl tracking-widest">AUDIO_SUBSYSTEM</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-28 h-28 border-2 border-[#00FFFF] overflow-hidden">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className={`w-full h-full object-cover filter grayscale contrast-200 ${isPlaying ? 'animate-tear' : ''}`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[#FF00FF] mix-blend-overlay opacity-50" />
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="flex gap-1 items-end h-12">
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="w-2 bg-[#00FFFF] animate-glitch"
                    style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1 overflow-hidden">
          <h3 className="text-[#00FFFF] text-4xl truncate glitch-text mb-2">&gt; {currentTrack.title}</h3>
          <p className="text-[#FF00FF] text-2xl tracking-widest">USR: {currentTrack.artist}</p>
          <div className="mt-2 text-[#00FFFF] text-lg">
            [DATA_STREAM_ACTIVE]
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-6 w-full border-2 border-[#00FFFF] bg-black relative">
          <div 
            className="h-full bg-[#FF00FF] transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xl text-[#00FFFF]">
          <span>{audioRef.current ? Math.floor(audioRef.current.currentTime / 60) + ":" + (Math.floor(audioRef.current.currentTime % 60)).toString().padStart(2, '0') : "0:00"}</span>
          <span>{audioRef.current ? Math.floor(audioRef.current.duration / 60) + ":" + (Math.floor(audioRef.current.duration % 60)).toString().padStart(2, '0') : "0:00"}</span>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 border-t-2 border-[#00FFFF] pt-6">
        <button 
          onClick={prevTrack}
          className="text-[#00FFFF] hover:text-[#FF00FF] hover:scale-110 transition-transform"
        >
          <SkipBack size={40} />
        </button>
        
        <button 
          onClick={togglePlay}
          className="text-[#FF00FF] hover:text-[#00FFFF] hover:scale-110 transition-transform glitch-text"
        >
          {isPlaying ? <Pause size={56} /> : <Play size={56} />}
        </button>

        <button 
          onClick={nextTrack}
          className="text-[#00FFFF] hover:text-[#FF00FF] hover:scale-110 transition-transform"
        >
          <SkipForward size={40} />
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
