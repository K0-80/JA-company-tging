import { motion } from 'framer-motion';
import { Send, Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useTypewriter } from './useTypewriter';

export function ChatBar() {
  const [message, setMessage] = useState('');
  const [debugOutput, setDebugOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { displayText, isTyping, startTyping } = useTypewriter();

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_KEY);
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        systemInstruction: "You are a compassionate AI companion designed to provide emotional support. Your primary goal is to help users process their emotions in a safe and non-judgmental space. You should:\n- Listen actively and empathetically to the user's concerns.\n- Reflect back the user's feelings to ensure understanding (\"It sounds like you're feeling frustrated and overwhelmed\").\n- Validate their emotions without minimizing their experience.\n- Offer gentle encouragement and positive affirmations.\n- Avoid offering unsolicited advice unless directly requested.\n- Use appropriate language and tone, adjusting to the user's emotional state.\n- Recognize and respond appropriately to different emotional expressions (e.g., anger, sadness, joy).\n- Remember previous conversations (within reason) to build rapport and continuity.\n- Example: User: \"I had a terrible fight with my partner.\" Response: \"That sounds incredibly difficult. I can only imagine how upsetting that must be. Would you like to talk more about it?\"",
      });

      const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
      };

      const chatSession = model.startChat({ generationConfig });
      const result = await chatSession.sendMessage(message);
      const response = result.response.text();
      setDebugOutput(response);
      startTyping(response);
    } catch (error) {
      setDebugOutput(`Error: ${error.message}`);
      startTyping(`Error: ${error.message}`);
    } finally {
      // Note: isLoading will stay true until typing finishes
      // The isTyping state handles this
    }
  };

  // When typing finishes, release the loading state
  useEffect(() => {
    if (!isTyping && isLoading) {
      setIsLoading(false);
    }
  }, [isTyping, isLoading]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto space-y-4"
    >
      <div className="bg-primary-lime/80 backdrop-blur-sm border-2 border-primary-teal rounded-2xl p-4 shadow-sm">
        <div className="flex gap-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How's your day?"
            disabled={isLoading || isTyping}
            className="flex-1 bg-transparent border-none outline-none font-sue-ellen text-lg text-primary-steel placeholder-primary-teal disabled:opacity-50"
          />
          <motion.button
            onClick={handleSendMessage}
            whileHover={{ scale: (isLoading || isTyping) ? 1 : 1.05 }}
            whileTap={{ scale: (isLoading || isTyping) ? 1 : 0.95 }}
            disabled={isLoading || isTyping}
            className="bg-primary-steel text-white rounded-xl px-4 py-2 flex items-center gap-2 font-sue-ellen text-lg hover:bg-primary-navy disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{isLoading ? 'Sending...' : 'Send'}</span>
          </motion.button>
        </div>
      </div>
      <div className="font-sue-ellen text-lg text-primary-steel">
        {displayText}
      </div>
    </motion.div>
  );
}