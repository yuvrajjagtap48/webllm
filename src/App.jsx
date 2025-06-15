import { useEffect, useState } from 'react';
import * as webllm from "@mlc-ai/web-llm";
import './style.css';

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: 'system',
      content: 'You are a helpful assistant.'
    }
  ]);
  const [engine, setEngine] = useState(null);

  useEffect(() => {
    const selectedModel = "Llama-3.1-8B-Instruct-q4f32_1-MLC";
    webllm.CreateMLCEngine(selectedModel, {
      initProgressCallback: (initProgress) => {
        console.log("initProgress", initProgress);
      }
    }).then((engine) => {
      setEngine(engine);
      console.log("Engine created", engine);
    });
  }, []);

  async function sendMessageToLlm() {
    if (!engine) return;
    const tempMessages = [...messages, { role: 'user', content: input }];
    setMessages(tempMessages);
    setInput("");

    try {
      const reply = await engine.chat.completions.create({
        messages: tempMessages,
      });
      console.log("Reply", reply);
      const text = reply.choices[0].message.content;
      setMessages([
        ...tempMessages,
        {
          role: 'assistant',
          content: text
        }
      ]);
    } catch (error) {
      console.error("Error getting reply:", error);
    }
  }

  return (
    <main>
      <section>
        <div className="conversation-area">
          <div className="messages">
            {
              messages.filter(message => message.role !== "system").map((message, index) => (
                <div className={`message ${message.role}`} key={index}>
                  <span className="role">{message.role}</span>
                  <span className="content">{message.content}</span>
                </div>
              ))
            }
          </div>
          <div className="input-area">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessageToLlm();
                }
              }}
              type="text"
              placeholder="Message LLM"
            />
            <button
              onClick={sendMessageToLlm}
              className="send-button"
            >
              Send
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;