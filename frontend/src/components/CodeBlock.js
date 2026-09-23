import { useState, useRef, useEffect } from 'react';
import { toPrismLanguage, toFileExtension } from '../utils/languages';
import SyntaxHighlighter from '../utils/syntaxHighlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FaAlignLeft, FaFileAlt, FaDownload, FaExpand, FaCompress } from 'react-icons/fa';
import './CodeBlock.css';

const CodeBlock = ({ code, language, title, showControls = false }) => {
  const [wrapped, setWrapped] = useState(false);
  const [rawView, setRawView] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen?.();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      // the browser/OS can deny fullscreen (e.g. outside a user gesture) —
      // the rest of the controls stay usable either way
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(title || 'snippet').trim().replace(/[^a-z0-9-_]+/gi, '-').slice(0, 60)}.${toFileExtension(language)}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div ref={containerRef} className={`code-block-container ${isFullscreen ? 'is-fullscreen' : ''}`}>
      {showControls && (
        <div className="code-block-controls">
          <button
            type="button"
            className={`code-control-btn ${wrapped ? 'active' : ''}`}
            onClick={() => setWrapped(w => !w)}
            aria-pressed={wrapped}
            title="Toggle line wrap"
          >
            <FaAlignLeft />
            <span>Wrap</span>
          </button>
          <button
            type="button"
            className={`code-control-btn ${rawView ? 'active' : ''}`}
            onClick={() => setRawView(r => !r)}
            aria-pressed={rawView}
            title="Toggle raw view"
          >
            <FaFileAlt />
            <span>Raw</span>
          </button>
          <button
            type="button"
            className="code-control-btn"
            onClick={handleDownload}
            title="Download as file"
          >
            <FaDownload />
            <span>Download</span>
          </button>
          <button
            type="button"
            className="code-control-btn"
            onClick={toggleFullscreen}
            aria-pressed={isFullscreen}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <FaCompress /> : <FaExpand />}
            <span>{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
          </button>
        </div>
      )}

      <div className={`code-block ${showControls ? 'code-block-expanded' : ''}`}>
        {rawView ? (
          <pre className={`raw-code ${wrapped ? 'wrapped' : ''}`}><code>{code}</code></pre>
        ) : (
          <SyntaxHighlighter
            language={toPrismLanguage(language)}
            style={vscDarkPlus}
            showLineNumbers
            wrapLongLines={wrapped}
            customStyle={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '4px',
              margin: 0
            }}
          >
            {code}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
  );
};

export default CodeBlock;
