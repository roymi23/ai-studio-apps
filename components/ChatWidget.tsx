
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { getChatResponse } from '../services/geminiService';
import ChatIcon from './icons/ChatIcon';
import CloseIcon from './icons/CloseIcon';
import SendIcon from './icons/SendIcon';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { id: '1', text: "Hello! I'm your creative assistant. How can I help you with your script today?", sender: 'bot' }
      ]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      text: userInput,
      sender: 'user',
    };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsTyping(true);

    try {
      const botResponseText = await getChatResponse(messages, userInput);
      const newBotMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: botResponseText,
        sender: 'bot',
      };
      setMessages(prev => [...prev, newBotMessage]);
    } catch (error) {
      console.error("Chat API error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: 'bot',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-brand-primary text-white p-4 rounded-full shadow-lg hover:bg-brand-secondary transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-bg focus:ring-brand-primary z-50"
        aria-label="Toggle chat"
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-md h-full max-h-[600px] bg-dark-surface rounded-lg shadow-2xl flex flex-col border border-dark-border z-40 animate-fade-in-up">
          <header className="bg-dark-surface p-4 text-white text-lg font-semibold rounded-t-lg border-b border-dark-border">
            Creative Assistant
          </header>
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex my-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2 rounded-lg max-w-xs lg:max-w-md ${msg.sender === 'user' ? 'bg-brand-primary text-white' : 'bg-dark-bg text-dark-text-primary'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                  <div className="px-4 py-2 rounded-lg bg-dark-bg text-dark-text-primary">
                      <div className="flex items-center space-x-1">
                          <span className="w-2 h-2 bg-dark-text-secondary rounded-full animate-pulse delay-75"></span>
                          <span className="w-2 h-2 bg-dark-text-secondary rounded-full animate-pulse delay-150"></span>
                          <span className="w-2 h-2 bg-dark-text-secondary rounded-full animate-pulse delay-300"></span>
                      </div>
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="p-4 border-t border-dark-border flex items-center">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 bg-dark-bg border border-dark-border rounded-l-md p-2 text-dark-text-secondary focus:ring-1 focus:ring-brand-primary focus:outline-none"
            />
            <button type="submit" className="bg-brand-primary text-white p-2 rounded-r-md hover:bg-brand-secondary disabled:bg-gray-500" disabled={isTyping}>
              <SendIcon />
            </button>
          </form>
        </div>
      )}
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default ChatWidget;
