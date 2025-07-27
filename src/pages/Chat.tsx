
import { CidadaoLayout } from "../components/CidadaoLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, Clock, Circle, Users, Search, Phone, Video } from "lucide-react";
import { FC, useState, useEffect, useRef } from "react";
import { useChat } from "@/hooks/useChat";
import { ChatRoom, ChatMessage } from "@/types/chat";

const ChatRoomItem: FC<{ 
  room: ChatRoom; 
  isActive: boolean; 
  onClick: () => void; 
}> = ({ room, isActive, onClick }) => {
  const getStatusColor = (type: string) => {
    switch (type) {
      case 'general': return 'bg-green-500';
      case 'department': return 'bg-blue-500';
      case 'support': return 'bg-orange-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div
      className={`p-3 rounded-md flex items-center cursor-pointer transition-colors ${
        isActive
          ? "bg-blue-100 dark:bg-blue-900/50"
          : "hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(room.type)}`}></div>
      </div>
      <div className="ml-3 flex-1">
        <div className="flex items-center justify-between">
          <p className="font-medium text-sm">{room.name}</p>
          <div className="flex items-center gap-1">
            {room.unread_count && room.unread_count > 0 && (
              <Badge variant="destructive" className="text-xs">
                {room.unread_count}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {room.last_message?.message || "Nenhuma mensagem"}
          </p>
          {room.participants_count && (
            <span className="text-xs text-gray-400 flex items-center">
              <Users className="h-3 w-3 mr-1" />
              {room.participants_count}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const MessageBubble: FC<{ message: ChatMessage; isOwnMessage: boolean }> = ({ 
  message, 
  isOwnMessage 
}) => {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[70%] ${isOwnMessage ? "order-2" : "order-1"}`}>
        {!isOwnMessage && (
          <p className="text-xs text-gray-500 mb-1 ml-1">{message.user?.name}</p>
        )}
        {message.reply_to && (
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md mb-1 border-l-2 border-blue-500">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Respondendo a: {message.reply_message?.message}
            </p>
          </div>
        )}
        <div
          className={`p-3 rounded-lg ${
            isOwnMessage
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-800"
          }`}
        >
          <p className="text-sm">{message.message}</p>
          {message.file_url && (
            <div className="mt-2">
              <a 
                href={message.file_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-200 hover:underline text-sm"
              >
                📎 {message.file_name || 'Arquivo anexado'}
              </a>
            </div>
          )}
        </div>
        <p
          className={`text-xs mt-1 text-right ${
            isOwnMessage
              ? "text-blue-100"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {formatTime(message.created_at)}
        </p>
      </div>
    </div>
  );
};

const Chat: FC = () => {
  const {
    rooms,
    activeRoom,
    messages,
    participants,
    isLoading,
    error,
    setActiveRoom,
    sendMessage
  } = useChat();

  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeRoom) return;

    try {
      await sendMessage(activeRoom.id, {
        message: newMessage.trim(),
        message_type: 'text'
      });
      setNewMessage("");
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <CidadaoLayout>
      <div className="h-full flex flex-col">
        <div className="flex items-center mb-4">
          <MessageSquare className="mr-2 h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Chat Municipal</h1>
        </div>

        <div className="flex flex-1 gap-4 h-[calc(100vh-180px)]">
          {/* Rooms sidebar */}
          <Card className="w-1/4 min-w-[250px] h-full">
            <CardContent className="p-3 h-full">
              <div className="mb-3 pt-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Pesquisar conversas..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <ScrollArea className="h-[calc(100%-50px)]">
                <div className="space-y-2">
                  {isLoading && <p className="text-sm text-gray-500 p-2">Carregando...</p>}
                  {error && <p className="text-sm text-red-500 p-2">{error}</p>}
                  {filteredRooms.map((room) => (
                    <ChatRoomItem
                      key={room.id}
                      room={room}
                      isActive={activeRoom?.id === room.id}
                      onClick={() => setActiveRoom(room)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Chat area */}
          <Card className="flex-1 flex flex-col h-full">
            {activeRoom ? (
              <>
                {/* Chat header */}
                <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">{activeRoom.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Circle className="h-2 w-2 fill-green-500 text-green-500 mr-1" />
                      <span>{participants.length} participantes</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Video className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-1">
                    {messages.map((message) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isOwnMessage={message.user_id === 1} // TODO: Replace with actual current user ID
                      />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message input */}
                <form onSubmit={handleSendMessage} className="p-3 border-t dark:border-gray-700 flex items-center gap-2">
                  <Input
                    placeholder="Digite sua mensagem..."
                    className="flex-1"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    Selecione uma conversa
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Escolha uma conversa da lista para começar a participar
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </CidadaoLayout>
  );
};

export default Chat;
