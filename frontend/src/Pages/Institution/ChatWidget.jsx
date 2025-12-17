import React, { useState, useRef, useEffect } from 'react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [language, setLanguage] = useState(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Namaste! Please select your preferred language:",
      sender: 'bot',
      type: 'options',
      options: [
        { text: "English", value: "English" },
        { text: "हिंदी (Hindi)", value: "Hindi" },
        { text: "Hinglish", value: "Hinglish" },
        { text: "தமிழ் (Tamil)", value: "Tamil" },
        { text: "తెలుగు (Telugu)", value: "Telugu" }
      ]
    }
  ]);

  const messagesEndRef = useRef(null);

  // ---------------------------------------
  // DATABASE
  // ---------------------------------------
  const botDatabase = {
    documents:
      "For approval, you need these documents:\n1. Land Use Certificate (CLU)\n2. Society/Trust Registration Proof\n3. Approved Building Plan\n4. Fire Safety NOC\n5. Faculty & Staff Details\n6. Bank Statements & Proof of Funds.",
    approval:
      "The general approval process flows as follows:\n1. Apply on AICTE Web Portal.\n2. Scrutiny Committee verifies documents.\n3. EVC Committee inspects infrastructure.\n4. Issuance of Letter of Approval (LoA).",
    system:
      "To use this Dashboard:\n1. Upload PDF/Excel documents.\n2. AI scans and generates a 'Performance Score'.\n3. View Gap Analysis in Dashboard.",
    headquarters:
      "AICTE Headquarters:\nNelson Mandela Marg, Vasant Kunj, New Delhi - 110070.",
    internship:
      "AICTE Internship Steps:\n1. Register on AICTE Internship Portal.\n2. Complete student profile.\n3. Apply for internships.",
    scholarship:
      "Popular AICTE Scholarships:\n1. Pragati\n2. Saksham\n3. Swanath.\nApply via National Scholarship Portal (NSP).",
    ugc:
      "UGC Recognition Parameters:\n1. Faculty Qualification\n2. Infrastructure\n3. Research Output\n4. Financial Stability.",
    default: "I am sorry, I didn't understand that. Please select from options below."
  };

  const greetings = {
    English: "Hello! How can I assist you with college approval today?",
    Hindi: "Namaste! College approval ke liye main aapki kaise madad kar sakta hu?",
    Hinglish: "Hello Ji! Approval ya scholarship ke baare mein kya janna hai?",
    Tamil: "Vanakkam! How can I help you with approval process?",
    Telugu: "Namaskaram! How can I assist you today?"
  };

  const topicSuggestions = [
    { text: "📝 Required Documents", value: "documents" },
    { text: "🏢 AICTE Headquarters", value: "headquarters" },
    { text: "🎓 Scholarships", value: "scholarship" },
    { text: "💼 Internship Process", value: "internship" },
    { text: "🤖 How to use System", value: "system" },
    { text: "✅ UGC Parameters", value: "ugc" },
  ];

  // ---------------------------------------
  // AUTO SCROLL
  // ---------------------------------------
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // ---------------------------------------
  // LANGUAGE SELECT
  // ---------------------------------------
  const handleLanguageSelect = (selectedLang) => {
    setLanguage(selectedLang);

    const userMsg = {
      id: Date.now(),
      text: selectedLang,
      sender: 'user',
      type: 'text'
    };

    const botGreeting = {
      id: Date.now() + 1,
      text: greetings[selectedLang] || greetings.English,
      sender: 'bot',
      type: 'text'
    };

    const botTopics = {
      id: Date.now() + 2,
      text: "Here are some topics I can help you with:",
      sender: "bot",
      type: "options",
      options: topicSuggestions
    };

    setMessages(prev => [...prev, userMsg, botGreeting, botTopics]);
  };

  // ---------------------------------------
  // OPTION CLICK
  // ---------------------------------------
  const handleOptionClick = (option) => {
    const userMsg = { id: Date.now(), text: option.text, sender: 'user', type: 'text' };
    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      const replyText = botDatabase[option.value] || botDatabase.default;

      const botReply = {
        id: Date.now() + 1,
        text: replyText,
        sender: 'bot',
        type: 'text'
      };

      const reShowOptions = {
        id: Date.now() + 2,
        text: "Is there anything else?",
        sender: 'bot',
        type: 'options',
        options: topicSuggestions
      };

      setMessages(prev => [...prev, botReply, reShowOptions]);
    }, 600);
  };

  // ---------------------------------------
  // SEND MESSAGE
  // ---------------------------------------
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    if (!language) {
      alert("Please select a language first.");
      return;
    }

    const userMsg = { id: Date.now(), text: inputValue, sender: 'user', type: 'text' };
    setMessages(prev => [...prev, userMsg]);

    const input = inputValue.toLowerCase();
    setInputValue('');

    setTimeout(() => {
      let foundKey = Object.keys(botDatabase).find(
        key => input.includes(key)
      ) || 'default';

      const botReply = { id: Date.now(), text: botDatabase[foundKey], sender: 'bot', type: 'text' };
      setMessages(prev => [...prev, botReply]);
    }, 600);
  };

  // ---------------------------------------
  // UI
  // ---------------------------------------
  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 z-50 h-16 w-16 flex items-center justify-center rounded-full bg-[#002147] text-white text-2xl shadow-lg transition-transform hover:scale-110 ${
          isOpen ? "rotate-90" : ""
        }`}
      >
        {isOpen ? "✕" : "💬"}
      </button>

      {isOpen && (
        <div className="fixed bottom-28 right-8 z-50 h-[500px] w-[350px] flex flex-col rounded-2xl overflow-hidden bg-white shadow-2xl border border-gray-200">
          
          {/* Header */}
          <div className="bg-[#002147] text-white p-4 flex justify-between items-center">
            <span className="font-bold">SIH Assistant 🤖</span>
            <button onClick={() => setIsOpen(false)} className="text-xl">−</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 bg-[#f4f6f9] overflow-y-auto flex flex-col gap-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm whitespace-pre-line shadow-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#002147] text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.type === 'text' ? (
                    msg.text
                  ) : (
                    <div>
                      <p className="font-medium mb-2">{msg.text}</p>
                      <div className="flex flex-wrap gap-2">
                        {msg.options.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => !language ? handleLanguageSelect(opt.value) : handleOptionClick(opt)}
                            className="px-3 py-1 text-xs border border-[#002147] text-[#002147] rounded-full hover:bg-[#002147] hover:text-white transition"
                          >
                            {opt.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 flex gap-2 border-t border-gray-200 bg-white">
            <input
              type="text"
              placeholder={language ? "Ask about approval..." : "Select language..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={!language}
              className="flex-1 px-4 py-2 text-sm border rounded-full outline-none disabled:bg-gray-100"
            />
            <button
              onClick={handleSendMessage}
              disabled={!language}
              className="bg-[#ff9933] text-white px-4 py-2 rounded-full font-bold hover:bg-[#e68a00] disabled:bg-gray-300"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
