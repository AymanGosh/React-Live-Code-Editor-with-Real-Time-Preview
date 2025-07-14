// src/App.js
import React, { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import * as Babel from '@babel/standalone';

const defaultCode = `
function App() {
  const [count, setCount] = React.useState(0);
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('preview'));
`;

function App() {
  const [code, setCode] = useState(defaultCode);
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    const transpiledCode = Babel.transform(code, {
      presets: ['env', 'react'],
    }).code;

    const html = `
      <html>
        <head>
          <script src="https://unpkg.com/react/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom/umd/react-dom.development.js"></script>
        </head>
        <body>
          <div id="preview"></div>
          <script>
            try {
              ${transpiledCode}
            } catch (e) {
              document.body.innerHTML = '<pre style="color:red;">' + e.message + '</pre>';
            }
          </script>
        </body>
      </html>
    `;

    doc.open();
    doc.write(html);
    doc.close();
  }, [code]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Question */}
      <div style={{ flex: 1, padding: '10px', borderRight: '1px solid #ccc' }}>
        <h3>React Question</h3>
        <p>Create a counter with a button to increment it.</p>
      </div>

      {/* Editor */}
      <div style={{ flex: 1.5, borderRight: '1px solid #ccc' }}>
        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue={defaultCode}
          onChange={(value) => setCode(value)}
          theme="vs-dark"
        />
      </div>

      {/* Preview */}
      <div style={{ flex: 1, backgroundColor: '#fff' }}>
        <iframe
          ref={iframeRef}
          title="preview"
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </div>
    </div>
  );
}

export default App;
