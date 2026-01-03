import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Film } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

const CineBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'model', text: "Hi there! I'm CineBot. Are you in the mood for some Hollywood action or a Bollywood drama today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const { getToken } = useAuth();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Prepare history for the API (excluding the last user message we just added locally for display)
            // The API expects history in a specific format if we were using the full chat object, 
            // but our controller reconstructs it. 
            // Our controller expects: { message, history: [{ role: "user"|"model", parts: [{ text: "..." }] }] }

            const historyForApi = messages.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }]
            }));

            const token = await getToken();
            const response = await axios.post('https://cinemax-server-rho.vercel.app/api/cinebot/chat', {
                message: input,
                history: historyForApi
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const botMessage = { role: 'model', text: response.data.response };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages(prev => [...prev, { role: 'model', text: "I'm having a little trouble connecting to the cinema database right now. Please try again later!" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    // Check for "Booking Page" in the text to render a link/button
    const renderMessageText = (text) => {
        if (text.includes("Booking Page")) {
            const parts = text.split("Booking Page");
            return (
                <span>
                    {parts[0]}
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            navigate('/movies'); // Redirect to movies page to select a show
                        }}
                        className="text-blue-400 underline font-bold hover:text-blue-300"
                    >
                        Booking Page
                    </button>
                    {parts[1]}
                </span>
            );
        }
        return text;
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* Chat Window */}
            {isOpen && (
                <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-80 sm:w-96 h-[500px] flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-white">
                            <Film className="w-5 h-5" />
                            <h3 className="font-bold text-lg">CineBot</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900/95">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-gray-700 text-gray-100 rounded-bl-none'
                                        }`}
                                >
                                    {renderMessageText(msg.text)}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-700 text-gray-100 p-3 rounded-2xl rounded-bl-none text-sm flex gap-1 items-center">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-gray-800 border-t border-gray-700 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Ask for a movie..."
                            className="flex-1 bg-gray-700 text-white placeholder-gray-400 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <button
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-full transition-colors"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </button>
        </div>
    );
};

export default CineBot;
