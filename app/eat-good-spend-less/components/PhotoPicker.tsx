"use client";

import React, { useRef, useState } from "react";
import { compressImage, newPhotoId, savePhotoBlob, usePhotoObjectUrl } from "../lib/photoStore";

export default function PhotoPicker({
  photoId,
  onChange,
  label = "📷 Add a photo",
}: {
  photoId?: string;
  onChange: (photoId: string | undefined) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const previewUrl = usePhotoObjectUrl(photoId);

  const handleFile = async (file: File) => {
    setBusy(true);
    try {
      const blob = await compressImage(file);
      const id = newPhotoId();
      await savePhotoBlob(id, blob);
      onChange(id);
    } catch {
      // A failed photo pick shouldn't block the rest of the form.
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="egsl-photo-picker">
      {previewUrl ? (
        <div className="egsl-photo-picker-preview">
          {/* eslint-disable-next-line @next/next/no-img-element -- blob: URLs from IndexedDB aren't next/image compatible */}
          <img src={previewUrl} alt="" />
          <button
            type="button"
            className="egsl-btn egsl-btn-ghost egsl-btn-sm"
            onClick={() => onChange(undefined)}
          >
            Remove photo
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="egsl-btn egsl-btn-secondary"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? "Adding…" : label}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
