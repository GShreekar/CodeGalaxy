import { useState } from 'react';
import { LANGUAGES, toPrismLanguage, toFileExtension } from '../utils/languages';
import SyntaxHighlighter from '../utils/syntaxHighlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const TITLE_MAX = 120;
const DESCRIPTION_MAX = 2000;

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
    <form onSubmit={handleSubmit} className="studio-form">
      <div className="studio-grid">
        <div className="studio-main">
          <div className="studio-field">
            <div className="studio-field-header">
              <label htmlFor="snippet-title">Title</label>
              <span className="studio-char-count">{formData.title.length} / {TITLE_MAX}</span>
            </div>
            <input
              id="snippet-title"
              type="text"
              className="form-control"
              placeholder="e.g. Zero-dependency debounce hook"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              maxLength={TITLE_MAX}
              required
            />
          </div>

          <div className="studio-field">
            <div className="studio-field-header">
              <label htmlFor="snippet-description">Description</label>
              <span className="studio-char-count">{formData.description.length} / {DESCRIPTION_MAX}</span>
            </div>
            <textarea
              id="snippet-description"
              className="form-control"
              placeholder="What does this snippet do, and why would someone reach for it?"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              maxLength={DESCRIPTION_MAX}
              required
            />
          </div>

          <div className="studio-code-panel">
            <div className="studio-code-panel-header">
              <span>snippet.{toFileExtension(formData.language)}</span>
            </div>
            <div className="row g-0 studio-code-grid">
              <div className="col-md-6">
                <textarea
                  className="form-control code-editor"
                  placeholder="Paste your code here..."
                  rows="14"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6">
                <div className="preview-container">
                  <h5 className="preview-title">Preview</h5>
                  <SyntaxHighlighter
                    language={toPrismLanguage(formData.language)}
                    style={vscDarkPlus}
                    showLineNumbers
                    customStyle={{
                      margin: 0,
                      borderRadius: 0,
                      minHeight: '100%',
                      background: 'var(--code-surface)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem'
                    }}
                    codeTagProps={{ style: { fontFamily: 'var(--font-mono)' } }}
                  >
                    {formData.code || '// Your code preview will appear here'}
                  </SyntaxHighlighter>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="studio-sidebar">
          <div className="studio-sidebar-card">
            <h6 className="studio-sidebar-heading">Metadata</h6>

            <div className="studio-field">
              <label htmlFor="snippet-language">Language</label>
              <select
                id="snippet-language"
                className="form-select neon-select"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                required
              >
                <option value="">Select language</option>
                {LANGUAGES.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <div className="studio-field">
              <label htmlFor="snippet-tags">Tags</label>
              <input
                id="snippet-tags"
                type="text"
                className="form-control"
                placeholder="react, async, regex"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                maxLength={300}
              />
              <span className="studio-hint">Up to 10 tags, comma-separated</span>
            </div>
          </div>
        </aside>
      </div>

      <button type="submit" className="btn btn-create studio-submit" disabled={submitting}>
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
};

export default SnippetForm;
