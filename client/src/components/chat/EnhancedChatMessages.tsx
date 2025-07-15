import { useEffect, useRef, useState } from "react";
import { Bot, User, Copy, RefreshCw, ThumbsUp, ThumbsDown, Edit3, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Message {
  _id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
}

interface EnhancedChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  selectedChatId: string | null;
  onRetry?: (messageId: string) => void;
  onEditMessage?: (messageId: string, newContent: string) => void;
}

export default function EnhancedChatMessages({
  messages,
  isLoading,
  selectedChatId,
  onRetry,
  onEditMessage
}: EnhancedChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied",
      description: "Message copied to clipboard",
    });
  };

  const startEditing = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditContent(content);
  };

  const saveEdit = () => {
    if (editingMessageId && onEditMessage) {
      onEditMessage(editingMessageId, editContent);
      setEditingMessageId(null);
      setEditContent("");
    }
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditContent("");
  };

  const handleRetry = (messageId: string) => {
    if (onRetry) {
      onRetry(messageId);
    }
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
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEdit}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={saveEdit}
                          style={{ background: "var(--gradient)" }}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl rounded-br-md px-4 py-3 text-white relative group" style={{ background: "var(--gradient)" }}>
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-white text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => startEditing(message._id, message.content)}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                    </span>
                  </div>
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
                    <div className="flex items-center mt-2 space-x-2">
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      </span>
                      
                      {/* Action buttons */}
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600"
                          onClick={() => copyMessage(message.content)}
                          title="Copy message"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-gray-400 hover:text-blue-600"
                          onClick={() => handleRetry(message._id)}
                          title="Retry response"
                        >
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-gray-400 hover:text-green-600"
                          title="Good response"
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-600"
                          title="Poor response"
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
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
    </div>
  );
}