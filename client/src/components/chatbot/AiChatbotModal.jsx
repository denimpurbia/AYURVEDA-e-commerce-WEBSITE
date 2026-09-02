import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Leaf,
  ShoppingBag,
  ArrowRight,
  LockKeyhole,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { useCart } from '../../context/CartContext';

const AiChatbotModal = ({ isOpen, onClose }) => {
  const { addToCart } = useCart();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  /* ============================================================
     CHECK LOGIN STATUS
  ============================================================ */

  useEffect(() => {
    const checkAuthentication = async () => {
      if (!isOpen) return;

      setCheckingAuth(true);

      try {
        const res = await API.get('/auth/me');

        if (res?.success && res?.data) {
          setIsAuthenticated(true);

          setMessages([
            {
              sender: 'ai',
              text:
                'Namaste! I am **Ayurveda AI**, your personal shopping guide. How can I help you discover authentic Ayurvedic wellness products today?',
              products: [],
            },
          ]);
        } else {
          setIsAuthenticated(false);

          setMessages([
            {
              sender: 'guest',
              text:
                '🔐 Please login to use Ayurveda AI.\n\nLogin to get personalized Ayurvedic product recommendations, discover products, and use our AI shopping assistant.',
              products: [],
            },
          ]);
        }
      } catch (error) {
        setIsAuthenticated(false);

        setMessages([
          {
            sender: 'guest',
            text:
              '🔐 Please login to use Ayurveda AI.\n\nLogin to get personalized Ayurvedic product recommendations, discover products, and use our AI shopping assistant.',
            products: [],
          },
        ]);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, [isOpen]);

  /* ============================================================
     SCROLL TO BOTTOM
  ============================================================ */

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen, loading]);

  /* ============================================================
   LOCK BACKGROUND SCROLL WHEN CHAT IS OPEN
============================================================ */

useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }

  return () => {
    document.body.style.overflow = '';
  };
}, [isOpen]);


  if (!isOpen) return null;

  /* ============================================================
     SEND MESSAGE
  ============================================================ */

  const handleSend = async (queryText) => {
    if (!isAuthenticated) {
      return;
    }

    const textToSend = queryText || input;

    if (!textToSend.trim()) return;

    const userMsg = {
      sender: 'user',
      text: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);

    if (!queryText) {
      setInput('');
    }

    setLoading(true);

    try {
      const res = await API.post('/chat', {
        message: textToSend,
      });

      if (res.success && res.data) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: res.data.reply,
            products: res.data.products || [],
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text:
            'I apologize, I am temporarily having trouble connecting to our server. Please try again in a moment.',
          products: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[200]
        flex
        items-center
        justify-center
        bg-black/40
        backdrop-blur-sm
        p-3
        sm:items-center
        sm:justify-end
        sm:p-6
      "
    >
      <div
        className="
          w-full
          max-w-[520px]
          h-[calc(100dvh-10rem)]
          min-h-[420px]
          max-h-[680px]
          sm:w-[420px]
          sm:h-[600px]
          sm:max-h-[calc(100dvh-3rem)]
          bg-[#FFFDF8]
          rounded-3xl
          shadow-2xl
          border
          border-[#EAE1D2]
          flex
          flex-col
          overflow-hidden
          animate-in
          fade-in
          slide-in-from-bottom
          duration-300
        "
      >

        {/* =====================================================
            CHATBOT HEADER
        ===================================================== */}

        <div className="shrink-0 bg-[#123D2A] text-white p-4 flex items-center justify-between border-b border-[#789B72]/30">

          <div className="flex items-center space-x-3">

            <div className="w-9 h-9 rounded-full bg-[#C49A52] text-[#0B2D1E] flex items-center justify-center shadow-md">
              <Bot className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-serif font-bold text-base text-white tracking-wide">
                AYURVEDA AI
              </h3>

              <p className="text-[10px] text-emerald-100/80">
                Your Ayurvedic shopping Assistant
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors"
            aria-label="Close Ayurveda AI"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

        {/* =====================================================
            AUTH CHECK LOADING
        ===================================================== */}

        {checkingAuth ? (

          <div className="flex-1 min-h-0 flex items-center justify-center">

            <div className="flex flex-col items-center gap-3 text-[#123D2A]">

              <Leaf className="w-7 h-7 animate-spin" />

              <p className="text-xs font-semibold">
                Checking your account...
              </p>

            </div>

          </div>

        ) : !isAuthenticated ? (

          /* ===================================================
             GUEST USER
          =================================================== */

          <div className="flex-1 min-h-0 flex items-center justify-center p-6 overflow-y-auto">

            <div className="w-full text-center">

              <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-[#123D2A] flex items-center justify-center shadow-lg">

                <LockKeyhole className="w-7 h-7 text-[#C49A52]" />

              </div>

              <h3 className="text-xl font-serif font-bold text-[#123D2A] mb-2">
                Login Required
              </h3>

              <p className="text-sm text-[#7A6248] leading-relaxed mb-6">
                Please login to use Ayurveda AI.
                <br />
                Get personalized Ayurvedic recommendations
                and discover products with our AI shopping assistant.
              </p>

              <Link
                to="/login"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#123D2A] text-white font-semibold text-sm hover:bg-[#0B2D1E] transition-colors shadow-md"
              >
                Login to Continue

                <ArrowRight className="w-4 h-4 text-[#C49A52]" />

              </Link>

              <p className="mt-4 text-[11px] text-[#7A6248]">
                Don't have an account? You can register first.
              </p>

            </div>

          </div>

        ) : (

          <>
            {/* ===================================================
                QUICK SUGGESTIONS
            =================================================== */}

            <div className="shrink-0 bg-[#F7F2E8] px-3 py-2 border-b border-[#EAE1D2] flex items-center gap-2 overflow-x-auto text-[11px] font-semibold text-[#123D2A]">

              <button
                type="button"
                onClick={() =>
                  handleSend('Show immunity products')
                }
                className="px-2.5 py-1 bg-[#FFFDF8] border border-[#789B72]/40 rounded-full hover:bg-[#123D2A] hover:text-white transition-colors whitespace-nowrap"
              >
                🌿 Immunity Kadha
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSend('Show products under ₹500')
                }
                className="px-2.5 py-1 bg-[#FFFDF8] border border-[#789B72]/40 rounded-full hover:bg-[#123D2A] hover:text-white transition-colors whitespace-nowrap"
              >
                💰 Under ₹500
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSend('Best hair growth oils')
                }
                className="px-2.5 py-1 bg-[#FFFDF8] border border-[#789B72]/40 rounded-full hover:bg-[#123D2A] hover:text-white transition-colors whitespace-nowrap"
              >
                ✨ Hair Care
              </button>

            </div>

            {/* ===================================================
                CHAT MESSAGES
            =================================================== */}

            <div className="flex-1 min-h-0 p-4 overflow-y-auto overscroll-contain space-y-4 text-xs">

              {messages.map((msg, idx) => (

                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-[#123D2A] text-white rounded-br-none'
                        : 'bg-[#F7F2E8] text-[#243229] border border-[#EAE1D2] rounded-bl-none'
                    }`}
                  >

                    <p className="leading-relaxed whitespace-pre-line font-medium">
                      {msg.text}
                    </p>

                    {/* RETURNED PRODUCTS */}

                    {msg.products &&
                      msg.products.length > 0 && (

                        <div className="pt-2 grid grid-cols-1 gap-2 border-t border-[#EAE1D2]">

                          <span className="text-[10px] font-bold text-[#7A6248] uppercase">
                            Recommended Products:
                          </span>

                          {msg.products.map((p) => (

                            <div
                              key={p._id}
                              className="bg-[#FFFDF8] p-2 rounded-xl border border-[#EAE1D2] flex items-center justify-between gap-2 shadow-xs"
                            >

                              <div className="flex items-center space-x-2 min-w-0">

                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-10 h-10 object-cover rounded-lg shrink-0"
                                />

                                <div className="min-w-0">

                                  <h5 className="font-bold text-[11px] text-[#123D2A] line-clamp-1">
                                    {p.name}
                                  </h5>

                                  <span className="text-[10px] font-bold text-[#C49A52]">
                                    ₹{p.price}
                                  </span>

                                </div>

                              </div>

                              <div className="flex items-center space-x-1 shrink-0">

                                <button
                                  type="button"
                                  onClick={() =>
                                    addToCart(p, 1)
                                  }
                                  className="p-1.5 rounded-lg bg-[#123D2A] text-white hover:bg-[#0B2D1E]"
                                  title="Add to Cart"
                                >
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                </button>

                                <Link
                                  to={`/product/${p.slug || p._id}`}
                                  onClick={onClose}
                                  className="p-1.5 rounded-lg bg-[#F7F2E8] text-[#123D2A] hover:bg-[#EAE1D2]"
                                  title="View Details"
                                >
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </Link>

                              </div>

                            </div>

                          ))}

                        </div>

                      )}

                  </div>

                </div>

              ))}

              {/* LOADING */}

              {loading && (

                <div className="flex justify-start">

                  <div className="bg-[#F7F2E8] p-3 rounded-2xl border border-[#EAE1D2] flex items-center space-x-2 text-[#789B72]">

                    <Leaf className="w-4 h-4 animate-spin text-[#123D2A]" />

                    <span className="text-xs text-[#123D2A] font-semibold">
                      Ayurveda AI is thinking...
                    </span>

                  </div>

                </div>

              )}

              <div ref={messagesEndRef} />

            </div>

            {/* ===================================================
                INPUT AREA
            =================================================== */}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="
                shrink-0
                p-3
                pb-[calc(0.75rem+env(safe-area-inset-bottom))]
                bg-[#FFFDF8]
                border-t
                border-[#EAE1D2]
                flex
                items-center
                gap-2
              "
            >

              <input
                type="text"
                placeholder="Ask about kadhas, oils, or products..."
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                className="flex-1 min-w-0 px-4 py-2.5 text-xs bg-[#F7F2E8] border border-[#789B72]/30 rounded-full focus:outline-none focus:ring-1 focus:ring-[#123D2A]"
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="shrink-0 p-2.5 rounded-full bg-[#123D2A] text-white disabled:opacity-50 hover:bg-[#0B2D1E] transition-colors shadow-sm"
                aria-label="Send message"
              >
                <Send className="w-4 h-4 text-[#C49A52]" />
              </button>

            </form>

          </>

        )}

      </div>

    </div>
  );
};

export default AiChatbotModal;