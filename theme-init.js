(() => {
  const themes = ["day", "sunset", "forest", "rain", "night"];
  const valid = (id) => themes.includes(id);
  function readSavedTheme() {
    try {
      for (const part of document.cookie.split(";")) {
        const cookie = part.trim();
        if (cookie.startsWith("brand-theme=")) {
          const value = decodeURIComponent(cookie.slice("brand-theme=".length));
          if (valid(value)) return value;
        }
      }
    } catch (_) { /* Ignore cookie access errors. */ }
    return null;
  }
  function resolveTheme() {
    const saved = readSavedTheme();
    if (saved) return saved;
    try {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "night";
    } catch (_) { /* Continue to time-based default. */ }
    const hour = new Date().getHours();
    return hour >= 7 && hour < 19 ? "day" : "night";
  }
  function saveTheme(theme) {
    if (!valid(theme)) return;
    try {
      const secure = window.location.protocol === "https:" ? "; Secure" : "";
      document.cookie = `brand-theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
    } catch (_) { /* Theme still works for this page view. */ }
  }
  window.portfolioTheme = { themes, readSavedTheme, resolveTheme, saveTheme };
  document.documentElement.dataset.theme = resolveTheme();
})();
