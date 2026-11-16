"use client";

import { useState } from "react";
import { exportAll, importAll, resetAll, useStored } from "../lib/store";

export default function SettingsView() {
  const [stretch, setStretch] = useStored("link:stretch", "");
  const [msg, setMsg] = useState("");

  function download() {
    const blob = new Blob([exportAll()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `life-curriculum-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMsg("Backup downloaded.");
  }
  async function restore(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const n = importAll(await f.text());
      setMsg(`Restored ${n} items.`);
    } catch {
      setMsg("That file isn't a curriculum backup.");
    }
  }
  return (
    <div>
      <h1>Settings and backup</h1>
      <section className="lc-card">
        <h2>My stretching video</h2>
        <p className="lc-note">Paste the link to your stretching and lymphatic drainage video. Every morning checklist will link to it.</p>
        <label className="lc-field">Video link
          <input type="url" inputMode="url" placeholder="https://www.youtube.com/watch?v=…" value={stretch} onChange={(e) => setStretch(e.target.value.trim())} />
        </label>
      </section>
      <section className="lc-card">
        <h2>Back up your logs</h2>
        <p className="lc-note">Your checkmarks and logs live only in this browser on this device. Download a backup now and then, and use it to move to a new phone.</p>
        <div className="lc-row">
          <button type="button" className="lc-btn" onClick={download}>Download backup</button>
          <label className="lc-btn lc-btn-ghost">Restore from file
            <input type="file" accept="application/json" onChange={restore} hidden />
          </label>
        </div>
        {msg && <p role="status" className="lc-note">{msg}</p>}
      </section>
      <section className="lc-card">
        <h2>Start over</h2>
        <p className="lc-note">Deletes every checkmark, log and setting in this browser. Download a backup first.</p>
        <button type="button" className="lc-btn lc-btn-danger" onClick={() => { if (window.confirm("Delete everything saved in this browser?")) { resetAll(); setMsg("Everything cleared."); } }}>Delete all my data</button>
      </section>
    </div>
  );
}
