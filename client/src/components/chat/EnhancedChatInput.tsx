import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Send, 
  Paperclip, 
  Calculator, 
  Lightbulb, 
  Smile, 
  Mic, 
  MicOff, 
  X, 
  ChevronUp,
  BookOpen,
  PenTool,
  Brain,
  Target,
  Zap
} from "lucide-react";

interface EnhancedChatInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
  quickPrompts: string[];
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

const emojis = ["😀", "😂", "😍", "🔥", "🎉", "📚", "✍️", "💡", "🚀", "🌍", "❤️", "👍"];

export default function EnhancedChatInput({ onSendMessage, disabled, quickPrompts }: EnhancedChatInputProps) {
  const [message, setMessage] = useState("");
  const [showQuickPrompts, setShowQuickPrompts] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [calculatorInput, setCalculatorInput] = useState("");
  const [calculatorResult, setCalculatorResult] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      recognitionRef.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0].transcript)
          .join('');
        setMessage(transcript);
      };
      recognitionRef.current.onend = () => {
        if (isRecording && message.trim()) {
          onSendMessage(message.trim());
          setMessage("");
        }
        setIsRecording(false);
      };
    }
  }, [isRecording, message, onSendMessage]);

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
    setShowQuickPrompts(false);
    textareaRef.current?.focus();
  };

  const insertSymbol = (symbol: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newMessage = message.substring(0, start) + symbol + message.substring(end);
      setMessage(newMessage);
      setTimeout(() => {
        textarea.setSelectionRange(start + symbol.length, start + symbol.length);
        textarea.focus();
      }, 0);
    }
  };

  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newMessage = message.substring(0, start) + emoji + message.substring(end);
      setMessage(newMessage);
      setShowEmojiPicker(false);
      setTimeout(() => {
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
        textarea.focus();
      }, 0);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const handleAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSendMessage(`[Attached: ${file.name}]`);
    }
  };

  const handleCalculate = () => {
    try {
      const result = eval(calculatorInput); // Note: eval is used for simplicity; use a safer parser in production
      setCalculatorResult(result.toString());
      setMessage(calculatorInput + " = " + result);
    } catch (error) {
      setCalculatorResult("Error");
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex space-x-3">
          <div className="flex-1 relative flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                  disabled={disabled}
                  onClick={() => setShowQuickPrompts(!showQuickPrompts)}
                >
                  <Lightbulb className="h-4 w-4" />
                  <span>Quick Prompts</span>
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2" side="top">
                {educationalPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full justify-start space-x-2 text-left"
                    onClick={() => insertPrompt(prompt.prompt)}
                  >
                    {prompt.icon}
                    <div>
                      <p className="text-sm">{prompt.title}</p>
                      <p className="text-xs text-gray-500">{prompt.description}</p>
                    </div>
                  </Button>
                ))}
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  disabled={disabled}
                >
                  <Calculator className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2">
                <div className="space-y-2">
                  <Textarea
                    value={calculatorInput}
                    onChange={(e) => setCalculatorInput(e.target.value)}
                    placeholder="Enter math expression (e.g., 2 + 2)"
                    className="resize-none"
                    rows={2}
                  />
                  <Button onClick={handleCalculate} className="w-full">
                    Calculate
                  </Button>
                  {calculatorResult && (
                    <p className="text-sm">Result: {calculatorResult}</p>
                  )}
                </div>
                <div className="grid grid-cols-5 gap-1 mt-2">
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

            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={disabled}
            >
              <Paperclip className="h-4 w-4" />
              <input
                type="file"
                className="absolute opacity-0 w-8 h-8"
                onChange={handleAttach}
                accept="image/*,.pdf"
              />
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  disabled={disabled}
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2">
                <div className="grid grid-cols-6 gap-1">
                  {emojis.map((emoji, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-lg"
                      onClick={() => insertEmoji(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setMessage("")}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={toggleRecording}
              disabled={disabled || !recognitionRef.current}
            >
              {isRecording ? <MicOff className="h-4 w-4 text-red-600" /> : <Mic className="h-4 w-4" />}
            </Button>

            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={handleInput}
              placeholder="Ask me anything about your studies..."
              className="resize-none rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all min-h-[48px]"
              rows={1}
              disabled={disabled}
            />
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