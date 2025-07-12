import { useEffect, useRef } from "react";
import { Bot, User, Copy, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import type { Message } from "@shared/schema";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  selectedChatId: number | null;
}

export default function ChatMessages({
  messages,
  isLoading,
  selectedChatId,
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

  if (!selectedChatId) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Welcome to AI Chat</h3>
            <p className="text-slate-600 text-sm">
              Start a conversation with our AI assistant. Ask questions, get help with coding,
              or discuss any topic!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 && !isLoading ? (
        <div className="flex justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Start the conversation</h3>
              <p className="text-slate-600 text-sm">
                Type a message below to begin chatting with the AI assistant.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "user" ? (
                <div className="max-w-xs lg:max-w-md">
                  <div className="bg-primary text-white rounded-2xl rounded-br-md px-4 py-2">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-slate-500">
                      {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-3 max-w-xs lg:max-w-2xl">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <div className="bg-slate-100 rounded-2xl rounded-bl-md px-4 py-3">
                      <p className="text-sm text-slate-800 whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className="text-xs text-slate-500">
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
                        onClick={() => copyMessage(message.content)}
                      >
                        <Copy className="h-3 w-3" />
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
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-slate-600" />
            </div>
            <div className="bg-slate-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
