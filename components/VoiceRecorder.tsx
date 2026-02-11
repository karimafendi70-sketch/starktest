'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  onAudioSave: (audioBlob: Blob, duration: number) => void;
}

export default function VoiceRecorder({ onTranscription, onAudioSave }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'nl-NL';
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          
          if (event.results[0].isFinal) {
            onTranscription(transcript);
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
          if (event.error === 'not-allowed') {
            toast.error('Microfoon toegang geweigerd');
          }
        };
      }
    }
  }, [onTranscription]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        onAudioSave(audioBlob, recordingTime);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      if (recognitionRef.current) {
        setIsTranscribing(true);
        recognitionRef.current.start();
      }

      toast.success('🎤 Opname gestart!');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Kan microfoon niet gebruiken');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      if (recognitionRef.current && isTranscribing) {
        recognitionRef.current.stop();
        setIsTranscribing(false);
      }

      toast.success('✅ Opname gestopt!');
    }
  };

  const togglePlayback = () => {
    if (!audioURL) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(audioURL);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const deleteRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioURL(null);
    setIsPlaying(false);
    setRecordingTime(0);
    toast.success('🗑️ Opname verwijderd');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return \\`${mins}:${secs.toString().padStart(2, '0')}\`;
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Mic className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Voice Note</h3>
        </div>
        {isTranscribing && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <FileText className="w-4 h-4 animate-pulse" />
            <span>Transcribing...</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {!isRecording && !audioURL && (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <Mic className="w-4 h-4" />
            Start Recording
          </button>
        )}

        {isRecording && (
          <>
            <button
              onClick={stopRecording}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-colors"
            >
              <Square className="w-4 h-4" />
              Stop
            </button>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
                {formatTime(recordingTime)}
              </span>
            </div>
          </>
        )}

        {audioURL && !isRecording && (
          <>
            <button
              onClick={togglePlayback}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Play
                </>
              )}
            </button>
            <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
              {formatTime(recordingTime)}
            </span>
            <button
              onClick={deleteRecording}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Delete recording"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={startRecording}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            >
              <Mic className="w-4 h-4" />
              Re-record
            </button>
          </>
        )}
      </div>

      {isRecording && (
        <div className="mt-3 flex gap-1 items-center justify-center h-12">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-purple-500 rounded-full animate-pulse"
              style={{
                height: \\`${Math.random() * 100}%\` ,
                animationDelay: \\`${i * 0.05}s\` ,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}