/**
 * RAJA'S WEAR — First-Visit Intro Animation
 * Plays a brief cinematic splash the first time a visitor lands on the homepage
 * in a given browser session. Skips silently on repeat visits/navigation.
 */
(function () {
  "use strict";

  // Only run on the homepage
  const path = window.location.pathname;
  const isHome = path.endsWith("index.html") || path === "/" || path.endsWith("/website by antigravity/") || /\/$/.test(path);
  if (!isHome) return;

  // Only play once per browser session
  if (sessionStorage.getItem("rw_intro_played")) return;
  sessionStorage.setItem("rw_intro_played", "true");

  const STYLES = `
    .rw-intro-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: #0c0d0f;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      animation: rw-intro-fade-out 0.9s ease forwards;
      animation-delay: 2.5s;
    }
    .rw-intro-overlay.rw-skip {
      animation-duration: 0.5s;
      animation-delay: 0s;
    }

    .rw-intro-shimmer {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 45%, rgba(197,160,89,0.14), transparent 60%);
      opacity: 0;
      animation: rw-shimmer-in 1.2s ease forwards;
      animation-delay: 0.1s;
    }

    .rw-intro-content {
      position: relative;
      text-align: center;
    }

    .rw-intro-monogram {
      width: 84px;
      height: 84px;
      margin: 0 auto 1.25rem;
      border: 1px solid rgba(197,160,89,0.5);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Georgia, 'Times New Roman', serif;
      font-size: 2.4rem;
      font-weight: 700;
      color: #c5a059;
      opacity: 0;
      transform: scale(0.6);
      animation: rw-monogram-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      animation-delay: 0.15s;
      box-shadow: 0 0 0 0 rgba(197,160,89,0.35);
    }

    .rw-intro-title {
      font-family: Georgia, 'Times New Roman', serif;
      font-size: clamp(1.6rem, 4vw, 2.6rem);
      letter-spacing: 0.28em;
      color: #f5f6f8;
      text-transform: uppercase;
      overflow: hidden;
      white-space: nowrap;
      margin: 0 auto;
      width: 0;
      animation: rw-title-reveal 1s steps(11, end) forwards;
      animation-delay: 0.75s;
      padding-right: 4px;
    }

    .rw-intro-sub {
      margin-top: 0.9rem;
      font-size: 0.72rem;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: #9a9ba3;
      opacity: 0;
      animation: rw-sub-fade-in 0.8s ease forwards;
      animation-delay: 1.7s;
    }

    .rw-intro-line {
      width: 0;
      height: 1px;
      background: #c5a059;
      margin: 1.1rem auto 0;
      animation: rw-line-grow 0.7s ease forwards;
      animation-delay: 1.5s;
    }

    .rw-intro-skip {
      position: absolute;
      bottom: 32px;
      left: 50%;
      transform: translateX(-50%);
      background: none;
      border: 1px solid rgba(255,255,255,0.2);
      color: #9a9ba3;
      font-size: 0.68rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 8px 18px;
      border-radius: 999px;
      cursor: pointer;
      opacity: 0;
      animation: rw-sub-fade-in 0.8s ease forwards;
      animation-delay: 1.9s;
      transition: color 0.2s ease, border-color 0.2s ease;
    }
    .rw-intro-skip:hover { color: #c5a059; border-color: #c5a059; }

    @keyframes rw-monogram-in {
      0% { opacity: 0; transform: scale(0.6); }
      60% { opacity: 1; transform: scale(1.06); box-shadow: 0 0 0 14px rgba(197,160,89,0); }
      100% { opacity: 1; transform: scale(1); box-shadow: 0 0 0 0 rgba(197,160,89,0); }
    }
    @keyframes rw-title-reveal {
      from { width: 0; }
      to { width: 11ch; }
    }
    @keyframes rw-line-grow {
      from { width: 0; }
      to { width: 120px; }
    }
    @keyframes rw-sub-fade-in {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes rw-shimmer-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes rw-intro-fade-out {
      from { opacity: 1; visibility: visible; }
      to { opacity: 0; visibility: hidden; pointer-events: none; }
    }

    body.rw-intro-lock { overflow: hidden; }

    @media (max-width: 480px) {
      .rw-intro-title { letter-spacing: 0.18em; }
      .rw-intro-skip { bottom: 24px; }
    }
  `;

  function init() {
    const style = document.createElement("style");
    style.textContent = STYLES;
    document.head.appendChild(style);

    document.body.classList.add("rw-intro-lock");

    const overlay = document.createElement("div");
    overlay.className = "rw-intro-overlay";
    overlay.setAttribute("role", "presentation");
    overlay.innerHTML = `
      <div class="rw-intro-shimmer"></div>
      <div class="rw-intro-content">
        <div class="rw-intro-monogram">R</div>
        <div class="rw-intro-title">RAJA'S WEAR</div>
        <div class="rw-intro-line"></div>
        <div class="rw-intro-sub">Savile Row &nbsp;•&nbsp; Milan &nbsp;•&nbsp; New York</div>
      </div>
      <button type="button" class="rw-intro-skip">Skip Intro</button>
    `;

    document.body.appendChild(overlay);

    function finish() {
      document.body.classList.remove("rw-intro-lock");
      setTimeout(() => overlay.remove(), 950);
    }

    overlay.addEventListener("animationend", (e) => {
      if (e.target === overlay) finish();
    });

    overlay.querySelector(".rw-intro-skip").addEventListener("click", () => {
      overlay.classList.add("rw-skip");
      finish();
    });

    // Safety net in case animationend doesn't fire for any reason
    setTimeout(finish, 4200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
