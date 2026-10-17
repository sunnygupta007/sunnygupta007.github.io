(() => {
  const themeSystem = window.portfolioTheme;
  const themeButton = document.querySelector("#theme-cycle");
  const root = document.documentElement;

  if (themeButton && themeSystem) {
    const labels = { day: "Day", sunset: "Evening sunset", forest: "Foggy forest", rain: "Rain", night: "Night" };
    function setTheme(theme) {
      const index = themeSystem.themes.indexOf(theme);
      if (index < 0) return;
      root.dataset.theme = theme;
      const nextTheme = themeSystem.themes[(index + 1) % themeSystem.themes.length];
      const accessibleLabel = `${labels[theme]} theme (${index + 1} of ${themeSystem.themes.length}). Switch to ${labels[nextTheme]}.`;
      themeButton.setAttribute("aria-label", accessibleLabel);
      themeButton.setAttribute("title", accessibleLabel);
      const themeColor = getComputedStyle(root).getPropertyValue("--paper").trim();
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", themeColor);
    }
    setTheme(root.dataset.theme || "day");
    themeButton.hidden = false;
    themeButton.addEventListener("click", () => {
      const currentIndex = themeSystem.themes.indexOf(root.dataset.theme);
      const nextTheme = themeSystem.themes[(currentIndex + 1) % themeSystem.themes.length];
      setTheme(nextTheme);
      themeSystem.saveTheme(nextTheme);
    });
    window.addEventListener("focus", () => {
      const saved = themeSystem.readSavedTheme();
      if (saved) setTheme(saved);
    });
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -40px 0px", threshold: 0.08 });
  reveals.forEach((el) => observer.observe(el));
})();
