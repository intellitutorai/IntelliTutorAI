import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import EnhancedChatSidebar from "@/components/chat/EnhancedChatSidebar";
import EnhancedChatMessages from "@/components/chat/EnhancedChatMessages";
import EnhancedChatInput from "@/components/chat/EnhancedChatInput";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Settings, Menu } from "lucide-react";
import { useLocation } from "wouter";

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

  // Redirect to admin if user is admin
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

  const deleteChatMutation = useMutation({
    mutationFn: async (chatId: string) => {
      await apiRequest("DELETE", `/api/chats/${chatId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chats"] });
      setSelectedChatId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: "Failed to delete chat",
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
  };

  const handleSendMessage = (content: string) => {
    if (selectedChatId) {
      sendMessageMutation.mutate(content);
    } else {
      // Create a new chat first, then send the message
      createChatMutation.mutate(undefined, {
        onSuccess: (newChat: Chat) => {
          setSelectedChatId(newChat._id);
          // Send the message after chat is created
          setTimeout(() => {
            sendMessageMutation.mutate(content);
          }, 100);
        }
      });
    }
  };

  const handleDeleteChat = (chatId: string) => {
    deleteChatMutation.mutate(chatId);
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
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:shadow-none`}>
        <EnhancedChatSidebar
          user={user}
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          isCreatingChat={createChatMutation.isPending}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
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

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          <EnhancedChatMessages
            messages={messages}
            isLoading={isLoadingMessages || sendMessageMutation.isPending}
            selectedChatId={selectedChatId}
          />
        </div>

        {/* Input */}
        <EnhancedChatInput
          onSendMessage={handleSendMessage}
          disabled={sendMessageMutation.isPending || createChatMutation.isPending}
        />
      </div>
    </div>
  );
}