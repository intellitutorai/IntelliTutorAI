import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import EnhancedChatSidebar from "@/components/chat/EnhancedChatSidebar";
import EnhancedChatMessages from "@/components/chat/EnhancedChatMessages";
import EnhancedChatInput from "@/components/chat/EnhancedChatInput";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Settings, Menu, Download } from "lucide-react";
import { useLocation } from "wouter";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import jsPDF from "jspdf";

interface Chat {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface Message {
  _id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: string;
}

export default function Home() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRecentChatsOpen, setIsRecentChatsOpen] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedMessageContent, setEditedMessageContent] = useState("");
  const speechSynthesisRef = useRef(window.speechSynthesis);

  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const { data: chats = [], isLoading: isLoadingChats } = useQuery({
    queryKey: ["/api/chats"],
    enabled: !!user,
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to load chats",
        variant: "destructive",
      });
    },
  });

  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ["/api/chats", selectedChatId, "messages"],
    enabled: !!selectedChatId,
    onSuccess: (messages: Message[]) => {
      const latestMessage = messages[messages.length - 1];
      if (latestMessage?.role === 'assistant' && latestMessage.content) {
        const utterance = new SpeechSynthesisUtterance(latestMessage.content);
        utterance.lang = 'en-US';
        speechSynthesisRef.current.speak(utterance);
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    },
  });

  const createChatMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/chats", {
        title: "New Chat",
      });
      return response.json();
    },
    onSuccess: (newChat: Chat) => {
      queryClient.invalidateQueries({ queryKey: ["/api/chats"] });
      setSelectedChatId(newChat._id);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to create chat",
        variant: "destructive",
      });
    },
  });

  const deleteChatMutation = useMutation({
    mutationFn: async (chatId: string) => {
      await apiRequest("DELETE", `/api/chats/${chatId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chats"] });
      if (selectedChatId === chatId) {
        setSelectedChatId(null);
      }
      toast({
        title: "Success",
        description: "Chat deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to delete chat",
        variant: "destructive",
      });
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", `/api/chats/${selectedChatId}/messages`, {
        content,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chats", selectedChatId, "messages"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  const editMessageMutation = useMutation({
    mutationFn: async ({ messageId, content }: { messageId: string; content: string }) => {
      const response = await apiRequest("PATCH", `/api/chats/${selectedChatId}/messages/${messageId}`, {
        content,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chats", selectedChatId, "messages"] });
      setEditingMessageId(null);
      setEditedMessageContent("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to edit message",
        variant: "destructive",
      });
    },
  });

  const retryMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      const originalMessage = messages.find((msg) => msg._id === messageId);
      if (originalMessage?.role === 'user') {
        const response = await apiRequest("POST", `/api/chats/${selectedChatId}/messages`, {
          content: originalMessage.content,
        });
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chats", selectedChatId, "messages"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to retry message",
        variant: "destructive",
      });
    },
  });

  const feedbackMutation = useMutation({
    mutationFn: async ({ messageId, feedback }: { messageId: string; feedback: 'like' | 'dislike' }) => {
      await apiRequest("POST", `/api/chats/${selectedChatId}/messages/${messageId}/feedback`, {
        feedback,
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Feedback submitted",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to submit feedback",
        variant: "destructive",
      });
    },
  });

  const handleNewChat = () => {
    createChatMutation.mutate();
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setIsSidebarOpen(false);
    setIsRecentChatsOpen(false);
  };

  const handleSendMessage = (content: string) => {
    if (selectedChatId) {
      sendMessageMutation.mutate(content);
    } else {
      createChatMutation.mutate(undefined, {
        onSuccess: (newChat: Chat) => {
          setSelectedChatId(newChat._id);
          setTimeout(() => {
            sendMessageMutation.mutate(content);
          }, 100);
        },
      });
    }
  };

  const handleEditMessage = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setEditedMessageContent(content);
  };

  const handleSaveEditedMessage = () => {
    if (editingMessageId && editedMessageContent) {
      editMessageMutation.mutate({ messageId: editingMessageId, content: editedMessageContent });
    }
  };

  const handleRetryMessage = (messageId: string) => {
    retryMessageMutation.mutate(messageId);
  };

  const handleFeedback = (messageId: string, feedback: 'like' | 'dislike') => {
    feedbackMutation.mutate({ messageId, feedback });
  };

  const handleExportConversation = (format: 'txt' | 'pdf') => {
    const conversation = messages
      .map((msg) => `${msg.role === 'user' ? 'You' : 'AI'}: ${msg.content}`)
      .join('\n\n');
    if (format === 'txt') {
      const blob = new Blob([conversation], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-${selectedChatId || 'new'}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const doc = new jsPDF();
      doc.setFontSize(12);
      doc.text('IntelliTutorAI Conversation', 10, 10);
      let y = 20;
      messages.forEach((msg) => {
        doc.text(`${msg.role === 'user' ? 'You' : 'AI'}: ${msg.content}`, 10, y);
        y += 10 + (msg.content.length / 80) * 10;
      });
      doc.save(`chat-${selectedChatId || 'new'}.pdf`);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen" style={{ backgroundColor: "var(--light-bg)" }}>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:shadow-none`}
      >
        <EnhancedChatSidebar
          user={user}
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={deleteChatMutation.mutate}
          isCreatingChat={createChatMutation.isPending}
          onToggleRecentChats={() => setIsRecentChatsOpen(!isRecentChatsOpen)}
          isRecentChatsOpen={isRecentChatsOpen}
        />
      </div>

      {isRecentChatsOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2">Recent Chats</h3>
          {chats.map((chat) => (
            <div
              key={chat._id}
              className={`p-2 rounded-lg cursor-pointer hover:bg-gray-100 flex items-center ${
                chat._id === selectedChatId ? 'bg-blue-100' : ''
              }`}
              onClick={() => handleSelectChat(chat._id)}
            >
              <span className="flex-1">{chat.title}</span>
              {chat._id === selectedChatId && (
                <span className="text-blue-600 text-sm">Current</span>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">
              {selectedChatId ? "IntelliTutorAI" : "Welcome to IntelliTutorAI"}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" /> Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExportConversation('txt')}>
                  Text (.txt)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExportConversation('pdf')}>
                  PDF (.pdf)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {user.role === 'admin' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin')}
              >
                <Settings className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <EnhancedChatMessages
            messages={messages}
            isLoading={isLoadingMessages || sendMessageMutation.isPending}
            selectedChatId={selectedChatId}
            onEditMessage={handleEditMessage}
            onSaveEditedMessage={handleSaveEditedMessage}
            editingMessageId={editingMessageId}
            editedMessageContent={editedMessageContent}
            setEditedMessageContent={setEditedMessageContent}
            onRetryMessage={handleRetryMessage}
            onFeedback={handleFeedback}
          />
        </div>

        <EnhancedChatInput
          onSendMessage={handleSendMessage}
          disabled={sendMessageMutation.isPending || createChatMutation.isPending}
          quickPrompts={[
            "Math Problem",
            "Explain Concept",
            "Essay Help",
            "Study Plan",
            "Practice Questions",
            "Quick Quiz",
          ]}
        />
      </div>
    </div>
  );
}