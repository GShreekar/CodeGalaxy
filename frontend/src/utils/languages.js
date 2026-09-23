// keep in sync with the language enum in backend/constants/languages.js
export const LANGUAGES = [
  'Bash', 'C', 'C#', 'C++', 'CSS', 'Dart', 'Elixir', 'Go', 'Haskell', 'HTML',
  'Java', 'JavaScript', 'JSON', 'Kotlin', 'Lua', 'Markdown', 'Objective-C',
  'Perl', 'PHP', 'PowerShell', 'Python', 'R', 'Ruby', 'Rust', 'Scala', 'SQL',
  'Swift', 'Text', 'TypeScript', 'YAML'
];

// Prism uses different language identifiers than our display names; anything
// not listed here is assumed to already be a valid lowercase Prism key
const PRISM_ALIASES = {
  'C++': 'cpp',
  'C#': 'csharp',
  'HTML': 'markup',
  'Objective-C': 'objectivec',
  // Prism has no "plain text" grammar — an unregistered language name is the
  // correct way to get unhighlighted output, not an error
  'Text': 'text'
};

export const toPrismLanguage = (language) => {
  if (!language) return 'text';
  return PRISM_ALIASES[language] || language.toLowerCase();
};
