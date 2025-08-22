import { Bot, Plus, MessageSquare, MoreVertical, Trash2, ExternalLink, MessageCircle, FileText, Play, Brain, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import ProfileModal from "@/components/profile/ProfileModal";
import { User } from "@/hooks/useAuth";
import { useLocation } from "wouter";

interface Chat {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface EnhancedChatSidebarProps {
  user: User;
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  isCreatingChat: boolean;
  onToggleRecentChats: () => void;
  isRecentChatsOpen: boolean;
}

export default function EnhancedChatSidebar({
  user,
  chats,
  selectedChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  isCreatingChat,
  onToggleRecentChats,
  isRecentChatsOpen,
}: EnhancedChatSidebarProps) {
  const [, navigate] = useLocation();

  const navigationItems = [
    { name: "IntelliWrite", icon: FileText, path: "/intelliwrite", description: "Document creation" },
    { name: "AcademicTube", icon: Play, path: "/academictube", description: "Educational videos" },
    { name: "Quiz Hub", icon: Brain, path: "/quiz", description: "Interactive quizzes" },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient)" }}>
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-gray-800">IntelliTutorAI</h1>
            <p className="text-xs text-gray-500">Educational Assistant</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Button
          onClick={onNewChat}
          disabled={isCreatingChat}
          className="w-full flex items-center justify-center space-x-2 rounded-xl"
          style={{ background: "var(--gradient)" }}
        >
          <Plus className="h-4 w-4" />
          <span>New Chat</span>
        </Button>
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Learning Tools
          </h3>
        </div>
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className="w-full justify-start rounded-xl hover:bg-gray-50"
              onClick={() => navigate(item.path)}
            >
              <item.icon className="h-4 w-4 mr-3 text-gray-500" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-700">{item.name}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
            </Button>
          ))}
          {user.role === 'admin' && (
            <Button
              variant="ghost"
              className="w-full justify-start rounded-xl hover:bg-gray-50"
              onClick={() => navigate('/admin')}
            >
              <Settings className="h-4 w-4 mr-3 text-gray-500" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-700">Admin Panel</p>
                <p className="text-xs text-gray-500">Manage users & settings</p>
              </div>
            </Button>
          )}
        </div>
      </div>

      <div className="p-4">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center space-x-2 rounded-xl"
          onClick={onToggleRecentChats}
        >
          <MessageSquare className="h-4 w-4" />
          <span>Recent Chats</span>
          <Badge variant="secondary" className="text-xs">
            {chats.length}
          </Badge>
        </Button>
      </div>

      <div className="p-4 border-t border-gray-200">
        <Button
          variant="outline"
          className="w-full flex items-center space-x-2 rounded-xl"
          onClick={() => window.open("https://forms.google.com/", "_blank")}
        >
          <MessageCircle className="h-4 w-4" />
          <span>Feedback</span>
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>

      <div className="p-4 border-t border-gray-200">
        <ProfileModal user={user}>
          <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors overflow-y-auto max-h-[80vh]">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.profileImage} />
              <AvatarFallback className="font-medium" style={{ background: "var(--gradient)", color: "white" }}>
                {user.username[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">
                {user.username}
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                  {user.role}
                </Badge>
                <span className="text-xs text-gray-500 truncate">{user.institution}</span>
              </div>
            </div>
          </div>
        </ProfileModal>
      </div>
    </div>
  );
}