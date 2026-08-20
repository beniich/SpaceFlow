import { useEffect } from "react";

const SHORTCUTS = {
  orbit: "o", pan: "p", zoom: "z", walk: "w",
  hud: "h", wireframe: "f", isolate: "i", xray: "x", shaded: "s",
};

export function useKeyboardShortcuts(handlers) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = e.key.toLowerCase();
      const action = Object.entries(SHORTCUTS).find(([, k]) => k === key)?.[0];
      if (action && handlers[action]) {
        e.preventDefault();
        handlers[action]();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handlers]);
}
