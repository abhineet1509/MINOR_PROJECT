// Chatbot.jsx
import React, { useState, useRef, useEffect, useContext } from "react";
import { FaHeadset, FaChevronDown } from "react-icons/fa6";
import { AppContext } from "../context/AppContext.jsx";

const Chatbot = () => {
  const { backendUrl } = useContext(AppContext);

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! How can I help you?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      console.log("BACKEND URL: ", backendUrl);
      console.log("ENV:", import.meta.env.VITE_BACKEND_URL);

      const res = await fetch( backendUrl + "api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      const botMessage = { from: "bot", text: data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Sorry, something went wrong. Please try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-10 right-12 z-[9999]">
      <div
        className="bg-red-600 text-white border-none rounded-full p-3 shadow-md hover:scale-110 transition-transform cursor-pointer"
        onClick={toggleChat}
      >
        <FaHeadset size={24} />
      </div>

      {isOpen && (
        <div
          className="w-[80vw] max-w-[400px] h-[60vh] max-h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden absolute bottom-16 right-0 animate-[popUp_0.45s_ease-out]"
          ref={chatRef}
        >
          <div className="bg-red-600 text-white px-4 py-3 flex justify-between items-center font-bold text-base">
            <span>Gemini Chatbot</span>
            <FaChevronDown 
              onClick={toggleChat} 
              className="cursor-pointer hover:scale-110 transition-transform" 
            />
          </div>

          <div className="flex-1 flex flex-col gap-1.5 p-3 overflow-y-auto">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <p
                  className={`text-left text-sm px-4 py-2 rounded-2xl max-w-[70%] break-words ${
                    msg.from === 'user' 
                      ? 'bg-cyan-100 text-gray-800' 
                      : 'bg-blue-50 text-gray-800'
                  }`}
                >
                  {msg.text}
                </p>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <p className="bg-blue-50 text-gray-800 text-sm px-4 py-2 rounded-2xl max-w-[70%]">
                  Typing...
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center px-3 py-2 bg-gray-100 rounded-full m-3 border border-gray-300 hover:shadow-md transition-shadow">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyDown={handleKeyDown}
              className="flex-1 border-none outline-none bg-transparent px-3 py-1 text-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
