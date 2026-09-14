import { useEffect, useRef, useState } from 'react'
import { ArrowUp, CalendarDays, Check, ChevronDown, Flame, Menu, MessageSquare, Mic, MoreHorizontal, Paperclip, Plus, Search, Settings, Sparkles, Sunrise, X } from 'lucide-react'

const starters = [
  { icon: Sparkles, title: 'Create something', text: 'Help me brainstorm a creative project', tone: 'coral' },
  { icon: CalendarDays, title: 'Plan my day', text: 'Help me organize my priorities', tone: 'violet' },
  { icon: Search, title: 'Explore an idea', text: 'Teach me something fascinating', tone: 'blue' },
  { icon: MessageSquare, title: 'Talk it through', text: "There's something on my mind", tone: 'green' },
]

const history = [
  { group: 'Today', items: ['Morning planning', 'Ideas for the studio'] },
  { group: 'Yesterday', items: ['Book recommendations', 'Weekend in Copenhagen'] },
  { group: 'Previous 7 days', items: ['A better evening routine', 'Project North Star', 'Learn conversational Italian'] },
]

const replies = [
  "Absolutely. Let's turn that into something clear and doable. What outcome would feel most helpful right now?",
  "I’m with you. We can take this one thoughtful step at a time — tell me a little more about what you have in mind.",
  "That sounds worth exploring. I can help you generate options, shape a plan, or simply think it through together.",
]

function BrandMark({ small = false }) {
  return <div className={`brand-mark ${small ? 'small' : ''}`} aria-hidden="true"><Flame size={small ? 17 : 24} strokeWidth={2.4} /></div>
}

function App() {
  const [sidebar, setSidebar] = useState(true)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [thinking, setThinking] = useState(false)
  const [modelOpen, setModelOpen] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, thinking])

  const send = (text = input) => {
    const clean = text.trim()
    if (!clean || thinking) return
    setMessages((m) => [...m, { role: 'user', text: clean }])
    setInput('')
    setThinking(true)
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'assistant', text: replies[m.length % replies.length] }])
      setThinking(false)
    }, 850)
  }

  const newChat = () => { setMessages([]); setInput('') }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebar ? '' : 'closed'}`}>
        <div className="sidebar-top">
          <div className="brand"><BrandMark /><span>Phoenix</span></div>
          <button className="icon-button desktop-close" onClick={() => setSidebar(false)} aria-label="Close sidebar"><X size={19} /></button>
        </div>
        <button className="new-chat" onClick={newChat}><Plus size={18} /><span>New conversation</span><span className="shortcut">⌘ K</span></button>
        <nav className="history" aria-label="Conversation history">
          {history.map((section) => <div className="history-section" key={section.group}>
            <p>{section.group}</p>
            {section.items.map((item, i) => <button key={item} className={section.group === 'Today' && i === 0 ? 'active' : ''}><span>{item}</span>{section.group === 'Today' && i === 0 && <MoreHorizontal size={17} />}</button>)}
          </div>)}
        </nav>
        <div className="sidebar-footer">
          <button><Settings size={18} /><span>Settings</span></button>
          <button className="profile"><span className="avatar">AM</span><span><strong>Alex Morgan</strong><small>Personal plan</small></span><ChevronDown size={16} /></button>
        </div>
      </aside>

      <main className="main">
        <header>
          {!sidebar && <button className="icon-button" onClick={() => setSidebar(true)} aria-label="Open sidebar"><Menu size={21} /></button>}
          <div className="model-wrap">
            <button className="model-button" onClick={() => setModelOpen(!modelOpen)}>Phoenix <span>2.0</span><ChevronDown size={15} /></button>
            {modelOpen && <div className="model-menu"><button onClick={() => setModelOpen(false)}><span><strong>Phoenix 2.0</strong><small>Most capable</small></span><Check size={16} /></button><button onClick={() => setModelOpen(false)}><span><strong>Phoenix Swift</strong><small>Fast, everyday help</small></span></button></div>}
          </div>
          <div className="status"><span></span>Online</div>
        </header>

        <section className={`conversation ${messages.length ? 'has-messages' : ''}`}>
          {messages.length === 0 ? (
            <div className="welcome">
              <div className="orb"><div className="orb-inner"><Sunrise size={32} /></div></div>
              <p className="eyebrow">YOUR PERSONAL AI</p>
              <h1>Good morning, Alex.</h1>
              <p className="subtitle">What would you like to bring to life today?</p>
              <div className="starter-grid">
                {starters.map(({ icon: Icon, title, text, tone }) => <button key={title} className="starter" onClick={() => send(text)}><span className={`starter-icon ${tone}`}><Icon size={18} /></span><span><strong>{title}</strong><small>{text}</small></span><ArrowUp className="starter-arrow" size={17} /></button>)}
              </div>
            </div>
          ) : (
            <div className="messages">
              {messages.map((message, i) => <div className={`message ${message.role}`} key={`${message.role}-${i}`}>
                {message.role === 'assistant' && <BrandMark small />}
                <div className="bubble">{message.text}</div>
              </div>)}
              {thinking && <div className="message assistant"><BrandMark small /><div className="bubble typing"><i></i><i></i><i></i></div></div>}
              <div ref={endRef} />
            </div>
          )}
        </section>

        <div className="composer-area">
          <div className="composer">
            <textarea rows="1" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }} placeholder="Message Phoenix..." aria-label="Message Phoenix" />
            <div className="composer-actions"><div><button aria-label="Attach a file"><Paperclip size={19} /></button><button aria-label="Use microphone"><Mic size={19} /></button></div><button className="send" onClick={() => send()} disabled={!input.trim() || thinking} aria-label="Send message"><ArrowUp size={19} /></button></div>
          </div>
          <p className="disclaimer">Phoenix can make mistakes. Check important information.</p>
        </div>
      </main>
    </div>
  )
}

export default App
