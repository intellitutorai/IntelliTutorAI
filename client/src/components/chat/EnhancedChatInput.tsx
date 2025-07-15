import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Send, 
  Paperclip, 
  Calculator, 
  Lightbulb,
  BookOpen,
  PenTool,
  MessageSquare,
  Brain,
  Target,
  Zap
} from "lucide-react";

interface EnhancedChatInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

const educationalPrompts = [
  {
    icon: <Calculator className="h-4 w-4" />,
    title: "Math Problem",
    description: "Solve step-by-step",
    prompt: "Help me solve this math problem step by step: "
  },
  {
    icon: <BookOpen className="h-4 w-4" />,
    title: "Explain Concept",
    description: "Detailed explanation",
    prompt: "Please explain this concept in simple terms: "
  },
  {
    icon: <PenTool className="h-4 w-4" />,
    title: "Essay Help",
    description: "Writing assistance",
    prompt: "Help me write an essay about: "
  },
  {
    icon: <Brain className="h-4 w-4" />,
    title: "Study Plan",
    description: "Create study schedule",
    prompt: "Create a study plan for: "
  },
  {
    icon: <Target className="h-4 w-4" />,
    title: "Practice Questions",
    description: "Generate exercises",
    prompt: "Generate practice questions for: "
  },
  {
    icon: <Zap className="h-4 w-4" />,
    title: "Quick Quiz",
    description: "Test knowledge",
    prompt: "Give me a quick quiz on: "
  }
];

const equations = [
  { symbol: "∑", name: "Sum", latex: "\\sum" },
  { symbol: "∫", name: "Integral", latex: "\\int" },
  { symbol: "∞", name: "Infinity", latex: "\\infty" },
  { symbol: "√", name: "Square Root", latex: "\\sqrt{}" },
  { symbol: "α", name: "Alpha", latex: "\\alpha" },
  { symbol: "β", name: "Beta", latex: "\\beta" },
  { symbol: "γ", name: "Gamma", latex: "\\gamma" },
  { symbol: "δ", name: "Delta", latex: "\\delta" },
  { symbol: "π", name: "Pi", latex: "\\pi" },
  { symbol: "θ", name: "Theta", latex: "\\theta" },
  { symbol: "λ", name: "Lambda", latex: "\\lambda" },
  { symbol: "μ", name: "Mu", latex: "\\mu" },
  { symbol: "≠", name: "Not Equal", latex: "\\neq" },
  { symbol: "≤", name: "Less Equal", latex: "\\leq" },
  { symbol: "≥", name: "Greater Equal", latex: "\\geq" },
  { symbol: "±", name: "Plus Minus", latex: "\\pm" },
  { symbol: "×", name: "Times", latex: "\\times" },
  { symbol: "÷", name: "Divide", latex: "\\div" },
  { symbol: "²", name: "Squared", latex: "^2" },
  { symbol: "³", name: "Cubed", latex: "^3" },
];

export default function EnhancedChatInput({ onSendMessage, disabled }: EnhancedChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  };

  const insertPrompt = (prompt: string) => {
    setMessage(prompt);
    textareaRef.current?.focus();
  };

  const insertSymbol = (symbol: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newMessage = message.substring(0, start) + symbol + message.substring(end);
      setMessage(newMessage);
      
      // Set cursor position after inserted symbol
      setTimeout(() => {
        textarea.setSelectionRange(start + symbol.length, start + symbol.length);
        textarea.focus();
      }, 0);
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Educational Prompts */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Lightbulb className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Quick Prompts</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {educationalPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="h-auto p-2 flex items-center space-x-2 text-xs"
                onClick={() => insertPrompt(prompt.prompt)}
                disabled={disabled}
              >
                {prompt.icon}
                <span>{prompt.title}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={handleInput}
              placeholder="Ask me anything about your studies..."
              className="resize-none rounded-xl border border-gray-300 px-4 py-3 pr-20 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all min-h-[48px]"
              rows={1}
              disabled={disabled}
            />
            
            {/* Toolbar */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              {/* Equations Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-blue-500"
                    disabled={disabled}
                  >
                    <Calculator className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2" align="end">
                  <div className="grid grid-cols-5 gap-1">
                    {equations.map((eq, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-lg"
                        onClick={() => insertSymbol(eq.symbol)}
                        title={eq.name}
                      >
                        {eq.symbol}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Attachment */}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-400 hover:text-blue-500"
                disabled={disabled}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Button
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            className="px-6 py-3 rounded-xl flex items-center space-x-2"
            style={{ background: "var(--gradient)" }}
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{message.length}/2000</span>
        </div>
      </div>
    </div>
  );
}