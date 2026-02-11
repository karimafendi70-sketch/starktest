import React, { useState } from 'react';
import { generateWritingSuggestions, suggestTags } from '../lib/ai/huggingface';

interface AIWritingPanelProps {
  content: string;
  onTagSuggest: (tag: string) => void;
}

export const AIWritingPanel: React.FC<AIWritingPanelProps> = ({ content, onTagSuggest }) => {
  const [tips, setTips] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tipsResult, tagsResult] = await Promise.all([
        generateWritingSuggestions(content),
        suggestTags(content),
      ]);
      setTips(tipsResult.slice(0, 3));
      setTags(tagsResult.slice(0, 3));
    } catch (e) {
      setError('AI suggesties ophalen mislukt.');
    }
    setLoading(false);
  };

  return (
    <div className="p-3 bg-gray-50 rounded border mt-2">
      <button
        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? 'AI genereert...' : 'AI schrijfsuggesties & tags'}
      </button>
      {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
      {tips.length > 0 && (
        <div className="mt-3">
          <div className="font-semibold mb-1">Schrijftips:</div>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {tips.map((tip, i) => (
              <li key={i}>{tip.replace(/^[-•]\s*/, '')}</li>
            ))}
          </ul>
        </div>
      )}
      {tags.length > 0 && (
        <div className="mt-3">
          <div className="font-semibold mb-1">AI tags:</div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <button
                key={tag}
                className="px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded text-xs"
                onClick={() => onTagSuggest(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIWritingPanel;
