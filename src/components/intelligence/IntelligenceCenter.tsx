import { useState } from "react";
import { Newspaper, Building2, Scale, Users, TrendingUp, Calendar, Send, Filter, RefreshCw, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PermissionGuard, usePermission } from "@/components/common/PermissionGuard";
import { useAuth } from "@/contexts/AuthContext";
import { permissions } from "@/config/permissions";

const categories = [
  { id: "all", label: "全部", icon: Newspaper },
  { id: "policy", label: "政策法规", icon: Scale },
  { id: "industry", label: "行业动态", icon: TrendingUp },
  { id: "competitor", label: "竞对追踪", icon: Building2, requiresPermission: true },
  { id: "meeting", label: "重要会议", icon: Users },
  { id: "confidential", label: "机密情报", icon: Lock, requiresPermission: true },
];

const newsItems = [
  {
    id: 1,
    category: "policy",
    title: "《数据安全法》实施细则发布，企业合规要求更加明确",
    summary: "国家网信办联合多部门发布最新实施细则，对企业数据分类分级、跨境传输、安全评估等方面提出具体要求...",
    source: "国家网信办",
    time: "2小时前",
    importance: "high",
    tags: ["数据安全", "合规"],
    confidential: false,
  },
  {
    id: 2,
    category: "industry",
    title: "2024年人工智能产业发展报告：大模型应用加速落地",
    summary: "报告显示，国内大模型应用场景持续拓展，企业级应用增长显著，金融、医疗、制造等行业应用渗透率提升...",
    source: "中国信通院",
    time: "3小时前",
    importance: "medium",
    tags: ["AI", "大模型", "产业报告"],
    confidential: false,
  },
  {
    id: 3,
    category: "competitor",
    title: "XX公司发布企业级AI助手2.0版本",
    summary: "新版本增强了文档处理能力，支持更多格式的文件解析，并优化了多轮对话体验...",
    source: "行业监测",
    time: "4小时前",
    importance: "high",
    tags: ["竞品", "产品发布"],
    confidential: false,
  },
  {
    id: 4,
    category: "meeting",
    title: "中央经济工作会议强调加快数字经济发展",
    summary: "会议指出，要大力发展数字经济，加快传统产业数字化转型，推动人工智能等新技术与实体经济深度融合...",
    source: "新华社",
    time: "5小时前",
    importance: "high",
    tags: ["中央会议", "数字经济"],
    confidential: false,
  },
  {
    id: 5,
    category: "confidential",
    title: "【机密】竞争对手内部战略调整动向分析",
    summary: "根据可靠渠道获悉，主要竞争对手正在进行重大战略调整，涉及组织架构、产品线规划等核心内容...",
    source: "商业情报部",
    time: "1小时前",
    importance: "high",
    tags: ["机密", "战略分析"],
    confidential: true,
  },
  {
    id: 6,
    category: "industry",
    title: "云计算市场Q3报告：国产化替代进程加速",
    summary: "第三季度国内云计算市场规模达到890亿元，同比增长32%，其中政务云、金融云增速最快...",
    source: "IDC中国",
    time: "6小时前",
    importance: "medium",
    tags: ["云计算", "国产化"],
    confidential: false,
  },
];

const IntelligenceCenter = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedNews, setSelectedNews] = useState<number | null>(null);
  const { user } = useAuth();
  
  const canViewCompetitor = usePermission(permissions.intelligence.viewCompetitor);
  const canViewConfidential = usePermission(permissions.intelligence.viewConfidential);
  const canConfigPush = usePermission(permissions.intelligence.pushConfig);

  // 根据权限过滤分类
  const visibleCategories = categories.filter(cat => {
    if (cat.id === "competitor") return canViewCompetitor;
    if (cat.id === "confidential") return canViewConfidential;
    return true;
  });

  // 根据权限和分类过滤新闻
  const filteredNews = newsItems.filter(item => {
    // 机密情报权限检查
    if (item.confidential && !canViewConfidential) return false;
    // 竞对情报权限检查
    if (item.category === "competitor" && !canViewCompetitor) return false;
    // 分类过滤
    if (activeCategory === "all") return true;
    return item.category === activeCategory;
  });

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">情报日报中心</h2>
          <p className="text-sm text-muted-foreground mt-1">
            <Calendar className="w-4 h-4 inline mr-1" />
            2024年1月15日 · 已收集 {filteredNews.length} 条情报
            {!canViewConfidential && (
              <span className="ml-2 text-xs text-muted-foreground">
                <EyeOff className="w-3 h-3 inline mr-1" />
                部分机密情报已隐藏
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            筛选
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
          <PermissionGuard requiredRoles={permissions.intelligence.pushConfig}>
            <Button size="sm">
              <Send className="w-4 h-4 mr-2" />
              推送日报
            </Button>
          </PermissionGuard>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {visibleCategories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category.id)}
            className="flex-shrink-0"
          >
            <category.icon className="w-4 h-4 mr-2" />
            {category.label}
          </Button>
        ))}
      </div>

      {/* News Grid */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredNews.map((news, index) => (
            <div
              key={news.id}
              className={cn(
                "glass-card rounded-xl p-5 card-hover cursor-pointer animate-slide-up",
                news.confidential && "border-2 border-warning/30"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setSelectedNews(news.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {news.confidential && (
                    <Badge className="bg-warning/20 text-warning border-0">
                      <Lock className="w-3 h-3 mr-1" />
                      机密
                    </Badge>
                  )}
                  <Badge
                    variant={news.importance === "high" ? "destructive" : "secondary"}
                    className={cn(
                      news.importance === "high" && "bg-destructive/20 text-destructive border-0"
                    )}
                  >
                    {news.importance === "high" ? "重要" : "一般"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{news.source}</span>
                </div>
                <span className="text-xs text-muted-foreground">{news.time}</span>
              </div>

              <h3 className="text-base font-medium text-foreground mb-2 line-clamp-2">
                {news.title}
              </h3>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {news.summary}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {news.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Push Settings - 仅领导层及以上可见 */}
      <PermissionGuard requiredRoles={permissions.intelligence.pushConfig}>
        <div className="mt-6 glass-card rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Send className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">自动推送设置</p>
                <p className="text-xs text-muted-foreground">每日 9:00 推送至：战略发展群、市场部群、研发群</p>
              </div>
            </div>
            <Button variant="outline" size="sm">配置推送</Button>
          </div>
        </div>
      </PermissionGuard>
    </div>
  );
};

export default IntelligenceCenter;
