"use client";
import { useState } from "react";

export default function CloudinaryUploader() {
  const [url, setUrl] = useState<string>("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(bytes)));
    const dataUrl = `data:${file.type};base64,${base64}`;

    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file: dataUrl }),
    });

    const data = await res.json();
    if (data.url) setUrl(data.url);
  }

  return (
    <div className="p-4 border rounded-lg space-y-3">
      <input type="file" accept="image/*" onChange={handleUpload} />
      {url && (
        <div>
          <p className="text-sm break-all">{url}</p>
          <img src={url} alt="Uploaded" className="rounded-lg mt-2 max-w-xs" />
        </div>
      )}
    </div>
  );
}
