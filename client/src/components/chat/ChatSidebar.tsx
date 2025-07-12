import { Bot, Plus, MessageSquare, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import type { User, Chat } from "@shared/schema";

interface ChatSidebarProps {
  user: User;
  chats: Chat[];
  selectedChatId: number | null;
  onSelectChat: (chatId: number) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: number) => void;
  isCreatingChat: boolean;
}

export default function ChatSidebar({
  user,
  chats,
  selectedChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  isCreatingChat,
}: ChatSidebarProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <h1 className="font-semibold text-lg">AI Chat</h1>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button
          onClick={onNewChat}
          disabled={isCreatingChat}
          className="w-full flex items-center justify-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Chat</span>
        </Button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
          Recent Chats
        </h3>
        {chats.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-500">No chats yet</p>
            <p className="text-xs text-slate-400">Start a new conversation</p>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              className={`group p-3 rounded-lg cursor-pointer transition-colors ${
                selectedChatId === chat.id
                  ? "bg-primary/10 border border-primary/20"
                  : "hover:bg-slate-50"
              }`}
              onClick={() => onSelectChat(chat.id)}
            >
              <div className="flex items-start space-x-3">
                <MessageSquare className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {chat.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
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
                      className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
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

      {/* User Profile Section */}
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profileImageUrl || undefined} />
            <AvatarFallback>
              {user.firstName?.[0] || user.email?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-700 truncate">
              {user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.email}
            </p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
