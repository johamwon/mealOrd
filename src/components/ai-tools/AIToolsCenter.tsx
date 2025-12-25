import { useState } from "react";
import { Sparkles, Wand2, BookOpen, MessageSquare, ThumbsUp, ExternalLink, Copy, Check, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const aiModels = [
  {
    id: "gpt4",
    name: "GPT-4",
    provider: "OpenAI",
    description: "最强大的通用大模型，擅长复杂推理和创意写作",
    strengths: ["复杂推理", "代码生成", "创意写作", "多轮对话"],
    bestFor: "需要深度分析和高质量内容生成的场景",
    rating: 4.9,
  },
  {
    id: "claude",
    name: "Claude 3",
    provider: "Anthropic",
    description: "注重安全性和有益性的AI助手，长文本处理能力强",
    strengths: ["长文本理解", "安全可靠", "文档分析", "学术研究"],
    bestFor: "处理长文档、研究报告和需要严谨性的任务",
    rating: 4.8,
  },
  {
    id: "qwen",
    name: "通义千问",
    provider: "阿里云",
    description: "国产大模型标杆，中文理解能力出色",
    strengths: ["中文理解", "商业应用", "多模态", "本地部署"],
    bestFor: "中文场景、企业应用、需要本地部署的场景",
    rating: 4.6,
  },
  {
    id: "doubao",
    name: "豆包",
    provider: "字节跳动",
    description: "面向日常应用的智能助手，交互体验友好",
    strengths: ["日常对话", "信息查询", "写作辅助", "轻量化"],
    bestFor: "日常问答、简单内容创作、信息检索",
    rating: 4.4,
  },
];

const AIToolsCenter = () => {
  const [userPrompt, setUserPrompt] = useState("");
  const [optimizedPrompt, setOptimizedPrompt] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleOptimize = () => {
    if (!userPrompt.trim()) return;
    
    setIsOptimizing(true);
    // Simulate optimization
    setTimeout(() => {
      const optimized = `# 角色定义
你是一位专业的${userPrompt.includes("文档") ? "文档分析" : userPrompt.includes("代码") ? "编程" : "内容创作"}专家。

# 任务描述
${userPrompt}

# 输出要求
1. 请按照结构化格式输出
2. 包含关键要点的总结
3. 如有必要，提供具体的示例

# 约束条件
- 保持专业、准确的表达
- 内容需要具有可操作性
- 如遇不确定信息，请明确标注`;
      
      setOptimizedPrompt(optimized);
      setIsOptimizing(false);
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(optimizedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-[calc(100vh-4rem)] overflow-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-foreground mb-2">AI助手推荐中心</h2>
        <p className="text-sm text-muted-foreground">
          探索最适合您需求的AI工具，并使用Prompt优化器提升交互效果
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left - AI Models */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-medium text-foreground">推荐模型</h3>
          </div>

          <div className="space-y-4">
            {aiModels.map((model, index) => (
              <div
                key={model.id}
                className="glass-card rounded-xl p-5 card-hover animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-base font-semibold text-foreground">{model.name}</h4>
                    <p className="text-xs text-muted-foreground">{model.provider}</p>
                  </div>
                  <div className="flex items-center gap-1 text-warning">
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-sm font-medium">{model.rating}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3">{model.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {model.strengths.map((strength) => (
                    <Badge key={strength} variant="secondary" className="text-xs">
                      {strength}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    <BookOpen className="w-3 h-3 inline mr-1" />
                    {model.bestFor}
                  </p>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    了解更多
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Prompt Optimizer */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <Wand2 className="w-5 h-5 text-accent" />
            <h3 className="text-lg font-medium text-foreground">Prompt优化器</h3>
          </div>

          <div className="glass-card rounded-xl p-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  您的原始想法或提示词
                </label>
                <Textarea
                  placeholder="例如：帮我分析这份财务报表"
                  className="min-h-[120px] bg-secondary/50"
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                />
              </div>

              <Button
                onClick={handleOptimize}
                disabled={!userPrompt.trim() || isOptimizing}
                className="w-full"
                variant="gradient"
              >
                {isOptimizing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    优化中...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    优化提示词
                  </>
                )}
              </Button>

              {optimizedPrompt && (
                <div className="mt-4 animate-fade-in">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-foreground">
                      优化后的提示词
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 mr-1 text-success" />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" />
                          复制
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                    <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                      {optimizedPrompt}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Usage Stats */}
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h4 className="text-base font-medium text-foreground">使用统计</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-secondary/30">
                <p className="text-2xl font-bold text-foreground">156</p>
                <p className="text-xs text-muted-foreground">今日优化次数</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/30">
                <p className="text-2xl font-bold text-foreground">2.4K</p>
                <p className="text-xs text-muted-foreground">本月总使用</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-4 text-center">
              <MessageSquare className="w-3 h-3 inline mr-1" />
              所有交互记录已保存，用于持续优化工具性能
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIToolsCenter;
