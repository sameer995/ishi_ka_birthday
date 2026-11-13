// ✏️ EDIT THIS FILE to personalise the site. No other file needs changes.
// Tip: you can also personalise the link itself:  index.html?name=Priya&from=Sameer
window.CONFIG = {
  name: "Ishi",                       // her name / nickname
  from: "Sameer",                    // your name
  birthday: "2026-11-14T00:00:00+05:30",   // countdown target (India time)
  ageTurning: 25,                  // e.g. 24, or null to hide

  // Scrolling "stock ticker" tape at the top. up:false shows a red ▼.
  ticker: [
    { sym: "SIS",       change: "+100%", up: true },
    { sym: "LAUGHS",    change: "+24/7", up: true },
    { sym: "KINDNESS",  change: "+∞",    up: true },
    { sym: "BAD DAYS",  change: "-100%", up: false },
    { sym: "CAKE",      change: "+500%", up: true },
    { sym: "SUMMITS",   change: "+1",    up: true },
    { sym: "KM RUN",    change: "+42.2", up: true }
  ],

  // Little badges under the title
  chips: ["🏔 Summit reached", "🏃 Marathon finisher", "📈 All-time high"],

  // Lines typed out one after another in the hero
  typed: [
    "To my sister from another mother 💛",
    "You climb every mountain life throws at you.",
    "You finish every marathon. Strong. Always.",
    "You're the best investment I ever made. 📈"
  ],
  tagline: "Happy Birthday to the sister life gave me without the family tree.",

  // Hero photo (round). Leave "" to show a placeholder. Example: "images/hero.jpg"
  heroPhoto: "images/hero.jpg",

  letter: [
    "Some people come into your life and quietly become family. You are that person for me.",
    "Life is a mountain trail, a long marathon and a volatile market all at once, and you handle all three with a smile.",
    "Thank you for every laugh, every late-night talk, every time you believed in me when I didn't.",
    "May this year take you to a new summit. Happy Birthday. I'm always at your finish line, cheering the loudest. 💛"
  ],

  // Photo wall. Each slot shows a placeholder until you set `src` (e.g. "images/1.jpg").
  // Add or remove slots freely.
  photos: [
    { src: "images/1.jpg", caption: "Where it all began" },
    { src: "images/2.jpg", caption: "Heroine no. 1" },
    { src: "images/3.jpg", caption: "Best trip ever" },
    { src: "images/4.jpg", caption: "Just us being us" },
    { src: "images/5.jpg", caption: "The smile and 1st medal" },
    { src: "images/6.jpg", caption: "Bhaag milkha bhaag" }
  ],

  // The marathon route: memories placed from KM 0 (start) to KM 42.2 (finish).
  // Optional `km: "KM 21 · HALFWAY"` overrides the auto label.
  memories: [
    { title: "How it started", text: "The day we met, and somehow it already felt like we'd known each other forever." },
    { title: "Our inside joke", text: "The one that makes us laugh and confuses everyone else." },
    { title: "The time you had my back", text: "You showed up when it mattered. I never forgot." },
    { title: "Today", text: "Another year of you being the best part of my life." }
  ],

  // "Market report" candlestick chart + stat cards
  stock: {
    symbol: "SIS",
    company: "Sis & Co. · Friendship Index",
    stats: [
      { label: "Laughs shared",  value: "∞",       chg: "+100%" },
      { label: "Inside jokes",   value: "1,000+",  chg: "+42%" },
      { label: "Bad days fixed", value: "All",     chg: "+100%" }
    ],
    note: "Not financial advice. Just a very, very strong buy. 📈"
  },

  // Your "portfolio": reasons she's great. tag = ticker symbol on the card front.
  reasons: [
    { tag: "LISTEN", text: "You listen without judging." },
    { tag: "FUN",    text: "You make ordinary days fun." },
    { tag: "GRIT",   text: "You're stronger than you think." },
    { tag: "ADVICE", text: "You give the best advice (and the best scoldings)." },
    { tag: "MYPPL",  text: "You're simply my person." },
    { tag: "SMILE",  text: "Your laugh fixes bad days." }
  ],

  wishes: ["Reach every summit ⛰️", "May your returns be endless 📈", "Run strong, finish stronger 🏅", "Eat lots of cake 🎂", "Love you loads 💛"],

  footer: "Made with love by"
};
