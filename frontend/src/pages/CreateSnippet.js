// src/pages/CreateSnippet.js
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSnippet } from '../features/snippetSlice';
import './CreateSnippet.css';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';


const CreateSnippet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    language: '',
    code: ''
  });

  const languages = [
    'JavaScript', 'Python', 'Java', 'C++',
    'Ruby', 'PHP', 'Go', 'Swift',
    'Rust', 'TypeScript', 'Kotlin', 'SQL'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createSnippet({
        ...formData,
        author: user.username
      })).unwrap();
      navigate('/my-snippets');
    } catch (error) {
      console.error('Failed to create snippet:', error);
    }
  };

  return (
    <div className="create-snippet-page">
      <div className="container py-4">
        <div className="snippet-form-card">
          <h2 className="card-title text-center neon-text mb-4">
            Create New Snippet
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>

            <div className="mb-3">
              <textarea
                className="form-control"
                placeholder="Description"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>

            <div className="mb-3">
              <select
                className="form-select"
                value={formData.language}
                onChange={(e) => setFormData({...formData, language: e.target.value})}
                required
              >
                <option value="">Select Language</option>
                {languages.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <textarea
                  className="form-control code-editor"
                  placeholder="Paste your code here..."
                  rows="10"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <div className="preview-container">
                  <h5 className="preview-title neon-text">Preview</h5>
                  <SyntaxHighlighter 
                    language={'C++' ? 'cpp' : formData.language.toLowerCase()}
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

            <button type="submit" className="btn btn-create w-100">
              Create Snippet
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSnippet;