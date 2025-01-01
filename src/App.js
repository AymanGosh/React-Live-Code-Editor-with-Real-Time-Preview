// App.js
import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import * as Babel from "@babel/standalone";

const App = () => {
  const [code, setCode] = useState(`
    const App = () => {
      const [count, setCount] = React.useState(0);

      React.useEffect(() => {
        document.title = \`Count: \${count}\`;
      }, [count]);

      return (
        <div>
          <h1>Count: {count}</h1>
          <button onClick={() => setCount(count + 1)}>Increment</button>
          <button onClick={() => setCount(count - 1)}>Decrement</button>
        </div>
      );
    };
    ReactDOM.render(<App />, document.getElementById('root'));
  `);

  const [output, setOutput] = useState("");

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    try {
      const transformedCode = Babel.transform(newCode, {
        presets: ["react", "env"],
      }).code;
      const html = `
        <div id="root"></div>
        <script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
        <script>
          const React = window.React;
          const ReactDOM = window.ReactDOM;
          ${transformedCode}
        </script>
      `;
      setOutput(html);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Editor */}
      <div style={{ flex: 1, borderRight: "1px solid #ddd" }}>
        <h2>Code Editor</h2>
        <CodeMirror
          value={code}
          height="90%"
          onChange={handleCodeChange}
        />
      </div>

      {/* Output */}
      <div style={{ flex: 1 }}>
        <h2>Live Output</h2>
        <iframe
          style={{ width: "100%", height: "90%", border: "none" }}
          srcDoc={output}
          sandbox="allow-scripts"
        />
      </div>
    </div>
  );
};

export default App;
