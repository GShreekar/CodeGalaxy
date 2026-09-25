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

// a recognizable identity color per language, used for the small dot on
// language chips/badges — conventional community colors where one exists
// (e.g. GitHub's linguist palette), a reasonable pick otherwise
const LANGUAGE_COLORS = {
  'Bash': '#89e051', 'C': '#555555', 'C#': '#178600', 'C++': '#f34b7d', 'CSS': '#563d7c',
  'Dart': '#00b4ab', 'Elixir': '#6e4a7e', 'Go': '#00add8', 'Haskell': '#5e5086', 'HTML': '#e34c26',
  'Java': '#b07219', 'JavaScript': '#f1e05a', 'JSON': '#292929', 'Kotlin': '#a97bff', 'Lua': '#000080',
  'Markdown': '#083fa1', 'Objective-C': '#438eff', 'Perl': '#0298c3', 'PHP': '#4f5d95', 'PowerShell': '#012456',
  'Python': '#3572a5', 'R': '#198ce7', 'Ruby': '#701516', 'Rust': '#dea584', 'Scala': '#c22d40',
  'SQL': '#e38c00', 'Swift': '#f05138', 'Text': '#94a3b8', 'TypeScript': '#3178c6', 'YAML': '#cb171e'
};

export const toLanguageColor = (language) => LANGUAGE_COLORS[language] || '#00e5ff';
