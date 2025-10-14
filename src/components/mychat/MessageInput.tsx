

import { useState } from "react";

interface Props {
  onSend: (content: string, file?: File) => void;
  disabled?: boolean;
}
export default function MessageInput({ onSend, disabled }: Props) {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() || file) {
      onSend(file ? "[image]" : text, file || undefined); // ✅ send text placeholder for image
      setText("");
      setFile(null); // removes preview after send
    }
  };
  
  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 border-t flex flex-col bg-white gap-2"
    >
      {/* ✅ Show preview before sending */}
      {file && (
        <div className="relative">
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="h-32 rounded-lg object-cover"
          />
          <button
            type="button"
            onClick={() => setFile(null)}
            className="absolute top-1 right-1 bg-black/50 text-white rounded-full px-2 py-1 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer text-gray-500">
          📎
        </label>

        <input
          type="text"
          value={text}
          disabled={disabled}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-2 outline-none"
        />
        <button
          type="submit"
          disabled={disabled}
          className="bg-blue-600 text-white px-4 py-2 rounded-full"
        >
          Send
        </button>
      </div>
    </form>
  );
}

