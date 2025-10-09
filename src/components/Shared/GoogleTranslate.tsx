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
          includedLanguages: "en,fr",
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
