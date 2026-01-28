import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause } from 'lucide-react';
import { VoiceRecordingErrorBoundary } from './ErrorBoundary';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  isDisabled?: boolean;
  maxDuration?: number; // in seconds
}

const VoiceRecorderComponent: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  isDisabled = false,
  maxDuration = 180 // 3 minutes default
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
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
        setAudioUrl(url);
        onRecordingComplete(audioBlob, duration);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(100); // Collect data every 100ms
      setIsRecording(true);
      setDuration(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration(prev => {
          const newDuration = prev + 1;
          if (newDuration >= maxDuration) {
            stopRecording();
          }
          return newDuration;
        });
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        // Resume timer
        timerRef.current = setInterval(() => {
          setDuration(prev => {
            const newDuration = prev + 1;
            if (newDuration >= maxDuration) {
              stopRecording();
            }
            return newDuration;
          });
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const resetRecording = () => {
    setDuration(0);
    setAudioUrl(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 border rounded-lg bg-gray-50">
      <div className="flex items-center space-x-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={isDisabled}
            className="flex items-center space-x-2 px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
          >
            <Mic size={20} />
            <span>Start Recording</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={pauseRecording}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
            >
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
            
            <button
              onClick={stopRecording}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              <Square size={16} />
              <span>Stop</span>
            </button>
          </div>
        )}
      </div>

      <div className="text-center">
        <div className="text-2xl font-mono text-gray-700">
          {formatTime(duration)}
        </div>
        {maxDuration && (
          <div className="text-sm text-gray-500">
            Max: {formatTime(maxDuration)}
          </div>
        )}
      </div>

      {isRecording && (
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">
            {isPaused ? 'Recording Paused' : 'Recording...'}
          </span>
        </div>
      )}

      {audioUrl && (
        <div className="w-full space-y-2">
          <audio controls className="w-full">
            <source src={audioUrl} type="audio/webm" />
            Your browser does not support audio playback.
          </audio>
          <button
            onClick={resetRecording}
            className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Record Again
          </button>
        </div>
      )}
    </div>
  );
};

export const VoiceRecorder: React.FC<VoiceRecorderProps> = (props) => {
  return (
    <VoiceRecordingErrorBoundary>
      <VoiceRecorderComponent {...props} />
    </VoiceRecordingErrorBoundary>
  );
};