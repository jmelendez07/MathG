import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
    {
        id: '1',
        text: '¡Hola! 👋 Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?',
        sender: 'bot',
        timestamp: new Date(),
    },
];

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        const messageToSend = inputValue;
        setInputValue('');
        setIsTyping(true);

        try {
            const response = await axios.post('/chatbot/message', {
                message: messageToSend,
            });

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: response.data.data,
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
            setIsTyping(false);
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta nuevamente.',
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50">
                <AnimatePresence>
                    {!isOpen && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.3, type: 'spring', stiffness: 260, damping: 20 }}
                        >
                            <Button
                                onClick={() => setIsOpen(true)}
                                className="group h-14 w-14 transform cursor-pointer rounded-full border-2 border-purple-400 bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg transition-all duration-300 hover:scale-110 hover:from-purple-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-purple-500/50"
                                aria-label="Abrir chat"
                            >
                                <MessageCircle className="size-6.5 text-white transition-transform group-hover:rotate-12" />
                                <span className="absolute -top-1 -right-1 flex h-5 w-5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pink-400 opacity-75"></span>
                                    <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-pink-500">
                                        <Sparkles className="h-3 w-3 text-white" />
                                    </span>
                                </span>
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 100, opacity: 0 }}
                        transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
                        className="fixed bottom-6 right-6 z-50 w-80 md:w-96"
                    >
                        <div className="overflow-hidden rounded-2xl border-2 border-purple-300/60 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-800 shadow-2xl backdrop-blur-lg">
                            <motion.div
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1, duration: 0.3 }}
                                className="flex items-center justify-between border-b border-purple-400/30 bg-black/20 px-4 py-3 backdrop-blur-sm"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <MessageCircle className="h-6 w-6 text-purple-300" />
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.3, type: 'spring', stiffness: 500, damping: 15 }}
                                            className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-purple-900 bg-green-400"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-jersey text-xl leading-5 font-[100] tracking-wider text-white">
                                            Asistente GamePA
                                        </h3>
                                        <p className="font-jersey text-base tracking-wider leading-4 text-purple-300">Siempre listo para ayudar</p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsOpen(false)}
                                    className="cursor-pointer h-8 w-8 text-purple-300 hover:bg-purple-600/20 hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </Button>
                            </motion.div>

                            <ScrollArea className="h-96 px-4 py-4" ref={scrollRef}>
                                <div className="space-y-4">
                                    {messages.map((message, index) => (
                                        <motion.div
                                            key={message.id}
                                            initial={{ x: message.sender === 'user' ? 50 : -50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.1, duration: 0.3 }}
                                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                                    message.sender === 'user'
                                                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                                                        : 'bg-white/10 text-purple-100 backdrop-blur-sm'
                                                }`}
                                            >
                                                <p className="text-sm">{message.text}</p>
                                                <span className="mt-1 block text-xs opacity-70">
                                                    {message.timestamp.toLocaleTimeString('es-ES', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {isTyping && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex justify-start"
                                        >
                                            <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
                                                <div className="flex space-x-2">
                                                    <div className="h-2 w-2 animate-bounce rounded-full bg-purple-400 [animation-delay:-0.3s]"></div>
                                                    <div className="h-2 w-2 animate-bounce rounded-full bg-purple-400 [animation-delay:-0.15s]"></div>
                                                    <div className="h-2 w-2 animate-bounce rounded-full bg-purple-400"></div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </ScrollArea>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                                className="border-t border-purple-400/30 bg-black/20 p-4 backdrop-blur-sm"
                            >
                                <div className="flex items-center space-x-2">
                                    <Input
                                        ref={inputRef}
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Escribe tu mensaje..."
                                        className="font-jersey !text-lg leading-4 tracking-wider font-extralight border-purple-400/30 bg-white/10 text-white placeholder:text-purple-300/50 focus:border-purple-400 focus:ring-purple-400"
                                        disabled={isTyping}
                                    />
                                    <Button
                                        onClick={handleSendMessage}
                                        disabled={!inputValue.trim() || isTyping}
                                        className="cursor-pointer h-10 w-10 transform rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 p-0 transition-all hover:scale-105 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50"
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}