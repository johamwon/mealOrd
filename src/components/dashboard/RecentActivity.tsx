import { FileText, MessageSquare, Newspaper, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "document",
    title: "财务报表Q3.xlsx 分析完成",
    description: "已生成数据摘要和趋势分析报告",
    time: "5分钟前",
    icon: FileText,
    iconBg: "bg-primary/20",
    iconColor: "text-primary",
  },
  {
    id: 2,
    type: "intelligence",
    title: "新政策更新：数据安全法修订",
    description: "国家网信办发布最新修订草案",
    time: "12分钟前",
    icon: Newspaper,
    iconBg: "bg-accent/20",
    iconColor: "text-accent",
  },
  {
    id: 3,
    type: "chat",
    title: "AI对话：合同条款审查",
    description: "用户张三完成了合同风险点识别",
    time: "25分钟前",
    icon: MessageSquare,
    iconBg: "bg-warning/20",
    iconColor: "text-warning",
  },
  {
    id: 4,
    type: "document",
    title: "员工手册V2.0.docx 上传成功",
    description: "已加入知识库索引",
    time: "1小时前",
    icon: FileText,
    iconBg: "bg-primary/20",
    iconColor: "text-primary",
  },
  {
    id: 5,
    type: "intelligence",
    title: "竞对动态：XX公司发布新产品",
    description: "已添加至今日情报日报",
    time: "2小时前",
    icon: Newspaper,
    iconBg: "bg-accent/20",
    iconColor: "text-accent",
  },
];

const RecentActivity = () => {
  return (
    <div className="glass-card rounded-xl p-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">最近活动</h3>
        <button className="text-sm text-primary hover:text-primary/80 transition-colors">
          查看全部
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-3 rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer"
          >
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                activity.iconBg
              )}
            >
              <activity.icon className={cn("w-5 h-5", activity.iconColor)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {activity.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {activity.description}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
              <Clock className="w-3 h-3" />
              {activity.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
