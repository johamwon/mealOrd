import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Newspaper,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
  Brain,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "智能仪表盘", icon: LayoutDashboard },
  { id: "documents", label: "文档处理中心", icon: FileText },
  { id: "intelligence", label: "情报日报", icon: Newspaper },
  { id: "ai-tools", label: "AI助手推荐", icon: Sparkles },
];

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="font-semibold text-foreground">智脑平台</h1>
              <p className="text-xs text-muted-foreground">Enterprise AI</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="iconSm"
          onClick={() => setCollapsed(!collapsed)}
          className="text-muted-foreground"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "navActive" : "nav"}
            className={cn(
              "w-full",
              collapsed ? "justify-center px-2" : "px-3"
            )}
            onClick={() => onTabChange(item.id)}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="ml-3">{item.label}</span>}
          </Button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        <Button
          variant="nav"
          className={cn("w-full", collapsed ? "justify-center px-2" : "px-3")}
        >
          <Shield className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="ml-3">本地部署</span>}
        </Button>
        <Button
          variant="nav"
          className={cn("w-full", collapsed ? "justify-center px-2" : "px-3")}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="ml-3">系统设置</span>}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
