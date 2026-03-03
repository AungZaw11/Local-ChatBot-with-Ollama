import React, { useState, useEffect, useRef } from 'react';
import ollama from 'ollama/browser';
import ReactMarkdown from 'react-markdown';

function App() {
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // စာရိုက်တိုင်း အလိုအလျောက် အောက်ဆုံးကို scroll ဆွဲပေးရန်
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };

    // User ရဲ့ message နဲ့ AI အတွက် နေရာလွတ် တစ်ခုကို အရင်သတ်မှတ်ပါ
    setChatLog((prev) => [...prev, userMessage, { role: 'assistant', content: '' }]);
    setInput('');
    setLoading(true);

    try {
      const response = await ollama.chat({
        model: 'llama3',
        messages: [...chatLog, userMessage],
        stream: true, // Streaming ကို ဖွင့်လိုက်ခြင်း
      });

      for await (const part of response) {
        setChatLog((prev) => {
          const newChatLog = [...prev];
          const lastIndex = newChatLog.length - 1;
          // AI ရဲ့ စာသားကို တစ်လုံးချင်းစီ ပေါင်းထည့်ပေးခြင်း
          newChatLog[lastIndex] = {
            ...newChatLog[lastIndex],
            content: newChatLog[lastIndex].content + part.message.content,
          };
          return newChatLog;
        });
      }
    } catch (err) {
      console.error(err);
      alert("Error: မချိတ်ဆက်နိုင်ပါ။ Ollama ပွင့်မပွင့် ပြန်စစ်ပါ။");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2>🤖 Local AI Assistant</h2>
        <span style={styles.status}>{loading ? '● AI is typing...' : '● Online'}</span>
      </header>

      <div style={styles.chatWindow}>
        {chatLog.map((msg, index) => (
          <div key={index} style={msg.role === 'user' ? styles.userRow : styles.aiRow}>
            <div style={msg.role === 'user' ? styles.userBubble : styles.aiBubble}>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSubmit} style={styles.inputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="မေးချင်တာ ရိုက်ပါ..."
          style={styles.input}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()} style={styles.button}>
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '95vh', maxWidth: '850px', margin: '10px auto', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', borderRadius: '15px', overflow: 'hidden', backgroundColor: '#ffffff' },
  header: { background: '#202123', color: 'white', padding: '15px', textAlign: 'center', borderBottom: '2px solid #10a37f' },
  status: { fontSize: '12px', color: '#10a37f' },
  chatWindow: { flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: '#f0f2f5', display: 'flex', flexDirection: 'column', gap: '15px' },
  userRow: { display: 'flex', justifyContent: 'flex-end' },
  aiRow: { display: 'flex', justifyContent: 'flex-start' },
  userBubble: { background: '#007bff', color: 'white', padding: '0 15px', borderRadius: '18px 18px 0 18px', maxWidth: '80%', fontSize: '15px', boxShadow: '0 2px 5px rgba(0,123,255,0.2)' },
  aiBubble: {
    background: '#fff', color: '#333', padding: '0 15px', borderRadius: '18px 18px 18px 0',
    maxWidth: '85%', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', fontSize: '15px', border: '1px solid #ddd', overflowX: 'auto'
  },
  inputArea: { display: 'flex', padding: '15px', gap: '10px', background: '#fff', borderTop: '1px solid #eee' },
  input: { flex: 1, padding: '12px 20px', borderRadius: '25px', border: '1px solid #ddd', outline: 'none', fontSize: '15px' },
  button: { padding: '0 25px', borderRadius: '25px', border: 'none', background: '#007bff', color: 'white', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }
};

export default App;

