import VoiceRecorder from '@/components/VoiceRecorder';

interface EntryForm {
  title: string;
  content: string;
  mood: MoodType;
  tags: string[];
  photos: string[];
  audio?: { blob: Blob; duration: number; url: string; };
  date: Date;
}

const handleVoiceTranscription = (text: string) => {
  setForm(prev => ({
    ...prev,
    content: prev.content + (prev.content ? ' ' : '') + text,
  }));
  setHasUnsavedChanges(true);
};

const handleAudioSave = async (audioBlob: Blob, duration: number) => {
  const url = URL.createObjectURL(audioBlob);
  setForm(prev => ({
    ...prev,
    audio: { blob: audioBlob, duration, url },
  }));
  setHasUnsavedChanges(true);
  toast.success('🎤 Voice note saved!');
};

{/* Voice Recorder */}
<div className="mb-6">
  <VoiceRecorder
    onTranscription={handleVoiceTranscription}
    onAudioSave={handleAudioSave}
  />
</div>
