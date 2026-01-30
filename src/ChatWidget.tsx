import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessagesSquare } from 'lucide-react';

// --- TİPOGRAFİ (Moda Dergisi Havası) ---
const typographyStyle = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&family=Playfair+Display:wght@700&display=swap');
`;

// --- KAYDIRMA ÇUBUĞU STİLİ (İnce ve Gri/Pembe) ---
const scrollbarStyle = `
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #e5e7eb; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: #d1d5db; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #E91E63; }
@keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
`;

// Renk Paleti (Dr. Salomon)
const BRAND_PINK = '#E91E63';
const BRAND_DARK = '#333333';
const BG_WHITE = '#FFFFFF';
const CHARCOAL = '#333333';
const BOOKING_URL = 'https://drjsalomon.com/contact-us/';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  options?: { label: string; value: string; category?: string }[];
  description?: string;
}

// DR. JHONNY SALOMON HİZMET MENÜSÜ (Birebir Site Yapısı)
const procedureData: { [key: string]: { label: string; value: string; category: string }[] } = {
  face: [
    { label: 'Facelift', value: 'facelift', category: 'face' },
    { label: 'Rhinoplasty', value: 'rhinoplasty', category: 'face' },
    { label: 'Blepharoplasty (Eyelids)', value: 'blepharoplasty', category: 'face' },
    { label: 'Brow Lift', value: 'browlift', category: 'face' },
    { label: 'Otoplasty (Ears)', value: 'otoplasty', category: 'face' },
    { label: 'Chin Implants', value: 'chinimplants', category: 'face' },
    { label: 'Cheek Implants', value: 'cheekimplants', category: 'face' },
    { label: 'Dimple Creation', value: 'dimplecreation', category: 'face' },
    { label: 'Fat Grafting', value: 'fatgrafting', category: 'face' },
    { label: 'Neck Lift', value: 'necklift', category: 'face' },
  ],
  breast: [
    { label: 'Breast Augmentation', value: 'breastaug', category: 'breast' },
    { label: 'Breast Lift', value: 'breastlift', category: 'breast' },
    { label: 'Breast Reduction', value: 'breastreduction', category: 'breast' },
    { label: 'Breast Revision', value: 'breastrevision', category: 'breast' },
    { label: 'Inverted Nipple Correction', value: 'invertednipple', category: 'breast' },
    { label: 'Breast Reconstruction', value: 'breastrecon', category: 'breast' },
  ],
  body: [
    { label: 'Tummy Tuck', value: 'tummytuck', category: 'body' },
    { label: 'Liposuction', value: 'liposuction', category: 'body' },
    { label: 'Brazilian Butt Lift (BBL)', value: 'bbl', category: 'body' },
    { label: 'Mommy Makeover', value: 'mommymakeover', category: 'body' },
    { label: 'Thigh Lift', value: 'thighlift', category: 'body' },
    { label: 'Arm Lift', value: 'armlift', category: 'body' },
    { label: 'Labiaplasty', value: 'labiaplasty', category: 'body' },
    { label: 'Calf Implants', value: 'calfimplants', category: 'body' },
    { label: 'Gluteal Implants', value: 'glutealimplants', category: 'body' },
  ],
  medspa: [
    { label: 'Botox & Dysport', value: 'botox', category: 'medspa' },
    { label: 'Dermal Fillers', value: 'fillers', category: 'medspa' },
    { label: 'Kybella', value: 'kybella', category: 'medspa' },
    { label: 'Sculptra & Radiesse', value: 'sculptra', category: 'medspa' },
    { label: 'ThermiVa (Feminine)', value: 'thermiva', category: 'medspa' },
    { label: 'ThermiTight', value: 'thermitight', category: 'medspa' },
    { label: 'Ultherapy', value: 'ultherapy', category: 'medspa' },
    { label: 'CoolSculpting', value: 'coolsculpting', category: 'medspa' },
    { label: 'Fraxel Laser', value: 'fraxel', category: 'medspa' },
    { label: 'GentleYAG Laser', value: 'gentleyag', category: 'medspa' },
    { label: 'Stem Cell Therapy', value: 'stemcell', category: 'medspa' },
  ],
  men: [
    { label: 'Gynecomastia', value: 'gynecomastia', category: 'men' },
    { label: 'Male Liposuction', value: 'malelipo', category: 'men' },
    { label: 'Pectoral Etching', value: 'pecetching', category: 'men' },
    { label: 'Calf Implants (Men)', value: 'malecalf', category: 'men' },
    { label: 'Chin Augmentation', value: 'malechin', category: 'men' },
  ],
};

// SANATSAL & ÖZEL İŞLEM AÇIKLAMALARI
const procedureDescriptions: { [key: string]: string } = {
  facelift: "Approaching the face as a canvas, Dr. Salomon restores youthfulness while maintaining your unique identity.",
  rhinoplasty: "Dr. Salomon specializes in refining nasal structures to achieve aesthetic harmony and balance.",
  dimplecreation: "A signature subtle procedure to create a natural, charming smile, performed with artistic precision.",
  breastaug: "Enhancing breast size and shape using top-tier implants for a natural, proportional result.",
  bbl: "Sculpting curves by transferring your own body fat to the buttocks for a fuller, lifted contour.",
  calfimplants: "Enhance the shape and volume of the lower legs for a more balanced, athletic physique.",
  thermiva: "Advanced temperature-controlled radio frequency for feminine wellness and rejuvenation without surgery.",
  stemcell: "Regenerative therapy using exosomes to revitalize your body and skin from within.",
  botox: "Smooth fine lines and prevent wrinkles with precise, natural-looking injectable treatments.",
};

const ASSISTANT_AVATAR_STYLE: React.CSSProperties = {
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  objectFit: 'cover',
  objectPosition: '75% 20%',
  transform: 'scale(1.3)',
  imageRendering: 'auto',
  WebkitFontSmoothing: 'antialiased',
  border: '2px solid #E91E63',
  marginRight: '12px',
  flexShrink: 0,
};

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Welcome to Dr. Jhonny Salomon's practice. I am your AI Concierge. How can we enhance your artistry today?",
      sender: 'bot',
      options: [
        { label: 'Face Procedures', value: 'face' },
        { label: 'Breast Surgery', value: 'breast' },
        { label: 'Body Contouring', value: 'body' },
        { label: 'MedSpa & Non-Surgical', value: 'medspa' },
        { label: 'For Men', value: 'men' },
      ],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  useEffect(() => {
    const timer = setTimeout(() => setIsPulsing(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  // --- SEARCH ENGINE: processInput(text) — robust free-text handling ---
  type ProcessResult = { text: string; description?: string; options?: { label: string; value: string; category?: string }[] };

  const processInput = (text: string): ProcessResult => {
    const lower = text.toLowerCase().trim();
    if (!lower) {
      return { text: "Our patient coordinators are best equipped to handle specific medical inquiries. Would you like to schedule a consultation with Dr. Salomon in Miami or New York?" };
    }

    // 1. GLOBAL KEYWORDS — Price / cost / quote
    if (/\b(price|cost|quote)\b/.test(lower)) {
      return {
        text: "Dr. Salomon believes every patient is unique. An exact quote requires an in-person assessment. Would you like to schedule a consultation?",
        description: 'yes',
      };
    }

    // 2. GLOBAL KEYWORDS — Location
    if (/\b(location|where|miami|new york|address)\b/.test(lower)) {
      return { text: "We are located in Coral Gables (Miami) and New York. Which location do you prefer?" };
    }

    // 3. GLOBAL KEYWORDS — Greeting
    if (/\b(hello|hi|hey)\b/.test(lower)) {
      return { text: "Hello! Welcome to Dr. Salomon's practice. I'm your AI assistant. Are you interested in Face, Body, or Breast procedures?" };
    }

    // 4. CATEGORY DETECTION (Menu trigger) — face, body, breast, medspa (and men)
    const categoryMatch = lower.match(/\b(face|body|breast|medspa|men)\b/);
    if (categoryMatch) {
      const category = categoryMatch[1];
      if (procedureData[category]) {
        const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
        return {
          text: `Which specific procedure within ${categoryLabel} are you interested in?`,
          options: procedureData[category],
        };
      }
    }

    // 5. DEEP SEARCH — Loop ALL procedureData; if input contains a procedure label, return its description
    for (const category of Object.keys(procedureData)) {
      for (const item of procedureData[category]) {
        const labelLower = item.label.toLowerCase();
        const valueLower = item.value.toLowerCase();
        if (lower.includes(labelLower) || lower.includes(valueLower)) {
          const desc = procedureDescriptions[item.value];
          if (desc) {
            return { text: desc, description: 'yes' };
          }
          return {
            text: `We offer ${item.label}. Would you like to schedule a consultation with Dr. Salomon?`,
            description: 'yes',
          };
        }
      }
    }

    // 6. FALLBACK
    return {
      text: "Our patient coordinators are best equipped to handle specific medical inquiries. Would you like to schedule a consultation with Dr. Salomon in Miami or New York?",
    };
  };

  const handleOptionClick = async (optionValue: string, optionLabel?: string) => {
    const displayText = optionLabel ?? procedureData[optionValue] ? optionValue.charAt(0).toUpperCase() + optionValue.slice(1) : optionValue;
    const userMessage: Message = {
      id: messages.length + 1,
      text: displayText,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    let botResponse: Message;

    if (procedureData[optionValue]) {
      const categoryOptions = procedureData[optionValue];
      const categoryLabel = optionValue.charAt(0).toUpperCase() + optionValue.slice(1);
      botResponse = {
        id: messages.length + 2,
        text: `Excellent choice. Which specific procedure within ${categoryLabel} are you interested in?`,
        sender: 'bot',
        options: categoryOptions,
      };
    } else if (procedureDescriptions[optionValue]) {
      botResponse = {
        id: messages.length + 2,
        text: procedureDescriptions[optionValue],
        sender: 'bot',
        description: procedureDescriptions[optionValue],
      };
    } else {
      botResponse = {
        id: messages.length + 2,
        text: "I'd be happy to provide more details on that. Would you like to schedule a consultation with Dr. Salomon?",
        sender: 'bot',
        description: "Please schedule a consultation for personalized information.",
      };
    }

    setMessages((prev) => [...prev, botResponse]);
    setIsTyping(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const trimmedInput = inputText.trim();
    const userMessage: Message = {
      id: messages.length + 1,
      text: trimmedInput,
      sender: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const result = processInput(trimmedInput);
    const botResponse: Message = {
      id: messages.length + 2,
      text: result.text,
      sender: 'bot',
      ...(result.description && { description: result.description }),
      ...(result.options && result.options.length > 0 && { options: result.options }),
    };
    setMessages((prev) => [...prev, botResponse]);
    setIsTyping(false);
  };

  const openBooking = () => {
    window.open(BOOKING_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <style>{typographyStyle}</style>
      <style>{scrollbarStyle}</style>
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 1000,
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                bottom: '76px',
                right: 0,
                width: '90vw',
                maxWidth: '380px',
                height: '600px',
                maxHeight: '80vh',
                backgroundColor: BG_WHITE,
                borderRadius: '16px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                border: `1px solid ${BRAND_DARK}`,
              }}
            >
              {/* HEADER - PEMBE ŞERİT & KOYU LOGO ALANI */}
              <div
                style={{
                  borderTop: '4px solid #E91E63',
                  backgroundColor: BRAND_DARK,
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: '70px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src="/assistant.jpg"
                    alt="Assistant"
                    style={ASSISTANT_AVATAR_STYLE}
                  />
                  <div>
                    <div
                      style={{
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '15px',
                        fontFamily: "'Playfair Display', serif",
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                      }}
                    >
                      Dr. JHONNY SALOMON
                    </div>
                    <div
                      style={{
                        color: '#d1d5db',
                        fontSize: '11px',
                        letterSpacing: '0.04em',
                        fontFamily: "'Montserrat', sans-serif",
                        marginTop: '2px',
                      }}
                    >
                      Plastic Surgery & Med Spa | AI Concierge
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  aria-label="Close chat"
                >
                  <X size={22} />
                </button>
              </div>

              {/* CHAT BODY - SCROLL ALANI */}
              <div
                className="custom-scrollbar"
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  overflowAnchor: 'none',
                  scrollBehavior: 'smooth',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  background: BG_WHITE,
                }}
              >
                {messages.map((msg, i) => (
                  <div
                    key={msg.id}
                    ref={i === messages.length - 1 ? lastMessageRef : null}
                    style={{
                      display: 'flex',
                      justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                      alignItems: 'flex-end',
                      marginBottom: '8px',
                    }}
                  >
                    {msg.sender === 'bot' && (
                      <img
                        src="/assistant.jpg"
                        alt="Assistant"
                        style={ASSISTANT_AVATAR_STYLE}
                      />
                    )}
                    <div
                      style={{
                        maxWidth: '85%',
                        padding: '14px 18px',
                        borderRadius: msg.sender === 'user' ? '16px 16px 0 16px' : '12px',
                        borderTopLeftRadius: msg.sender === 'bot' ? '2px' : '16px',
                        borderTopRightRadius: msg.sender === 'user' ? '16px' : '12px',
                        background: msg.sender === 'user' ? BRAND_PINK : BG_WHITE,
                        color: msg.sender === 'user' ? '#FFFFFF' : CHARCOAL,
                        border: msg.sender === 'bot' ? '1px solid #f3f4f6' : 'none',
                        boxShadow: msg.sender === 'bot' ? '0 4px 15px rgba(0,0,0,0.05)' : 'none',
                        fontSize: '14px',
                        lineHeight: 1.5,
                        fontFamily: "'Montserrat', sans-serif",
                      }}
                    >
                      {msg.text}
                      {msg.options && msg.options.length > 0 && (
                        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {msg.options.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => handleOptionClick(opt.value, opt.label)}
                              style={{
                                padding: '12px 16px',
                                background: BG_WHITE,
                                border: '1px solid #E91E63',
                                borderRadius: '12px',
                                color: BRAND_PINK,
                                cursor: 'pointer',
                                textAlign: 'left',
                                fontWeight: 500,
                                fontSize: '14px',
                                fontFamily: "'Montserrat', sans-serif",
                                transition: 'all 0.2s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = BRAND_PINK;
                                e.currentTarget.style.color = '#FFFFFF';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = BG_WHITE;
                                e.currentTarget.style.color = BRAND_PINK;
                              }}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}
                      {msg.description && !msg.options?.length && (
                        <button
                          type="button"
                          onClick={openBooking}
                          style={{
                            marginTop: '12px',
                            padding: '10px 16px',
                            background: BRAND_PINK,
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '24px',
                            fontWeight: 600,
                            fontSize: '13px',
                            cursor: 'pointer',
                            fontFamily: "'Montserrat', sans-serif",
                          }}
                        >
                          Schedule a Consultation
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: '8px' }}>
                    <img src="/assistant.jpg" alt="Assistant" style={ASSISTANT_AVATAR_STYLE} />
                    <div
                      style={{
                        background: BG_WHITE,
                        border: '1px solid #f3f4f6',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                        padding: '14px 18px',
                        borderRadius: '12px',
                        borderTopLeftRadius: '2px',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[0, 1, 2].map((j) => (
                          <span
                            key={j}
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: BRAND_PINK,
                              animation: 'pulse 1s ease-in-out infinite',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* FLOATING INPUT ALANI - Kapsül Görünüm */}
              <div
                style={{
                  padding: '12px 16px 16px',
                  background: BG_WHITE,
                  boxShadow: '0 -10px 30px rgba(0,0,0,0.05)',
                  borderTop: '1px solid #f3f4f6',
                }}
              >
                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..."
                    style={{
                      flex: 1,
                      padding: '12px 18px',
                      borderRadius: '24px',
                      border: '1px solid #e5e7eb',
                      background: '#F9FAFB',
                      fontSize: '14px',
                      fontFamily: "'Montserrat', sans-serif",
                      color: CHARCOAL,
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: BRAND_PINK,
                      border: 'none',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                    aria-label="Send"
                  >
                    <Send size={20} />
                  </button>
                </form>
                <div
                  style={{
                    fontSize: '10px',
                    color: CHARCOAL,
                    opacity: 0.8,
                    textAlign: 'center',
                    marginTop: '8px',
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  Miami (305) 270-1361 | Not medical advice.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAB - Intense Heartbeat & Ripple Wave */}
        <div style={{ position: 'relative', width: '64px', height: '64px' }}>
          {!isOpen && isPulsing && (
            <>
              <motion.div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  backgroundColor: BRAND_PINK,
                  zIndex: -1,
                  pointerEvents: 'none',
                }}
                initial={{ opacity: 0.6, scale: 1 }}
                animate={{ opacity: 0, scale: 1.8 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
              />
              <motion.div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  backgroundColor: BRAND_PINK,
                  zIndex: -1,
                  pointerEvents: 'none',
                }}
                initial={{ opacity: 0.6, scale: 1 }}
                animate={{ opacity: 0, scale: 1.8 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
              />
            </>
          )}
          <motion.button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            style={{
              position: 'relative',
              zIndex: 10,
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: BRAND_PINK,
              border: 'none',
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(233, 30, 99, 0.4)',
            }}
            animate={!isOpen && isPulsing ? { scale: [1, 1.1, 1], boxShadow: ['0 4px 20px rgba(233, 30, 99, 0.4)', '0 10px 40px rgba(233, 30, 99, 0.9)', '0 4px 20px rgba(233, 30, 99, 0.4)'] } : { scale: 1 }}
            transition={!isOpen && isPulsing ? { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } : {}}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isOpen ? 'Close chat' : 'Open chat'}
          >
            {isOpen ? <X size={28} /> : <MessagesSquare size={24} />}
          </motion.button>
        </div>
      </div>
    </>
  );
};

export default ChatWidget;
