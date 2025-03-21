import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Radhey Shyam 🙏 How can I help you today?' },
  ]);
  const [input, setInput] = useState('');

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = () => {
    if (!input.trim()) return;
  
    const newMessage = { from: 'user', text: input };
    setMessages((prev) => [...prev, newMessage]);
  
    const lowerInput = input.toLowerCase();
  
    // Define simple Q&A logic
    let botReply = "Radhe Shyam , Please contact on +91 95409 17385";
  
    if (lowerInput.includes('darshan timing')) {
      botReply = 'Our temple darshan timings are 6 AM - 12 PM and 4 PM - 8 PM.';
    } else if (lowerInput.includes('location')) {
      botReply = 'We are located at Gaur Kripa Dham Vrindavan, Uttar Pradesh.';
    } else if (lowerInput.includes('events') || lowerInput.includes('programs')) {
      botReply = 'Upcoming events: Kirtan night on Sunday, and Satsang on Wednesday.';
    } else if (lowerInput.includes('contact')) {
      botReply = 'You can contact us at +91 95409 17385';
    }else if (lowerInput.includes('radhe shyam')) {
        botReply = 'Radhe Shyam , How May we Help';
      }

    
  
    // Simulate response
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: 'bot', text: botReply }]);
    }, 1000);
  
    setInput('');
  };
  

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="w-80 h-[400px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden mb-4">
          {/* Header with Avatar and Name */}
          <div className="bg-orange-600 text-white px-4 py-3 font-bold flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="https://i.ibb.co/KjnQSMw3/Maharaj-JIImage1.jpg" // Replace with your bot image if needed
                alt="Bot Avatar"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <span className="text-lg">Gaur Kripa Bot</span>
            </div>
            <button onClick={toggleChat} className="text-white hover:text-orange-200">
              <X />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-orange-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.from === 'user'
                    ? 'bg-orange-100 self-end ml-auto'
                    : 'bg-white text-gray-800 self-start'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="flex border-t border-gray-200">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 p-2 outline-none"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              className="bg-orange-500 text-white px-4 py-2 hover:bg-orange-600"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="bg-orange-600 text-white p-4 rounded-full shadow-lg hover:bg-orange-700 transition duration-300"
        >
          <MessageCircle />
        </button>
      )}
    </div>
  );
};

export default ChatBot;
