import { useState } from 'react';
import { LANGUAGES, toPrismLanguage } from '../utils/languages';
import SyntaxHighlighter from '../utils/syntaxHighlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// shared by CreateSnippet and EditSnippet — only what happens on submit differs
const SnippetForm = ({ initialValues, onSubmit, submitLabel, submitting }) => {
  const [formData, setFormData] = useState(initialValues);
  // tags are edited as a single comma-separated field and only split into an
  // array at submit time — simpler than a dedicated tag-pill input widget
  const [tagsInput, setTagsInput] = useState((initialValues.tags || []).join(', '));

  const handleSubmit = (e) => {
    e.preventDefault();
    const tags = tagsInput.split(',').map((tag) => tag.trim()).filter(Boolean).slice(0, 10);
    onSubmit({ ...formData, tags });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <textarea
          className="form-control"
          placeholder="Description"
          rows="3"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      <div className="mb-3">
        <select
          className="form-select"
          value={formData.language}
          onChange={(e) => setFormData({ ...formData, language: e.target.value })}
          required
        >
          <option value="">Select Language</option>
          {LANGUAGES.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Tags (comma-separated, e.g. react, async, regex)"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          maxLength={300}
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <textarea
            className="form-control code-editor"
            placeholder="Paste your code here..."
            rows="10"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
          />
        </div>
        <div className="col-md-6 mb-3">
          <div className="preview-container">
            <h5 className="preview-title neon-text">Preview</h5>
            <SyntaxHighlighter
              language={toPrismLanguage(formData.language)}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                borderRadius: '4px',
                minHeight: '223px'
              }}
            >
              {formData.code || '// Your code preview will appear here'}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn-create w-100" disabled={submitting}>
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
};

export default SnippetForm;
