import { useState } from "react";
import { Upload, FileText, Table, Search, MessageSquare, X, Send, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const sampleDocuments = [
  { id: 1, name: "财务报表Q3.xlsx", type: "excel", size: "2.4 MB", date: "2024-01-15", status: "已分析" },
  { id: 2, name: "员工手册V2.0.docx", type: "word", size: "1.8 MB", date: "2024-01-14", status: "已索引" },
  { id: 3, name: "项目计划书.pdf", type: "pdf", size: "5.2 MB", date: "2024-01-13", status: "已分析" },
  { id: 4, name: "销售数据2024.xlsx", type: "excel", size: "3.1 MB", date: "2024-01-12", status: "处理中" },
];

const DocumentCenter = () => {
  const [selectedDoc, setSelectedDoc] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", content: "您好！请上传文档或选择已有文档，我可以帮您进行智能分析、数据提取和内容总结。所有处理均在本地完成，数据安全有保障。" }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    setChatMessages([
      ...chatMessages,
      { role: "user", content: inputMessage },
      { role: "assistant", content: "正在分析您的请求...（演示模式：本地大模型将在此处理您的文档相关问题）" }
    ]);
    setInputMessage("");
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Left Panel - Document List */}
      <div className="w-80 border-r border-border bg-card/30 flex flex-col">
        {/* Upload Area */}
        <div className="p-4 border-b border-border">
          <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-foreground">上传文档</p>
            <p className="text-xs text-muted-foreground mt-1">
              支持 PDF、Word、Excel 等格式
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索文档..."
              className="pl-9 bg-secondary/50"
            />
          </div>
        </div>

        {/* Document List */}
        <div className="flex-1 overflow-auto p-4 space-y-2">
          {sampleDocuments.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc.id)}
              className={cn(
                "p-3 rounded-lg cursor-pointer transition-all",
                selectedDoc === doc.id
                  ? "bg-primary/10 border border-primary/30"
                  : "hover:bg-secondary/50"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  doc.type === "excel" ? "bg-success/20" : doc.type === "word" ? "bg-primary/20" : "bg-destructive/20"
                )}>
                  {doc.type === "excel" ? (
                    <Table className={cn("w-5 h-5", "text-success")} />
                  ) : (
                    <FileText className={cn("w-5 h-5", doc.type === "word" ? "text-primary" : "text-destructive")} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">{doc.size} · {doc.date}</p>
                  <span className={cn(
                    "inline-block mt-1 text-xs px-2 py-0.5 rounded-full",
                    doc.status === "已分析" ? "bg-success/20 text-success" :
                    doc.status === "已索引" ? "bg-primary/20 text-primary" :
                    "bg-warning/20 text-warning"
                  )}>
                    {doc.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Chat Interface */}
      <div className="flex-1 flex flex-col bg-background">
        {/* Chat Header */}
        <div className="h-14 border-b border-border flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">智能文档助手</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              本地模型运行中
            </span>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {chatMessages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-secondary text-secondary-foreground rounded-bl-md"
                )}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border">
          <div className="flex items-end gap-2">
            <Button variant="outline" size="icon" className="flex-shrink-0">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Textarea
              placeholder="输入您的问题，如：帮我总结这份报表的关键数据..."
              className="min-h-[44px] max-h-32 resize-none bg-secondary/50"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage} className="flex-shrink-0">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            所有数据均在本地处理，不会上传至外部服务器
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentCenter;
