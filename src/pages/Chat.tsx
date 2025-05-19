
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, Clock, Circle } from "lucide-react";
import { FC } from "react";

// Dummy data for chat contacts
const contacts = [
  { id: 1, name: "Atendimento Geral", status: "online", unread: 2 },
  { id: 2, name: "Secretaria de Saúde", status: "offline", lastSeen: "1h atrás" },
  { id: 3, name: "Secretaria de Educação", status: "away", lastSeen: "30min atrás" },
  { id: 4, name: "Secretaria de Finanças", status: "online", unread: 0 },
  { id: 5, name: "Protocolo", status: "online", unread: 0 },
  { id: 6, name: "Assistência Social", status: "offline", lastSeen: "5h atrás" },
];

// Dummy data for chat messages
const messages = [
  { id: 1, sender: "system", text: "Bem-vindo ao atendimento online da prefeitura!", time: "09:30" },
  { id: 2, sender: "user", text: "Olá, preciso de ajuda com meu protocolo.", time: "09:31" },
  { id: 3, sender: "system", text: "Por favor, informe o número do seu protocolo para verificarmos.", time: "09:32" },
  { id: 4, sender: "user", text: "O número é 2023-0015428", time: "09:33" },
  { id: 5, sender: "system", text: "Obrigado! Estou consultando seu protocolo, um momento por favor...", time: "09:34" },
  { id: 6, sender: "system", text: "Seu protocolo está em análise pela Secretaria de Obras. A previsão de resposta é até 15/06/2025.", time: "09:35" },
];

const Chat: FC = () => {
  return (
    <Layout>
      <div className="h-full flex flex-col p-4">
        <div className="flex items-center mb-4">
          <MessageSquare className="mr-2 h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Chat</h1>
        </div>

        <div className="flex flex-1 gap-4 h-[calc(100vh-180px)]">
          {/* Contacts sidebar */}
          <Card className="w-1/4 min-w-[250px] h-full">
            <CardContent className="p-3 h-full">
              <div className="mb-3 pt-2">
                <Input placeholder="Pesquisar contato..." className="w-full" />
              </div>
              <div className="h-[calc(100%-50px)] overflow-y-auto space-y-2">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`p-3 rounded-md flex items-center cursor-pointer ${
                      contact.id === 1
                        ? "bg-blue-100 dark:bg-blue-900/50"
                        : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                          contact.status === "online"
                            ? "bg-green-500"
                            : contact.status === "away"
                            ? "bg-yellow-500"
                            : "bg-gray-400"
                        }`}
                      ></div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{contact.name}</p>
                        {contact.unread > 0 && (
                          <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {contact.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {contact.status === "online"
                          ? "Online"
                          : contact.lastSeen
                          ? `Visto por último: ${contact.lastSeen}`
                          : "Offline"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat area */}
          <Card className="flex-1 flex flex-col h-full">
            {/* Chat header */}
            <div className="p-4 border-b dark:border-gray-700 flex items-center">
              <div className="flex-1">
                <h3 className="font-medium">Atendimento Geral</h3>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Circle className="h-2 w-2 fill-green-500 text-green-500 mr-1" />
                  <span>Online</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Tempo médio de resposta: 5 min</span>
              </div>
            </div>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-1 text-right ${
                        message.sender === "user"
                          ? "text-blue-100"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>

            {/* Message input */}
            <div className="p-3 border-t dark:border-gray-700 flex items-center gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                className="flex-1"
              />
              <Button size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
