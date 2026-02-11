import React, { useEffect, useRef, useState } from 'react';
import { analyzeSentiment, generateWritingSuggestions } from '../lib/ai/huggingface';

interface AISentimentBarProps {
  content: string;
  onMoodSuggest: (mood: string) => void;
}

export const AISentimentBar: React.FC<AISentimentBarProps> = ({ content, onMoodSuggest }) => {
  const [mood, setMood] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const [suggestion, setSuggestion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const lastContent = useRef<string>('');

  useEffect(() => {
    if (content === lastContent.current) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      setLoading(true);
      const sentiment = await analyzeSentiment(content);
      setMood(sentiment.mood);
      setConfidence(Math.round(sentiment.score * 100));
      const suggestions = await generateWritingSuggestions(content);
      setSuggestion(suggestions[0] || '');
      setLoading(false);
      lastContent.current = content;
    }, 2000);
    // eslint-disable-next-line
  }, [content]);

  return (
    <div className="flex items-center gap-4 p-2 bg-gray-50 rounded border mt-2">
      <div>
        <span className="font-semibold">Mood:</span> {loading ? 'Analyzing...' : mood}
        {confidence > 0 && !loading && (
          <span className="ml-2 text-xs text-gray-500">({confidence}% confidence)</span>
        )}
      </div>
      {suggestion && !loading && (
        <div className="flex items-center gap-2">
          <span className="italic text-sm text-blue-700">{suggestion}</span>
          <button
            className="ml-2 px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded text-xs"
            onClick={() => onMoodSuggest(mood)}
          >
            apply this mood
          </button>
        </div>
      )}
    </div>
  );
};

export default AISentimentBar;
