export const translateText = async (text: string, targetLang: string) => {
  const API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_KEY;

  if (!API_KEY) {
    console.error("❌ Google Translate API key missing.");
    return text;
  }

  try {
    const res = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          target: targetLang,
          format: "text",
        }),
      },
    );

    const data = await res.json();
    return data?.data?.translations?.[0]?.translatedText || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
};

// export const translateText = async (text: string, targetLang: string) => {
//   const API_KEY = process.env.REACT_APP_GOOGLE_TRANSLATE_KEY;

//   const response = await fetch(
//     `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         q: text,
//         target: targetLang,
//         format: "text",
//       }),
//     },
//   );

//   const data = await response.json();
//   return data?.data?.translations?.[0]?.translatedText || "";
// };
