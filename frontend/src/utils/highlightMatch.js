const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// splits text around every case-insensitive occurrence of query and wraps
// matches in <mark>; returns the original text untouched when there's no
// active query, so callers can use it unconditionally.
//
// String.split() with a capturing group always puts the captured matches at
// odd indices and the text between them at even indices — that parity is
// what tells match from non-match, not re-testing the (stateful, with the
// g flag) regex against each part.
export const highlightMatch = (text, query) => {
  if (!text || !query?.trim()) return text;

  const trimmedQuery = query.trim();
  const pattern = new RegExp(`(${escapeRegex(trimmedQuery)})`, 'gi');
  const parts = text.split(pattern);

  if (parts.length === 1) return text;

  return parts.map((part, index) =>
    index % 2 === 1
      ? <mark key={index} className="search-highlight">{part}</mark>
      : part
  );
};
