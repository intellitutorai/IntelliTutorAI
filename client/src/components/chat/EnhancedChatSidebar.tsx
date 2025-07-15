import { Bot, Plus, MessageSquare, MoreVertical, Trash2, ExternalLink, MessageCircle } from "lucide-react";
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
}

export default function EnhancedChatSidebar({
  user,
  chats,
  selectedChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  isCreatingChat,
}: EnhancedChatSidebarProps) {
  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
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

      {/* New Chat Button */}
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

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Recent Chats
          </h3>
          <Badge variant="secondary" className="text-xs">
            {chats.length}
          </Badge>
        </div>
        
        {chats.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No chats yet</p>
            <p className="text-xs text-gray-400">Start learning with AI</p>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat._id}
              className={`group p-3 rounded-xl cursor-pointer transition-all hover:shadow-sm ${
                selectedChatId === chat._id
                  ? "bg-blue-50 border-2 border-blue-200"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => onSelectChat(chat._id)}
            >
              <div className="flex items-start space-x-3">
                <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {chat.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {chat.updatedAt
                      ? formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true })
                      : "Just now"}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat._id);
                      }}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Feedback Link */}
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

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200">
        <ProfileModal user={user}>
          <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
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