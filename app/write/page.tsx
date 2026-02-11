'use client';

import React, { useState } from 'react';
import VoiceRecorder from './VoiceRecorder';

interface EntryForm {
    audio: string;
    // other fields...
}

const WritePage: React.FC = () => {
    const [entry, setEntry] = useState<EntryForm>({ audio: '' });
    const [isRecording, setIsRecording] = useState(false);

    const handleVoiceTranscription = (transcription: string) => {
        setEntry(prevEntry => ({ ...prevEntry, audio: transcription }));
    };

    const handleAudioSave = (audioBlob: Blob) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setEntry(prevEntry => ({ ...prevEntry, audio: reader.result as string }));
        };
        reader.readAsDataURL(audioBlob);
    };

    return (
        <div>
            <h1>Main Editor</h1>
            <VoiceRecorder 
                onTranscribe={handleVoiceTranscription} 
                onSave={handleAudioSave} 
                isRecording={isRecording} 
                setIsRecording={setIsRecording} 
            />
            <h2>Additional Editor Components</h2>
            <p>Additional content goes here...</p>
            <div>Bottom Bar</div>
        </div>
    );
};

export default WritePage;