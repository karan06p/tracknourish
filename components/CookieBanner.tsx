"use client";
import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const accepted = localStorage.getItem("cookieAccepted");
      if (!accepted) setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieAccepted", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="glass-card pointer-events-auto flex flex-col md:flex-row items-center gap-4 px-6 py-4 rounded-2xl shadow-lg border border-primary/10 bg-white/80 backdrop-blur-md max-w-xl w-full mx-4">
        <span className="text-gray-700 text-sm flex-1">
          This app uses only necessary cookies to ensure you get the best experience.{" "}
          <span className="text-primary font-medium">No tracking or marketing cookies are used.</span>
        </span>
        <button
          onClick={handleAccept}
          className="mt-2 md:mt-0 px-5 py-2 rounded-full bg-primary text-white font-semibold shadow hover:bg-primary/90 transition-colors"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}