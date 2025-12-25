import { FileText, Newspaper, Sparkles, TrendingUp, Users, Clock, Zap } from "lucide-react";
import StatCard from "./StatCard";
import RecentActivity from "./RecentActivity";
import QuickActions from "./QuickActions";

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="今日文档处理"
          value="128"
          change="+12% 较昨日"
          changeType="positive"
          icon={FileText}
          delay={0}
        />
        <StatCard
          title="情报收集"
          value="56"
          change="已推送至5个群组"
          changeType="neutral"
          icon={Newspaper}
          iconColor="text-accent"
          delay={100}
        />
        <StatCard
          title="AI对话次数"
          value="892"
          change="+28% 本周"
          changeType="positive"
          icon={Sparkles}
          iconColor="text-warning"
          delay={200}
        />
        <StatCard
          title="活跃用户"
          value="234"
          change="在线中"
          changeType="neutral"
          icon={Users}
          iconColor="text-success"
          delay={300}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* System Status */}
      <div className="glass-card rounded-xl p-6 animate-slide-up" style={{ animationDelay: "400ms" }}>
        <h3 className="text-lg font-semibold text-foreground mb-4">系统状态</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
            <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
            <div>
              <p className="text-sm font-medium text-foreground">本地大模型</p>
              <p className="text-xs text-muted-foreground">运行正常 · 响应时间 120ms</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
            <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
            <div>
              <p className="text-sm font-medium text-foreground">情报采集服务</p>
              <p className="text-xs text-muted-foreground">已连接12个数据源</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50">
            <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
            <div>
              <p className="text-sm font-medium text-foreground">知识库服务</p>
              <p className="text-xs text-muted-foreground">索引文档 12,456 篇</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
