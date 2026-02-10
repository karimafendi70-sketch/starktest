"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, StopCircle } from "lucide-react";
import { VoiceRecognition, SUPPORTED_LANGUAGES } from "@/lib/voice-recognition";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  language?: string;
}

export function VoiceInput({ onTranscript, language = 'en-US' }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<VoiceRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRecognition(new VoiceRecognition());
    }
  }, []);

  const isSupported = typeof window !== 'undefined' && VoiceRecognition.isSupported();

  const handleStart = () => {
    if (!recognition) return;

    setError(null);
    setIsListening(true);
    setIsPaused(false);

    recognition.start(
      {
        language: selectedLanguage,
        continuous: true,
        interimResults: true,
      },
      (text, isFinal) => {
        setTranscript(text);
        if (isFinal) {
          onTranscript(text + ' ');
          setTranscript('');
        }
      },
      (err) => {
        setError(err);
        setIsListening(false);
      }
    );
  };

  const handleStop = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
    setIsPaused(false);
    setTranscript('');
  };

  const handlePause = () => {
    if (recognition) {
      recognition.pause();
    }
    setIsPaused(true);
  };

  if (!isSupported) {
    return (
      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          Voice recognition is not supported in your browser.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Language Selector */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Language:
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          disabled={isListening}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm disabled:opacity-50"
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Voice Input Controls */}
      <div className="flex items-center gap-3">
        {!isListening ? (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
          >
            <Mic className="w-5 h-5" />
            Start Recording
          </motion.button>
        ) : (
          <>
            {!isPaused ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handlePause}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors"
              >
                <MicOff className="w-5 h-5" />
                Pause
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleStart}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
              >
                <Mic className="w-5 h-5" />
                Resume
              </motion.button>
            )}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleStop}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
            >
              <StopCircle className="w-5 h-5" />
              Stop
            </motion.button>
          </>
        )}
      </div>

      {/* Status Indicator */}
      <AnimatePresence>
        {isListening && !isPaused && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-red-600 dark:text-red-400"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-3 h-3 bg-red-600 rounded-full"
            />
            <span className="text-sm font-medium">Listening...</span>
          </motion.div>
        )}
        {isPaused && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-yellow-600 dark:text-yellow-400 font-medium"
          >
            ⏸️ Paused
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interim Transcript */}
      {transcript && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-100 italic">
            {transcript}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
