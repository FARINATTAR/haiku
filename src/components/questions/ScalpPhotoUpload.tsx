import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScalpPhotoUploadProps {
  onPhotoChange: (file: File | null) => void;
  currentPhoto: File | null;
}

export function ScalpPhotoUpload({ onPhotoChange }: ScalpPhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    onPhotoChange(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onPhotoChange(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
        style={{ display: 'none' }}
        id="scalp-photo-input"
      />

      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.label
            htmlFor="scalp-photo-input"
            className="photo-upload"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ cursor: 'pointer' }}
          >
            <div className="photo-upload__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="12" cy="12" r="3" />
                <path d="M3 16l4-4 4 4" />
                <path d="M14 14l3-3 4 4" />
              </svg>
            </div>
            <p className="photo-upload__text">Tap to take or upload a photo</p>
            <p className="photo-upload__hint">Top of head, well-lit, optional</p>
          </motion.label>
        ) : (
          <motion.div
            className="photo-preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <img src={preview} alt="Scalp photo" className="photo-preview__img" />
            <button
              className="photo-preview__remove"
              onClick={handleRemove}
              type="button"
            >
              Remove
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
