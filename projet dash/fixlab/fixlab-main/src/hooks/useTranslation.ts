import { useState, useEffect } from "react";
import en from "../locales/en.json";
import fr from "../locales/fr.json";

const translations = { en, fr };

export const useTranslation = () => {
  const [lang, setLangState] = useState<"en" | "fr">(() => {
    const stored = localStorage.getItem("lang");
    return stored === "fr" || stored === "en" ? stored : "en";
  });

  const setLang = (newLang: "en" | "fr") => {
    localStorage.setItem("lang", newLang);
    setLangState(newLang);
    // Dispatch standard window event so all hook consumers sync in real-time
    window.dispatchEvent(new Event("languagechange"));
  };

  useEffect(() => {
    const handleLanguageChange = () => {
      const current = localStorage.getItem("lang") as "en" | "fr" | null;
      if (current === "fr" || current === "en") {
        setLangState(current);
      }
    };

    window.addEventListener("languagechange", handleLanguageChange);
    return () => {
      window.removeEventListener("languagechange", handleLanguageChange);
    };
  }, []);

  const t = (path: string): string => {
    const keys = path.split(".");
    let result: any = translations[lang];
    
    for (const key of keys) {
      result = result?.[key];
    }
    
    if (typeof result === "string") {
      return result;
    }
    
    // Return key as fallback representation
    return path;
  };

  return { t, setLang, lang };
};
