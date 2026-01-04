import { Upload, Search, PenTool, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const actions = [
  {
    id: "upload",
    label: "上传文档",
    description: "支持PDF、Word、Excel等格式",
    icon: Upload,
  },
  {
    id: "search",
    label: "智能检索",
    description: "在知识库中搜索相关内容",
    icon: Search,
  },
  {
    id: "prompt",
    label: "Prompt优化",
    description: "让AI帮你优化提示词",
    icon: PenTool,
  },
  {
    id: "report",
    label: "生成日报",
    description: "立即生成今日情报日报",
    icon: Send,
  },
];

const QuickActions = () => {
  return (
    <div className="glass-card rounded-xl p-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
      <h3 className="text-lg font-semibold text-foreground mb-4">快捷操作</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {actions.map((action) => (
          <Button
            key={action.id}
            variant="outline"
            className="w-full justify-start h-auto py-4 px-4 hover:border-primary/50 flex-col items-start gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <action.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-foreground">{action.label}</p>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
