import React, { useState, useEffect, useRef } from 'react';
import ollama from 'ollama/browser';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function App() {
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Auto Scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setChatLog((prev) => [...prev, userMessage, { role: 'assistant', content: '' }]);
    setInput('');
    setLoading(true);

    try {
      // DeepSeek Coder V2 Lite ကို အသုံးပြုခြင်း
      const response = await ollama.chat({
        model: 'deepseek-coder-v2:lite',
        messages: [
          { role: 'system', content: 'You are an expert programmer. Provide efficient and clean code with explanations.' },
          ...chatLog,
          userMessage
        ],
        stream: true,
      });

      for await (const part of response) {
        setChatLog((prev) => {
          const newChatLog = [...prev];
          const lastIndex = newChatLog.length - 1;
          newChatLog[lastIndex] = {
            ...newChatLog[lastIndex],
            content: newChatLog[lastIndex].content + part.message.content,
          };
          return newChatLog;
        });
      }
    } catch (err) {
      console.error(err);
      alert("Error: Make sure 'ollama run deepseek-coder-v2:lite' is working.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerTitle}>🚀 DeepSeek Coder Hub</div>
        <div style={styles.headerStatus}>{loading ? '● AI is coding...' : '● Ready to Build'}</div>
      </header>

      {/* Chat Display */}
      <div style={styles.chatWindow}>
        {chatLog.map((msg, index) => (
          <div key={index} style={msg.role === 'user' ? styles.userRow : styles.aiRow}>
            <div style={msg.role === 'user' ? styles.userBubble : styles.aiBubble}>
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div style={styles.codeContainer}>
                        <div style={styles.codeHeader}>{match[1]}</div>
                        <SyntaxHighlighter
                          style={vscDarkPlus}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className={className} style={styles.inlineCode} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} style={styles.inputArea}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Write some code or ask a logic question..."
          style={styles.input}
          rows="2"
        />
        <button type="submit" disabled={loading || !input.trim()} style={styles.button}>
          {loading ? '...' : 'SEND'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#0d1117', color: '#c9d1d9', fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' },
  header: { padding: '15px 25px', backgroundColor: '#161b22', borderBottom: '1px solid #30363d', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: '18px', fontWeight: 'bold', color: '#58a6ff' },
  headerStatus: { fontSize: '12px', color: '#8b949e' },
  chatWindow: { flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' },
  userRow: { display: 'flex', justifyContent: 'flex-end' },
  aiRow: { display: 'flex', justifyContent: 'flex-start' },
  userBubble: { background: '#238636', color: '#fff', padding: '5px 15px', borderRadius: '12px 12px 2px 12px', maxWidth: '80%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  aiBubble: { background: '#161b22', color: '#d1d5db', padding: '5px 18px', borderRadius: '12px 12px 12px 2px', maxWidth: '90%', border: '1px solid #30363d', lineHeight: '1.7' },
  codeContainer: { margin: '10px 0', borderRadius: '8px', overflow: 'hidden', border: '1px solid #444c56' },
  codeHeader: { backgroundColor: '#21262d', padding: '5px 15px', fontSize: '12px', color: '#8b949e', borderBottom: '1px solid #30363d', textTransform: 'uppercase' },
  inlineCode: { backgroundColor: '#2d333b', padding: '2px 5px', borderRadius: '4px', color: '#ff7b72' },
  inputArea: { display: 'flex', padding: '20px', gap: '15px', backgroundColor: '#161b22', borderTop: '1px solid #30363d' },
  input: { flex: 1, padding: '12px 15px', borderRadius: '8px', border: '1px solid #30363d', backgroundColor: '#0d1117', color: '#c9d1d9', outline: 'none', resize: 'none', fontSize: '15px' },
  button: { padding: '0 30px', borderRadius: '8px', border: 'none', backgroundColor: '#238636', color: '#fff', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }
};

export default App;