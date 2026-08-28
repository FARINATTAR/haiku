import { useVoiceInput } from '../../hooks/useVoiceInput';

interface VoiceButtonProps {
  onResult: (text: string) => void;
}

export function VoiceButton({ onResult }: VoiceButtonProps) {
  const { isListening, isSupported, startListening, stopListening, transcript } = useVoiceInput(onResult);

  if (!isSupported) return null;

  return (
    <button
      className={`voice-btn ${isListening ? 'voice-btn--recording' : ''}`}
      onClick={isListening ? stopListening : startListening}
      type="button"
    >
      {isListening ? (
        <>🔴 {transcript || 'Listening...'}</>
      ) : (
        <>🎙️ Tap to speak</>
      )}
    </button>
  );
}
