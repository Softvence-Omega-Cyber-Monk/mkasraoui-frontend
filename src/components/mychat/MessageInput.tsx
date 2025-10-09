 





// // MessageInput.tsx
// import { useRef, useState } from "react";
// import { Send, Paperclip, Image } from "lucide-react";

// interface Props {
//   onSend: (content: string, file?: File) => Promise<void> | void;
//   isLoading?: boolean;
// }

// export default function MessageInput({ onSend, isLoading }: Props) {
//   const [value, setValue] = useState("");
//   const fileRef = useRef<HTMLInputElement | null>(null);
//   const imgRef = useRef<HTMLInputElement | null>(null);

//   const submit = async () => {
//     if (!value.trim()) return;
//     await onSend(value.trim());
//     setValue("");
//   };

//   const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     await onSend("", file);
//     e.target.value = "";
//   };

//   return (
//     <div className="border-t p-3">
//       <div className="flex items-center gap-2">
//         <button type="button" onClick={() => imgRef.current?.click()} className="p-2 rounded-full hover:bg-gray-100">
//           <Image className="h-5 w-5 text-gray-600" />
//         </button>

//         <button type="button" onClick={() => fileRef.current?.click()} className="p-2 rounded-full hover:bg-gray-100">
//           <Paperclip className="h-5 w-5 text-gray-600" />
//         </button>

//         <input type="file" ref={imgRef} hidden onChange={handleFile} accept="image/*" />
//         <input type="file" ref={fileRef} hidden onChange={handleFile} accept=".pdf,.doc,.docx,.txt,.xlsx,.xls" />

//         <input
//           type="text"
//           className="flex-1 rounded-full border bg-gray-50 px-4 py-2 focus:outline-none"
//           placeholder="Type a message..."
//           value={value}
//           onChange={(e) => setValue(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" && !e.shiftKey) {
//               e.preventDefault();
//               submit();
//             }
//           }}
//         />

//         <button onClick={submit} disabled={!value.trim() || isLoading} className="p-2 rounded-full bg-blue-600 text-white disabled:opacity-50">
//           <Send className="h-4 w-4" />
//         </button>
//       </div>
//     </div>
//   );
// }







// ChatInput.tsx
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
    console.log("🧾 Sending message:", { text, file });
    if (text.trim() || file) {
      onSend(text, file || undefined);
      setText("");
      setFile(null);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 border-t flex items-center gap-2 bg-white"
    >
      <input
        type="file"
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
    </form>
  );
}
