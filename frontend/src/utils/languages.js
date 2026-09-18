// keep in sync with the language enum in backend/models/snippetModel.js
export const LANGUAGES = [
  'JavaScript', 'Python', 'Java', 'C++',
  'Ruby', 'PHP', 'Go', 'Swift',
  'Rust', 'TypeScript', 'Kotlin', 'SQL'
];

// Prism uses different language identifiers than our display names
const PRISM_ALIASES = {
  'C++': 'cpp'
};

export const toPrismLanguage = (language) => {
  if (!language) return 'text';
  return PRISM_ALIASES[language] || language.toLowerCase();
};
