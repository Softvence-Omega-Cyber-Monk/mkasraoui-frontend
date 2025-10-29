import { useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export const LANGUAGES = [
  { code: "en", label: "English", flag: "gb" },
  { code: "fr", label: "French", flag: "fr" },
  { code: "es", label: "Spanish", flag: "es" },
  { code: "de", label: "German", flag: "de" },
  { code: "it", label: "Italian", flag: "it" },
];

const GoogleTranslate: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");

  // Load Google Translate script
  useEffect(() => {
    if ((window as any).googleTranslateLoaded) return;

    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: LANGUAGES.map((l) => l.code).join(","),
          layout: (window as any).google.translate.TranslateElement.InlineLayout
            .SIMPLE,
        },
        "google_translate_element",
      );
      (window as any).googleTranslateLoaded = true;
    };
  }, []);

  // Change language reliably
  const handleChange = (langCode: string) => {
    setCurrentLang(langCode);
    setOpen(false);

    const iframe = document.querySelector<HTMLIFrameElement>(
      "iframe.goog-te-menu-frame",
    );
    if (!iframe) return;

    try {
      const innerDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!innerDoc) return;

      const langElement = innerDoc.querySelector<HTMLDivElement>(
        `div.goog-te-menu2-item span.text:contains(${LANGUAGES.find((l) => l.code === langCode)?.label})`,
      );
      langElement?.click();
    } catch (e) {
      console.warn("Google Translate iframe access blocked (cross-origin).");
    }
  };

  const selectedLang = LANGUAGES.find((l) => l.code === currentLang);

  return (
    <div className="translate-dropdown relative">
      {/* Dropdown Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition hover:bg-gray-50"
      >
        {selectedLang && (
          <img
            src={`https://flagcdn.com/w20/${selectedLang.flag}.png`}
            width={20}
            height={15}
            alt={selectedLang.label}
            className="rounded-sm"
          />
        )}
        <span>{selectedLang?.label}</span>
        <FiChevronDown
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-36 rounded-lg border border-gray-200 bg-white shadow-lg">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleChange(lang.code)}
              className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm transition hover:bg-gray-100"
            >
              <img
                src={`https://flagcdn.com/w20/${lang.flag}.png`}
                width={20}
                height={15}
                alt={lang.label}
                className="rounded-sm"
              />
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Hidden Google Translate container */}
      <div
        id="google_translate_element"
        style={{ position: "absolute", left: "-9999px", top: 0 }}
      />
    </div>
  );
};

export default GoogleTranslate;

// import { useEffect } from "react";

// const GoogleTranslate = () => {
//   useEffect(() => {
//     const apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_KEY;

//     if (document.getElementById("google-translate-script")) return;

//     const script = document.createElement("script");
//     script.id = "google-translate-script";
//     script.src = `https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit&key=${apiKey}`;
//     script.async = true;
//     document.body.appendChild(script);

//     (window as any).googleTranslateElementInit = () => {
//       new (window as any).google.translate.TranslateElement(
//         {
//           pageLanguage: "en",
//           includedLanguages: "en,fr,de,es,it,pt,zh-CN,ja,ru",
//           layout: (window as any).google.translate.TranslateElement.InlineLayout
//             .SIMPLE,
//         },
//         "google_translate_element",
//       );
//     };
//   }, []);

//   return (
//     <div
//       id="google_translate_element"
//       className="google-translate-box"
//       style={{
//         background: "rgba(255, 255, 255, 0.7)",
//         borderRadius: "8px",
//         padding: "2px 6px",
//         border: "1px solid rgba(0,0,0,0.1)",
//         display: "flex",
//         alignItems: "center",
//         gap: "6px",
//         fontSize: "13px",
//         cursor: "pointer",
//         width: "fit-content",
//       }}
//     >
//       🌐 <span style={{ fontWeight: 600 }}>EN/FR</span>
//     </div>
//   );
// };

// export default GoogleTranslate;
