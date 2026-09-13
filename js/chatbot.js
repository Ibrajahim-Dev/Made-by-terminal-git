/**
 * RAJA'S WEAR — Virtual Concierge Chatbot
 * Client-side, rule-based FAQ assistant. No external API required.
 * Answers questions about products, sizing, shipping, appointments, care & policies
 * using the site's own product catalog (RAJA_PRODUCTS, when available) and content.
 */
(function () {
  "use strict";

  /* ---------------------------------------------------------------------
     1. KNOWLEDGE BASE
     --------------------------------------------------------------------- */
  const BRAND = "Raja's Wear";

  const SIZE_GUIDE = `Here's a quick fit guide:
• 38R–40R — Slim to average build, 5'8"–5'11"
• 42R–44R — Regular to athletic build, 5'10"–6'1"
• 44L–46L — Broader/taller build, 6'1"+
Every suit lists its exact size run on the product page, and jacket sizing follows standard UK/US chest sizing (e.g. 40R = 40" chest, Regular length). For a precise fit, our Mayfair concierge offers a complimentary virtual or in-person measurement session — just say "book a fitting" and I'll point you there.`;

  const SHIPPING_INFO = `We offer complimentary worldwide DHL Express shipping on orders over $200 (a flat rate applies below that). In-stock ready-to-wear pieces are dispatched within 24 hours and typically arrive in 2–4 business days, with real-time tracking by SMS and email.`;

  const RETURNS_INFO = `Ready-to-wear pieces can be returned or exchanged within 30 days of delivery, provided they're unworn with tags attached. Bespoke and made-to-measure garments are final sale, since they're cut specifically to your measurements. For a return label, message our concierge team via the Contact page.`;

  const APPOINTMENT_INFO = `I'd love to help you arrange that. Our Mayfair flagship (14 Savile Row, London) offers private fitting appointments Monday–Saturday, 10:00–19:00, and Sunday by request. The fastest way to book is the "Arrange Your Consultation" form on our Contact page — pick your preferred date and one of our fitting directors will confirm within 24 hours.`;

  const FABRIC_CARE = `Most of our tailoring is cut from Super 150s merino wool, British barathea, or pure Irish linen depending on the piece — check the "Fabric" section on any product page for specifics. As a rule: specialist dry clean only, steam press gently, and store on a contoured cedar hanger to preserve the shoulder line.`;

  const CONTACT_INFO = `You can reach the concierge team at:
📍 14 Savile Row, Mayfair, London W1S 3JN
✉️ concierge@rajaswear.com
📞 +44 (0) 20 7946 0912 (Mon–Sat, 10:00–19:00 GMT)
Or just fill out the form on our Contact page and we'll get back to you within 24 business hours.`;

  const GREETINGS = [
    "hello", "hi", "hey", "good morning", "good afternoon", "good evening", "yo", "hiya"
  ];

  const QUICK_REPLIES = [
    "Shop suits",
    "Sizing help",
    "Shipping & returns",
    "Book a fitting",
    "Talk to a human"
  ];

  /* ---------------------------------------------------------------------
     2. PRODUCT LOOKUP HELPERS (uses RAJA_PRODUCTS from products.js if present)
     --------------------------------------------------------------------- */
  function getProducts() {
    return typeof RAJA_PRODUCTS !== "undefined" && Array.isArray(RAJA_PRODUCTS) ? RAJA_PRODUCTS : [];
  }

  function getCategories() {
    const products = getProducts();
    return [...new Set(products.map((p) => p.category).filter(Boolean))];
  }

  function formatPriceRangeForCategory(category) {
    const items = getProducts().filter(
      (p) => p.category && p.category.toLowerCase() === category.toLowerCase()
    );
    if (!items.length) return null;
    const prices = items.map((p) => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const names = items.slice(0, 4).map((p) => p.name);
    return { count: items.length, min, max, names };
  }

  function findProductsByKeyword(keyword) {
    const kw = keyword.toLowerCase();
    return getProducts().filter(
      (p) =>
        p.name.toLowerCase().includes(kw) ||
        (p.category && p.category.toLowerCase().includes(kw)) ||
        (p.subCategory && p.subCategory.toLowerCase().includes(kw))
    );
  }

  function productSummaryLine(p) {
    return `• ${p.name} — $${p.price}${p.oldPrice ? ` (was $${p.oldPrice})` : ""}`;
  }

  /* ---------------------------------------------------------------------
     3. RESPONSE ENGINE
     --------------------------------------------------------------------- */
  function getResponse(rawInput) {
    const input = rawInput.trim().toLowerCase();
    if (!input) return "Could you tell me a little more about what you're looking for?";

    // Greeting
    if (GREETINGS.some((g) => input === g || input.startsWith(g + " ") || input.startsWith(g + "!"))) {
      return `Good day. Welcome to ${BRAND} — I'm your virtual concierge. I can help with sizing, shipping, appointments, care instructions, or finding a garment. What can I help you with?`;
    }

    // Thanks
    if (/\b(thanks|thank you|cheers|appreciate)\b/.test(input)) {
      return "You're very welcome. Is there anything else I can help you with today?";
    }

    // Human handoff
    if (/\b(human|real person|representative|agent|speak to someone|talk to someone)\b/.test(input)) {
      return `Of course — for direct human assistance, ${CONTACT_INFO}`;
    }

    // Sizing
    if (/\b(size|sizing|fit|measurement|measure)\b/.test(input)) {
      return SIZE_GUIDE;
    }

    // Shipping
    if (/\b(ship|shipping|delivery|deliver|arrive|dispatch)\b/.test(input)) {
      return SHIPPING_INFO;
    }

    // Returns / exchanges
    if (/\b(return|exchange|refund|cancel)\b/.test(input)) {
      return RETURNS_INFO;
    }

    // Appointments / fittings
    if (/\b(appointment|fitting|book|consultation|schedule|visit|mayfair|store|showroom)\b/.test(input)) {
      return APPOINTMENT_INFO;
    }

    // Fabric / care
    if (/\b(fabric|material|wool|linen|care|clean|wash|iron|press)\b/.test(input)) {
      return FABRIC_CARE;
    }

    // Contact info
    if (/\b(contact|email|phone|call|address|location|reach)\b/.test(input)) {
      return CONTACT_INFO;
    }

    // Price / budget queries
    if (/\b(price|cost|how much|budget|expensive|cheap)\b/.test(input)) {
      const categories = getCategories();
      if (categories.length) {
        const lines = categories
          .map((c) => {
            const r = formatPriceRangeForCategory(c);
            return r ? `• ${c}: $${r.min}–$${r.max}` : null;
          })
          .filter(Boolean);
        return `Here's a rough sense of our pricing by category:\n${lines.join("\n")}\nAsk me about a specific category (e.g. "tuxedos" or "accessories") and I can point you to specific pieces.`;
      }
      return "Our tailoring generally ranges from $135 for accessories up to $1,150+ for signature tuxedos. What category are you interested in?";
    }

    // Category / product search — check against known categories first
    const categories = getCategories();
    const matchedCategory = categories.find((c) => input.includes(c.toLowerCase()));
    if (matchedCategory) {
      const r = formatPriceRangeForCategory(matchedCategory);
      if (r) {
        return `We have ${r.count} pieces in ${matchedCategory}, ranging from $${r.min} to $${r.max}. A few favorites:\n${r.names
          .map((n) => `• ${n}`)
          .join("\n")}\nYou can browse the full range under the Shop page, filtered to ${matchedCategory}.`;
      }
    }

    // Generic keyword product search (suit, tuxedo, blazer, shirt, etc.)
    const productKeywords = ["suit", "tuxedo", "blazer", "shirt", "trouser", "cufflink", "tie", "cummerbund", "wedding"];
    const hitKeyword = productKeywords.find((k) => input.includes(k));
    if (hitKeyword) {
      const matches = findProductsByKeyword(hitKeyword);
      if (matches.length) {
        return `Here's what we have along those lines:\n${matches
          .slice(0, 5)
          .map(productSummaryLine)
          .join("\n")}\nWant details on any of these, or should I point you to our full catalog?`;
      }
    }

    // Bespoke / custom
    if (/\b(bespoke|custom|tailor made|made to measure)\b/.test(input)) {
      return "Beyond our ready-to-wear line, we offer full bespoke commissioning at our Mayfair atelier — hand-cut to your measurements with your choice of cloth. This typically starts with a private consultation. Would you like me to point you to the booking form?";
    }

    // Wishlist / cart / checkout help
    if (/\b(cart|bag|checkout|order status|track my order|wishlist)\b/.test(input)) {
      return `You can review your selections any time via the shopping bag icon in the header, and complete checkout on the Cart page. For an existing order, our concierge team can look up tracking — just reach out via the Contact page with your order reference.`;
    }

    // Fallback
    return `I don't have a ready answer for that just yet, but our concierge team can help directly. You can reach them at ${CONTACT_INFO}\nOtherwise, try asking me about sizing, shipping, appointments, fabric care, or a specific product category like "suits" or "tuxedos".`;
  }

  /* ---------------------------------------------------------------------
     4. WIDGET MARKUP + STYLES
     --------------------------------------------------------------------- */
  const STYLES = `
    .rw-chat-launcher {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: var(--accent-gold, #c5a059);
      color: #0c0d0f;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 20px rgba(0,0,0,0.35);
      z-index: 9998;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .rw-chat-launcher:hover { transform: translateY(-2px); box-shadow: 0 10px 26px rgba(0,0,0,0.4); }
    .rw-chat-launcher svg { width: 26px; height: 26px; }
    .rw-chat-launcher .rw-chat-close-icon { display: none; }
    .rw-chat-launcher.open .rw-chat-bubble-icon { display: none; }
    .rw-chat-launcher.open .rw-chat-close-icon { display: block; }

    .rw-chat-panel {
      position: fixed;
      bottom: 96px;
      right: 24px;
      width: 360px;
      max-width: calc(100vw - 32px);
      height: 500px;
      max-height: calc(100vh - 140px);
      background: var(--bg-card, #13151c);
      border: 1px solid var(--border-subtle, rgba(255,255,255,0.08));
      border-radius: var(--radius-md, 10px);
      display: none;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 16px 48px rgba(0,0,0,0.45);
      z-index: 9998;
      font-family: inherit;
    }
    .rw-chat-panel.open { display: flex; }

    .rw-chat-header {
      background: var(--accent-gold, #c5a059);
      color: #0c0d0f;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .rw-chat-header-title { font-weight: 700; font-size: 0.95rem; }
    .rw-chat-header-sub { font-size: 0.72rem; opacity: 0.8; }
    .rw-chat-header-close {
      background: none; border: none; cursor: pointer; color: #0c0d0f;
      font-size: 1.1rem; line-height: 1; padding: 4px;
    }

    .rw-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: var(--bg-surface, #0f1117);
    }
    .rw-msg { max-width: 85%; padding: 9px 12px; border-radius: 12px; font-size: 0.86rem; line-height: 1.5; white-space: pre-line; }
    .rw-msg-bot { align-self: flex-start; background: var(--bg-card, #1b1e27); color: var(--text-primary, #f5f6f8); border-bottom-left-radius: 3px; }
    .rw-msg-user { align-self: flex-end; background: var(--accent-gold, #c5a059); color: #0c0d0f; border-bottom-right-radius: 3px; }

    .rw-chat-quick-replies { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 14px 10px; background: var(--bg-surface, #0f1117); }
    .rw-quick-reply-btn {
      font-size: 0.75rem;
      padding: 6px 10px;
      border-radius: 999px;
      border: 1px solid var(--border-accent, var(--accent-gold, #c5a059));
      background: transparent;
      color: var(--accent-gold, #c5a059);
      cursor: pointer;
      transition: background 0.15s ease, color 0.15s ease;
    }
    .rw-quick-reply-btn:hover { background: var(--accent-gold, #c5a059); color: #0c0d0f; }

    .rw-chat-input-row {
      display: flex;
      gap: 8px;
      padding: 12px;
      border-top: 1px solid var(--border-subtle, rgba(255,255,255,0.08));
      background: var(--bg-card, #13151c);
    }
    .rw-chat-input {
      flex: 1;
      padding: 9px 12px;
      border-radius: 8px;
      border: 1px solid var(--border-subtle, rgba(255,255,255,0.12));
      background: var(--bg-surface, #0f1117);
      color: var(--text-primary, #f5f6f8);
      font-size: 0.85rem;
      outline: none;
    }
    .rw-chat-input:focus { border-color: var(--accent-gold, #c5a059); }
    .rw-chat-send-btn {
      background: var(--accent-gold, #c5a059);
      color: #0c0d0f;
      border: none;
      border-radius: 8px;
      padding: 0 14px;
      font-weight: 700;
      cursor: pointer;
      font-size: 0.85rem;
    }
    .rw-chat-send-btn:hover { background: var(--accent-gold-hover, #d8b26e); }

    .rw-typing { display: flex; gap: 4px; align-self: flex-start; padding: 9px 12px; }
    .rw-typing span {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--text-muted, #9a9ba3);
      animation: rw-bounce 1.2s infinite ease-in-out;
    }
    .rw-typing span:nth-child(2) { animation-delay: 0.15s; }
    .rw-typing span:nth-child(3) { animation-delay: 0.3s; }
    @keyframes rw-bounce { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-4px); opacity: 1; } }

    @media (max-width: 480px) {
      .rw-chat-panel { right: 16px; left: 16px; width: auto; bottom: 88px; }
      .rw-chat-launcher { right: 16px; bottom: 16px; }
    }
  `;

  const BUBBLE_ICON = `<svg class="rw-chat-bubble-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`;
  const CLOSE_ICON = `<svg class="rw-chat-close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

  function buildWidget() {
    const style = document.createElement("style");
    style.textContent = STYLES;
    document.head.appendChild(style);

    const launcher = document.createElement("button");
    launcher.className = "rw-chat-launcher";
    launcher.setAttribute("aria-label", "Open concierge chat");
    launcher.innerHTML = BUBBLE_ICON + CLOSE_ICON;

    const panel = document.createElement("div");
    panel.className = "rw-chat-panel";
    panel.innerHTML = `
      <div class="rw-chat-header">
        <div>
          <div class="rw-chat-header-title">${BRAND} Concierge</div>
          <div class="rw-chat-header-sub">Usually replies instantly</div>
        </div>
        <button type="button" class="rw-chat-header-close" aria-label="Close chat">✕</button>
      </div>
      <div class="rw-chat-messages" id="rwChatMessages"></div>
      <div class="rw-chat-quick-replies" id="rwQuickReplies"></div>
      <div class="rw-chat-input-row">
        <input type="text" class="rw-chat-input" id="rwChatInput" placeholder="Ask about sizing, shipping, fittings..." autocomplete="off" />
        <button type="button" class="rw-chat-send-btn" id="rwChatSend">Send</button>
      </div>
    `;

    document.body.appendChild(panel);
    document.body.appendChild(launcher);

    const messagesEl = panel.querySelector("#rwChatMessages");
    const quickRepliesEl = panel.querySelector("#rwQuickReplies");
    const inputEl = panel.querySelector("#rwChatInput");
    const sendBtn = panel.querySelector("#rwChatSend");
    const closeBtn = panel.querySelector(".rw-chat-header-close");

    let opened = false;

    function appendMessage(text, sender) {
      const msg = document.createElement("div");
      msg.className = "rw-msg " + (sender === "user" ? "rw-msg-user" : "rw-msg-bot");
      msg.textContent = text;
      messagesEl.appendChild(msg);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function showTyping() {
      const typing = document.createElement("div");
      typing.className = "rw-typing";
      typing.id = "rwTypingIndicator";
      typing.innerHTML = "<span></span><span></span><span></span>";
      messagesEl.appendChild(typing);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function removeTyping() {
      const t = document.getElementById("rwTypingIndicator");
      if (t) t.remove();
    }

    function renderQuickReplies() {
      quickRepliesEl.innerHTML = "";
      QUICK_REPLIES.forEach((label) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "rw-quick-reply-btn";
        btn.textContent = label;
        btn.addEventListener("click", () => handleUserMessage(label));
        quickRepliesEl.appendChild(btn);
      });
    }

    function handleUserMessage(text) {
      if (!text.trim()) return;
      appendMessage(text, "user");
      inputEl.value = "";
      showTyping();
      const delay = 450 + Math.random() * 350;
      setTimeout(() => {
        removeTyping();
        let reply;
        if (/^shop suits$/i.test(text)) {
          reply = "You can browse the full suit collection on our Shop page. Want me to highlight a few bestsellers, or help you with sizing first?";
        } else {
          reply = getResponse(text);
        }
        appendMessage(reply, "bot");
      }, delay);
    }

    sendBtn.addEventListener("click", () => handleUserMessage(inputEl.value));
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleUserMessage(inputEl.value);
    });

    function openChat() {
      panel.classList.add("open");
      launcher.classList.add("open");
      launcher.setAttribute("aria-label", "Close concierge chat");
      if (!opened) {
        opened = true;
        appendMessage(
          `Good day, and welcome to ${BRAND}. I'm your virtual concierge — I can help with sizing, shipping, appointments, fabric care, or finding the right piece. How can I help?`,
          "bot"
        );
        renderQuickReplies();
      }
      inputEl.focus();
    }

    function closeChat() {
      panel.classList.remove("open");
      launcher.classList.remove("open");
      launcher.setAttribute("aria-label", "Open concierge chat");
    }

    launcher.addEventListener("click", () => {
      if (panel.classList.contains("open")) closeChat();
      else openChat();
    });
    closeBtn.addEventListener("click", closeChat);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildWidget);
  } else {
    buildWidget();
  }
})();
