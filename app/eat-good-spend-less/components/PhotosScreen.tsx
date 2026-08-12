"use client";

import React, { useState } from "react";
import { useStore } from "../lib/store";
import { deletePhotoBlob, usePhotoObjectUrl } from "../lib/photoStore";
import type { PhotoLogEntry } from "../lib/types";
import { Sheet } from "./ui/Sheet";
import PhotoPicker from "./PhotoPicker";
import AddRecipeSheet from "./AddRecipeSheet";

function PhotoThumb({ entry, onOpen }: { entry: PhotoLogEntry; onOpen: () => void }) {
  const url = usePhotoObjectUrl(entry.id);
  return (
    <button className="egsl-photo-thumb" onClick={onOpen} aria-label={entry.caption ?? "Food photo"}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element -- blob: URLs from IndexedDB
        <img src={url} alt="" />
      ) : (
        <span className="egsl-photo-thumb-loading">📷</span>
      )}
    </button>
  );
}

function AddPhotoSheet({ onClose }: { onClose: () => void }) {
  const { state, addPhotoLogEntry } = useStore();
  const [photoId, setPhotoId] = useState<string | undefined>(undefined);
  const [caption, setCaption] = useState("");
  const [linkedRecipeId, setLinkedRecipeId] = useState("");

  const save = () => {
    if (!photoId) return;
    addPhotoLogEntry({
      id: photoId,
      createdAt: new Date().toISOString(),
      caption: caption.trim() || undefined,
      linkedRecipeId: linkedRecipeId || undefined,
    });
    onClose();
  };

  return (
    <Sheet title="Add a food photo" onClose={onClose}>
      <div className="egsl-field">
        <label>Photo</label>
        <PhotoPicker photoId={photoId} onChange={setPhotoId} />
      </div>
      <div className="egsl-field">
        <label>Caption (optional)</label>
        <input
          className="egsl-input"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Sticky chicken bowls, Tuesday night"
        />
      </div>
      <div className="egsl-field">
        <label>Link to a recipe (optional)</label>
        <select
          className="egsl-input"
          value={linkedRecipeId}
          onChange={(e) => setLinkedRecipeId(e.target.value)}
        >
          <option value="">None</option>
          {state.recipes
            .filter((r) => !r.retired)
            .map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
        </select>
      </div>
      <button className="egsl-btn egsl-btn-primary egsl-btn-block" disabled={!photoId} onClick={save}>
        Save to photo log
      </button>
    </Sheet>
  );
}

function PhotoDetailSheet({
  entry,
  onClose,
  onConvertToRecipe,
}: {
  entry: PhotoLogEntry;
  onClose: () => void;
  onConvertToRecipe: (entry: PhotoLogEntry) => void;
}) {
  const { state, deletePhotoLogEntry } = useStore();
  const url = usePhotoObjectUrl(entry.id);
  const linkedRecipe = entry.linkedRecipeId
    ? state.recipes.find((r) => r.id === entry.linkedRecipeId)
    : undefined;

  return (
    <Sheet title={entry.caption || "Food photo"} onClose={onClose}>
      {url && (
        // eslint-disable-next-line @next/next/no-img-element -- blob: URLs from IndexedDB
        <img src={url} alt="" className="egsl-photo-detail-img" />
      )}

      <p className="egsl-faint" style={{ fontSize: 11.5, marginTop: 12 }}>
        {new Date(entry.createdAt).toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </p>

      {linkedRecipe ? (
        <p style={{ fontSize: 13.5 }}>
          From <strong>{linkedRecipe.name}</strong>
        </p>
      ) : (
        <button
          className="egsl-btn egsl-btn-secondary egsl-btn-block"
          style={{ marginTop: 8, marginBottom: 12 }}
          onClick={() => onConvertToRecipe(entry)}
        >
          📖 Save as a recipe
        </button>
      )}

      <button
        className="egsl-btn egsl-btn-ghost"
        style={{ color: "var(--egsl-berry)", marginTop: 8 }}
        onClick={async () => {
          await deletePhotoBlob(entry.id);
          deletePhotoLogEntry(entry.id);
          onClose();
        }}
      >
        Delete photo
      </button>
    </Sheet>
  );
}

export default function PhotosScreen() {
  const { state, updatePhotoLogEntry } = useStore();
  const [addOpen, setAddOpen] = useState(false);
  const [openEntry, setOpenEntry] = useState<PhotoLogEntry | null>(null);
  const [convertEntry, setConvertEntry] = useState<PhotoLogEntry | null>(null);

  return (
    <div style={{ paddingTop: 22 }}>
      <div className="egsl-row egsl-between egsl-wrap egsl-gap-10">
        <div>
          <p className="egsl-eyebrow">Photo Log</p>
          <h1 className="egsl-page-title">Your food story</h1>
        </div>
        <button className="egsl-btn egsl-btn-primary" onClick={() => setAddOpen(true)}>
          + Add photo
        </button>
      </div>
      <p className="egsl-page-sub">Every dinner worth remembering, in one scrollable album.</p>

      {state.photoLog.length === 0 ? (
        <div className="egsl-empty">No photos yet — snap tonight&apos;s dinner and start the log. 📸</div>
      ) : (
        <div className="egsl-photo-grid">
          {state.photoLog.map((entry) => (
            <PhotoThumb key={entry.id} entry={entry} onOpen={() => setOpenEntry(entry)} />
          ))}
        </div>
      )}

      {addOpen && <AddPhotoSheet onClose={() => setAddOpen(false)} />}

      {openEntry && (
        <PhotoDetailSheet
          entry={openEntry}
          onClose={() => setOpenEntry(null)}
          onConvertToRecipe={(entry) => {
            setConvertEntry(entry);
            setOpenEntry(null);
          }}
        />
      )}

      {convertEntry && (
        <AddRecipeSheet
          initialPhotoId={convertEntry.id}
          initialName={convertEntry.caption}
          onClose={() => setConvertEntry(null)}
          onCreated={(recipeId) => {
            updatePhotoLogEntry(convertEntry.id, { linkedRecipeId: recipeId });
          }}
        />
      )}
    </div>
  );
}
