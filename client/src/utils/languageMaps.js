// country → preferred language for local address
const countryLanguageMap = {
  // India — states handled separately if you like; here main country default
  IN: "hi",             // Hindi by default
  US: "en",             // English
  FR: "fr",             // French
  DE: "de",             // German
  RU: "ru",             // Russian
  CN: "zh",             // Chinese (Simplified)
  ES: "es",             // Spanish
  SA: "ar",             // Arabic (Saudi Arabia)
  EG: "ar",             // Arabic (Egypt)
  JP: "ja",             // Japanese
  BR: "pt",             // Portuguese (Brazil)
  PK: "ur",             // Urdu (Pakistan)
  BD: "bn",             // Bengali (Bangladesh)
   // English-friendly / well-known countries
  GB: "en",        // United Kingdom
  CA: "en",        // Canada
  AU: "en",        // Australia
  NZ: "en",        // New Zealand
  IE: "en",        // Ireland
  SG: "en",        // Singapore (multi-lingual, English common)
  
  // Major non-English-speaking countries
  IT: "it",        // Italy
  KR: "ko",        // South Korea
  AR: "es",        // Argentina
  MX: "es",        // Mexico
  TH: "th",        // Thailand
  VN: "vi",        // Vietnam
  ID: "id",        // Indonesia
  IR: "fa",        // Iran
  TR: "tr",        // Turkey
  GR: "el",        // Greece
  IL: "he",        // Israel
  UA: "uk",        // Ukraine
  NG: "en",        // Nigeria (English official)
  KE: "en",        // Kenya (English official)
  TZ: "sw",        // Tanzania (Swahili)
  ET: "am",        // Ethiopia (Amharic)
  // Add more as neede
  
};

// Optional: state‑wise map for Indian states if you need more granularity
const indiaStateLanguageMap = {
  "Andhra Pradesh": "te",   // Telugu
  "Arunachal Pradesh": "en",
  "Assam": "as",           // Assamese (ISO 639‑1 is "as")
  "Bihar": "hi",
  "Chhattisgarh": "hi",
  "Goa": "kok",            // Konkani (ISO 639‑2/3)
  "Gujarat": "gu",         // Gujarati
  "Haryana": "hi",
  "Himachal Pradesh": "hi",
  "Jharkhand": "hi",
  "Karnataka": "kn",       // Kannada
  "Kerala": "ml",          // Malayalam
  "Madhya Pradesh": "hi",
  "Maharashtra": "mr",     // Marathi
  "Manipur": "mni",        // Meitei / Manipuri
  "Meghalaya": "en",
  "Mizoram": "lus",        // Mizo / Lushei? (ISO may vary)
  "Nagaland": "en",
  "Odisha": "or",           // Odia (Oriya) — iso "or"
  "Punjab": "pa",           // Punjabi
  "Rajasthan": "hi",
  "Sikkim": "ne",           // Nepali (one of the languages)
  "Tamil Nadu": "ta",       // Tamil
  "Telangana": "te",
  "Tripura": "bn",          // Bengali
  "Uttar Pradesh": "hi",
  "Uttarakhand": "hi",
  "West Bengal": "bn",
   
  // Add Union Territories if needed
};
 

