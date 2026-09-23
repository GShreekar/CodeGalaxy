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

// conventional file extension for each language, used when downloading a
// snippet as a file
const FILE_EXTENSIONS = {
  'Bash': 'sh', 'C': 'c', 'C#': 'cs', 'C++': 'cpp', 'CSS': 'css', 'Dart': 'dart',
  'Elixir': 'ex', 'Go': 'go', 'Haskell': 'hs', 'HTML': 'html', 'Java': 'java',
  'JavaScript': 'js', 'JSON': 'json', 'Kotlin': 'kt', 'Lua': 'lua', 'Markdown': 'md',
  'Objective-C': 'm', 'Perl': 'pl', 'PHP': 'php', 'PowerShell': 'ps1', 'Python': 'py',
  'R': 'r', 'Ruby': 'rb', 'Rust': 'rs', 'Scala': 'scala', 'SQL': 'sql', 'Swift': 'swift',
  'Text': 'txt', 'TypeScript': 'ts', 'YAML': 'yaml'
};

export const toFileExtension = (language) => FILE_EXTENSIONS[language] || 'txt';
