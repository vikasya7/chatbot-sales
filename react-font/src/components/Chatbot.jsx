import React, { useEffect, useState, useRef } from 'react';
import API from '../services/api';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [expectingOrderId, setExpectingOrderId] = useState(false);
  const chatEndRef = useRef(null);

  const ProductCard = ({ product }) => (
    <div className="border p-3 rounded-lg bg-white shadow w-full sm:w-64">
      <img
        src={product.image_url || "https://via.placeholder.com/200x150?text=No+Image"}
        alt={product.name}
        className="w-full h-32 object-cover mb-2 rounded"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/200x150?text=No+Image";
        }}
      />
      <h3 className="font-semibold text-sm sm:text-base">{product.name}</h3>
      <p className="text-xs text-gray-600 mb-1">Brand: {product.brand}</p>
      <p className="text-xs text-gray-800 mb-1">₹{product.price}</p>
      <p className="text-[10px] text-gray-500 mb-1">{product.description}</p>
      <p className="text-yellow-500 text-xs">
        {"⭐".repeat(Math.round(product.rating))} ({product.rating})
      </p>
    </div>
  );

  useEffect(() => {
    const saved = localStorage.getItem('chat');
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([
        {
          text: 'Hi! How can I help you shop today?',
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chat', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSending = async () => {
    if (!input.trim()) return;

    const userMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');

    try {
      if (expectingOrderId) {
        //  Call /track-order
        const res = await API.post('/track-order', { order_id: currentInput });
        const botMsg = {
          text: `✅ Order Status for ${currentInput}: ${res.data.status}`,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
        setExpectingOrderId(false);
        return;
      }

      //  Check if user is asking about tracking
      if (
        currentInput.toLowerCase().includes('track') &&
        currentInput.toLowerCase().includes('order')
      ) {
        const botMsg = {
          text: 'Please provide your Order ID.',
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
        setExpectingOrderId(true);
        return;
      }

      // Else Normal chatbot product query
      const res = await API.post('/chatbot-query', { query: currentInput });

      if (res.data.length === 0) {
        const noMatch = {
          text: "Sorry, I couldn't find anything for that.",
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, noMatch]);
      } else {
        res.data.forEach((product) => {
          const productReply = {
            sender: "bot",
            timestamp: new Date(),
            type: "product",
            data: product,
          };
          setMessages((prev) => [...prev, productReply]);
        });
      }
    } catch (err) {
      const errorReply = {
        text: 'Something went wrong. Try again later.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorReply]);
    }
  };

  const handleReset = () => {
    const welcome = {
      text: 'Hi! How can I help you shop today?',
      sender: 'bot',
      timestamp: new Date(),
    };
    setMessages([welcome]);
    setExpectingOrderId(false);
    localStorage.removeItem('chat');
  };

  return (
    <div className="flex flex-col max-h-[90vh] h-full sm:h-[90vh] max-w-2xl mx-auto shadow-md bg-white rounded-lg ">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-500 ">
        <h2 className="font-semibold text-lg text-white">Sales Assistant</h2>
        <button
          onClick={handleReset}
          className="text-sm text-white border px-2 py-1 rounded hover:bg-red-600"
        >
          Reset
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-gray-100 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col max-w-[80%] ${
              msg.sender === 'user' ? 'ml-auto items-end' : 'items-start'
            }`}
          >
            <div
              className={`p-3 rounded-xl shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800'
              }`}
            >
              {msg.type === "product" ? (
                <ProductCard product={msg.data} />
              ) : (
                msg.text
              )}
            </div>
            <span className="text-[10px] text-gray-400 mt-1">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="flex w-full border-t bg-white p-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSending()}
          className="flex-1 border p-2 rounded-l-md text-sm"
          placeholder="Type your query here..."
        />
        <button
          onClick={handleSending}
          className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-r-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;









