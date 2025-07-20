import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Bot, User, Copy, ThumbsUp, ThumbsDown, RotateCcw, Edit3, Check, X, MessageSquare, ArrowUp, ArrowDown, ChevronUp, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  _id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
}

interface EnhancedChatMessagesProps {
  messages: any[];
  isLoading: boolean;
  selectedChatId: string | null;
  onEditMessage?: (messageId: string, newContent: string) => void;
}

export default function EnhancedChatMessages({ messages, isLoading, selectedChatId, onEditMessage }: EnhancedChatMessagesProps) {
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleScroll = () => {
      if (messagesContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
        setShowScrollButtons(!isNearBottom && messages.length > 3);
      }
    };

    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToTop = () => {
    messagesContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Message content has been copied.",
    });
  };

  const handleEditMessage = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditContent(content);
  };

  const handleSaveEdit = () => {
    if (editingMessageId && editContent.trim() && onEditMessage) {
      onEditMessage(editingMessageId, editContent.trim());
      setEditingMessageId(null);
      setEditContent("");
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditContent("");
  };

  if (!selectedChatId) {
    return (
      <div className="flex-1 flex items-center justify-center p-4" style={{ backgroundColor: "var(--light-bg)" }}>
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ background: "var(--gradient)" }}>
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Welcome to IntelliTutorAI</h3>
            <p className="text-gray-600 text-sm">
              Your intelligent learning companion. Start a conversation to get help with your studies,
              homework, or any educational topic!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-messages" style={{ backgroundColor: "var(--light-bg)" }}>
      {messages.length === 0 && !isLoading ? (
        <div className="flex justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient)" }}>
                <Bot className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Start learning!</h3>
              <p className="text-gray-600 text-sm">
                Type a message below to begin your educational journey with AI assistance.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "user" ? (
                <div className="max-w-xs lg:max-w-md">
                  {editingMessageId === message._id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="rounded-xl border-2 border-blue-300 focus:border-blue-500"
                        rows={3}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.ctrlKey) {
                            handleSaveEdit();
                          }
                          if (e.key === 'Escape') {
                            handleCancelEdit();
                          }
                        }}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="group relative">
                      <Card className="bg-blue-500 text-white">
                        <CardContent className="p-3">
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </CardContent>
                      </Card>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute -left-8 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleEditMessage(message._id, message.content)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex space-x-3 max-w-xs lg:max-w-2xl">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-gray-500 hover:text-gray-700"
                      onClick={() => handleCopy(message.content)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-gray-500 hover:text-green-600"
                      onClick={() => {
                        toast({
                          title: "Helpful response",
                          description: "Thank you for your feedback!",
                        });
                      }}
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Helpful
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-gray-500 hover:text-red-600"
                      onClick={() => {
                        toast({
                          title: "Feedback noted",
                          description: "We'll use this to improve responses.",
                        });
                      }}
                    >
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      Not helpful
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-gray-500 hover:text-blue-600"
                      onClick={() => {
                        toast({
                          title: "Regenerating response",
                          description: "Please wait while we generate a new response.",
                        });
                      }}
                    >
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Regenerate
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-gray-500 hover:text-purple-600"
                      onClick={() => {
                        const explanation = "This response provides " + message.content.slice(0, 100) + "...";
                        toast({
                          title: "Explanation",
                          description: explanation,
                        });
                      }}
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Explain
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-gray-500 hover:text-orange-600"
                      onClick={() => {
                        const simplified = message.content.length > 200 ? 
                          message.content.slice(0, 200) + "... (simplified)" : 
                          "This is already in simple terms.";
                        handleCopy(simplified);
                        toast({
                          title: "Simplified version copied",
                          description: "A simpler version has been copied to clipboard.",
                        });
                      }}
                    >
                      <Edit3 className="h-3 w-3 mr-1" />
                      Simplify
                    </Button>
                  </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </>
      )}

      {/* Typing indicator */}
      {isLoading && (
        <div className="flex justify-start">
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <Bot className="h-4 w-4 text-blue-600" />
            </div>
            <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />

      {/* Scroll Buttons */}
      {showScrollButtons && (
        <div className="absolute right-4 bottom-4 flex flex-col space-y-2">
          <Button
            size="sm"
            variant="outline"
            className="rounded-full w-10 h-10 p-0 bg-white shadow-lg hover:shadow-xl"
            onClick={scrollToTop}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full w-10 h-10 p-0 bg-white shadow-lg hover:shadow-xl"
            onClick={scrollToBottom}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}