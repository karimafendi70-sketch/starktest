// @ts-ignore
import { HfInference } from '@huggingface/inference';

// Free Hugging Face Inference API (no key needed!)
const hf = new HfInference();

export interface SentimentResult {
  label: string;
  score: number;
  mood: 'happy' | 'sad' | 'anxious' | 'calm' | 'excited' | 'neutral';
}

/**
 * Analyze text and get happy/sad/neutral mood via HuggingFace.
 */
export async function analyzeSentiment(text: string): Promise<SentimentResult> {
  try {
    const result = await hf.textClassification({
      model: 'distilbert-base-uncased-finetuned-sst-2-english',
      inputs: text,
    });
    const sentiment = result[0];
    const moodMap: Record<string, SentimentResult['mood']> = {
      'POSITIVE': 'happy',
      'NEGATIVE': 'sad',
    };
    return {
      label: sentiment.label,
      score: sentiment.score,
      mood: moodMap[sentiment.label as keyof typeof moodMap] || 'neutral',
    };
  } catch (err) {
    return { label: 'NEUTRAL', score: 0.5, mood: 'neutral' };
  }
}

export async function generateWritingSuggestions(text: string): Promise<string[]> {
  try {
    const prompt = `Improve this journal entry with 3 short suggestions:\n\n"${text.slice(0, 200)}"\n\nSuggestions:`;
    const result = await hf.textGeneration({
      model: 'gpt2',
      inputs: prompt,
      parameters: { max_new_tokens: 100, temperature: 0.7 },
    });
    // Parse output
    const suggestions = result.generated_text
      .split('\n')
      .filter((line: string) => line.trim().startsWith('-') || line.trim().startsWith('•'))
      .slice(0, 3);
    return suggestions.length > 0 ? suggestions : [
      '- Try adding more sensory details',
      '- Reflect on what you learned today',
      '- Describe how you felt in the moment',
    ];
  } catch (error) {
    return [
      '- Try adding more details about your feelings',
      '- What was the most important moment today?',
      '- How did this experience change you?',
    ];
  }
}

export async function suggestTags(text: string): Promise<string[]> {
  try {
    const result = await hf.zeroShotClassification({
      model: 'facebook/bart-large-mnli',
      inputs: text,
      parameters: {
        candidate_labels: [
          'gratitude',
          'reflection',
          'challenge',
          'success',
          'relationship',
          'work',
          'health',
          'personal-growth',
          'creativity',
          'travel',
        ],
      },
    });
    // result.labels en result.scores zijn arrays volgens de API docs
    const labels = (result as any).labels as string[];
    const scores = (result as any).scores as number[];
    return labels
      .slice(0, 5)
      .filter((_: string, idx: number) => scores[idx] > 0.3)
      .slice(0, 3);
  } catch {
    return [];
  }
}
