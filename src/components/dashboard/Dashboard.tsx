import { FileText, Newspaper, Sparkles, TrendingUp, Users, Lock, Settings, Database, Key } from "lucide-react";
import StatCard from "./StatCard";
import RecentActivity from "./RecentActivity";
import QuickActions from "./QuickActions";
import { PermissionGuard } from "@/components/common/PermissionGuard";
import { useAuth, roleLabels, roleColors } from "@/contexts/AuthContext";
import { permissions } from "@/config/permissions";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6">
      {/* Role Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={cn(
            "px-3 py-1 rounded-full text-sm font-medium",
            user ? roleColors[user.role] : ""
          )}>
            当前角色：{user ? roleLabels[user.role] : "未登录"}
          </span>
          <span className="text-sm text-muted-foreground">
            您可以通过右上角切换不同角色查看权限差异
          </span>
        </div>
      </div>

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
        
        {/* 仅管理员和领导可见的敏感统计 */}
        <PermissionGuard 
          requiredRoles={permissions.dashboard.fullStats}
          fallback={
            <StatCard
              title="AI对话次数"
              value="***"
              change="需更高权限"
              changeType="neutral"
              icon={Lock}
              iconColor="text-muted-foreground"
              delay={200}
            />
          }
        >
          <StatCard
            title="AI对话次数"
            value="892"
            change="+28% 本周"
            changeType="positive"
            icon={Sparkles}
            iconColor="text-warning"
            delay={200}
          />
        </PermissionGuard>

        <PermissionGuard 
          requiredRoles={permissions.dashboard.fullStats}
          fallback={
            <StatCard
              title="活跃用户"
              value="***"
              change="需更高权限"
              changeType="neutral"
              icon={Lock}
              iconColor="text-muted-foreground"
              delay={300}
            />
          }
        >
          <StatCard
            title="活跃用户"
            value="234"
            change="在线中"
            changeType="neutral"
            icon={Users}
            iconColor="text-success"
            delay={300}
          />
        </PermissionGuard>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - 中层及以上可见完整内容 */}
        <div className="lg:col-span-2">
          <PermissionGuard 
            requiredRoles={permissions.dashboard.userActivity}
            fallback={
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">最近活动</h3>
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Lock className="w-12 h-12 mb-4 opacity-50" />
                  <p className="text-sm">详细活动日志仅限中层及以上查看</p>
                  <p className="text-xs mt-1">请联系管理员获取权限</p>
                </div>
              </div>
            }
          >
            <RecentActivity />
          </PermissionGuard>
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* System Status - 仅管理员可见 */}
      <PermissionGuard requiredRoles={permissions.dashboard.systemStatus}>
        <div className="glass-card rounded-xl p-6 animate-slide-up" style={{ animationDelay: "400ms" }}>
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">系统状态</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/20 text-destructive">仅管理员可见</span>
          </div>
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
      </PermissionGuard>

      {/* Admin Quick Access - 仅管理员可见 */}
      <PermissionGuard requiredRoles={["admin"]}>
        <div className="glass-card rounded-xl p-6 border-2 border-dashed border-primary/30">
          <div className="flex items-center gap-2 mb-4">
            <Key className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">管理员快捷操作</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button className="p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-left">
              <Users className="w-5 h-5 text-primary mb-2" />
              <p className="text-sm font-medium">用户管理</p>
              <p className="text-xs text-muted-foreground">234 用户</p>
            </button>
            <button className="p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-left">
              <Database className="w-5 h-5 text-primary mb-2" />
              <p className="text-sm font-medium">数据备份</p>
              <p className="text-xs text-muted-foreground">上次: 2小时前</p>
            </button>
            <button className="p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-left">
              <Settings className="w-5 h-5 text-primary mb-2" />
              <p className="text-sm font-medium">系统配置</p>
              <p className="text-xs text-muted-foreground">高级设置</p>
            </button>
            <button className="p-4 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-left">
              <TrendingUp className="w-5 h-5 text-primary mb-2" />
              <p className="text-sm font-medium">使用分析</p>
              <p className="text-xs text-muted-foreground">全局报表</p>
            </button>
          </div>
        </div>
      </PermissionGuard>
    </div>
  );
};

export default Dashboard;
