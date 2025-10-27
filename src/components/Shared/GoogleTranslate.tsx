// import { useEffect } from "react";

// const GoogleTranslate = () => {
//   useEffect(() => {
//     // Prevent multiple loads
//     if (document.getElementById("google-translate-script")) return;

//     // Inject Google Translate script
//     const script = document.createElement("script");
//     script.id = "google-translate-script";
//     script.src =
//       "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
//     script.async = true;
//     document.body.appendChild(script);

//     // Init callback
//     (window as any).googleTranslateElementInit = () => {
//       new (window as any).google.translate.TranslateElement(
//         {
//           pageLanguage: "en",
//           includedLanguages: "en,fr,de,es,it,pt,zh-CN,ja,ru,bn",
//           layout: (window as any).google.translate.TranslateElement.InlineLayout
//             .SIMPLE,
//           autoDisplay: false,
//         },
//         "google_translate_element"
//       );

//       // Hide Google top frame and logos after render
//       const interval = setInterval(() => {
//         const iframe = document.querySelector("iframe.skiptranslate") as HTMLIFrameElement;
//         if (iframe) {
//           iframe.style.display = "none";
//         }

//         const googleToolbar = document.querySelector(".goog-te-banner-frame");
//         if (googleToolbar) {
//           (googleToolbar as HTMLElement).style.display = "none";
//         }

//         const body = document.querySelector("body");
//         if (body) {
//           body.style.top = "0px";
//         }
//       }, 500);

//       // Stop checking after 5 seconds
//       setTimeout(() => clearInterval(interval), 5000);
//     };
//   }, []);

//   return (
//     <div className="relative inline-block">
//       <div
//         id="google_translate_element"
//         className="rounded-lg border border-gray-200 bg-white/90 text-sm font-medium text-gray-700 flex items-center gap-2 px-3 py-1.5 shadow-sm hover:bg-white transition-all duration-300 cursor-pointer"
//       >
//         🌐 <span className="hidden sm:inline">Translate</span>
//       </div>

//       {/* Hide ugly Google Translate styles */}
//       <style>{`
//         .goog-te-banner-frame.skiptranslate,
//         .goog-te-gadget-icon,
//         .goog-te-menu-value span:first-child,
//         .goog-logo-link,
//         .goog-te-gadget span {
//           display: none !important;
//         }

//         .goog-te-gadget {
//           color: transparent !important;
//           font-size: 0 !important;
//         }

//         #google_translate_element select {
//           background: transparent;
//           color: #333;
//           border: none;
//           outline: none;
//           font-size: 14px;
//           cursor: pointer;
//           padding: 4px 6px;
//         }

//         #google_translate_element select option {
//           color: #333;
//         }

//         body {
//           top: 0 !important;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default GoogleTranslate;

// components/GoogleTranslate.tsx
import { useEffect } from "react";

const GoogleTranslate = () => {
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_KEY;

    if (document.getElementById("google-translate-script")) return;

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = `https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit&key=${apiKey}`;
    script.async = true;
    document.body.appendChild(script);

    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,fr,de,es,it,pt,zh-CN,ja,ru",
          layout: (window as any).google.translate.TranslateElement.InlineLayout
            .SIMPLE,
        },
        "google_translate_element",
      );
    };
  }, []);

  return (
    <div
      id="google_translate_element"
      className="google-translate-box"
      style={{
        background: "rgba(255, 255, 255, 0.7)",
        borderRadius: "8px",
        padding: "2px 6px",
        border: "1px solid rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "13px",
        cursor: "pointer",
        width: "fit-content",
      }}
    >
      🌐 <span style={{ fontWeight: 600 }}>EN/FR</span>
    </div>
  );
};

export default GoogleTranslate;
