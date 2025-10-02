import React, { useRef, useState } from "react";
import { Send, Paperclip, Image } from "lucide-react";

interface Props {
  onSend: (content: string, file?: File) => Promise<void> | void;
  isLoading?: boolean;
}

export default function MessageInput({ onSend, isLoading }: Props) {
  const [value, setValue] = useState("");
  const fileRef = useRef<HTMLInputElement | null>(null);
  const imgRef = useRef<HTMLInputElement | null>(null);

  const submit = async () => {
    if (!value.trim()) return;
    await onSend(value.trim());
    setValue("");
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await onSend("", file);
    e.target.value = "";
  };

  return (
    <div className="border-t border-[#BDBDBE] bg-red-50 p-4">
      <div className="flex items-center space-x-2">
        <button onClick={() => imgRef.current?.click()} className="rounded p-2 hover:bg-gray-100">
          <Image className="h-5 w-5" />
        </button>
        <button onClick={() => fileRef.current?.click()} className="rounded p-2 hover:bg-gray-100">
          <Paperclip className="h-5 w-5" />
        </button>

        <input type="file" ref={fileRef} hidden onChange={handleFile} accept=".pdf,.doc,.docx,.txt,.xlsx,.xls" />
        <input type="file" ref={imgRef} hidden onChange={handleFile} accept="image/*" />

        <input
          className="flex-1 rounded-full border-0 bg-gray-50 px-4 py-2 focus:outline-none"
          placeholder="Write a message..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
        />

        <button onClick={submit} disabled={!value.trim() || isLoading} className="rounded-full bg-blue-600 p-2 text-white">
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}



// // src/components/Chat/MessageInput.tsx
// import React, { useRef, useState } from "react";
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
//     <div className="border-t border-[#BDBDBE] bg-red-50 p-4">
//       <div className="flex items-center space-x-2">
//         <button
//           onClick={() => imgRef.current?.click()}
//           className="rounded p-2 hover:bg-gray-100"
//         >
//           <Image className="h-5 w-5" />
//         </button>
//         <button
//           onClick={() => fileRef.current?.click()}
//           className="rounded p-2 hover:bg-gray-100"
//         >
//           <Paperclip className="h-5 w-5" />
//         </button>

//         <input
//           type="file"
//           ref={fileRef}
//           hidden
//           onChange={handleFile}
//           accept=".pdf,.doc,.docx,.txt,.xlsx,.xls"
//         />
//         <input
//           type="file"
//           ref={imgRef}
//           hidden
//           onChange={handleFile}
//           accept="image/*"
//         />

//         <input
//           className="flex-1 rounded-full border-0 bg-gray-50 px-4 py-2 focus:outline-none"
//           placeholder="Write a message..."
//           value={value}
//           onChange={(e) => setValue(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" && !e.shiftKey) {
//               e.preventDefault();
//               submit();
//             }
//           }}
//         />
//         <button
//           onClick={submit}
//           disabled={!value.trim() || isLoading}
//           className="rounded-full bg-blue-600 p-2 text-white"
//         >
//           <Send className="h-4 w-4" />
//         </button>
//       </div>
//     </div>
//   );
// }
