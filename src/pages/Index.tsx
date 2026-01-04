import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import Dashboard from "@/components/dashboard/Dashboard";
import DocumentCenter from "@/components/documents/DocumentCenter";
import IntelligenceCenter from "@/components/intelligence/IntelligenceCenter";
import AIToolsCenter from "@/components/ai-tools/AIToolsCenter";
import { Helmet } from "react-helmet";
import { AuthProvider } from "@/contexts/AuthContext";

const tabConfig = {
  dashboard: {
    title: "智能仪表盘",
    subtitle: "企业AI工具使用概览",
  },
  documents: {
    title: "文档处理中心",
    subtitle: "智能分析·本地安全",
  },
  intelligence: {
    title: "情报日报中心",
    subtitle: "政策·行业·竞对追踪",
  },
  "ai-tools": {
    title: "AI助手推荐",
    subtitle: "模型推荐·Prompt优化",
  },
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const config = tabConfig[activeTab as keyof typeof tabConfig];

  return (
    <AuthProvider>
      <Helmet>
        <title>智脑平台 - 企业级AI工具中心</title>
        <meta name="description" content="企业内部AI工具平台，提供文档智能处理、情报收集分析、AI助手推荐等功能" />
      </Helmet>

      <div className="flex h-screen bg-background overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <Header title={config.title} subtitle={config.subtitle} />
          
          <div className="flex-1 overflow-auto">
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "documents" && <DocumentCenter />}
            {activeTab === "intelligence" && <IntelligenceCenter />}
            {activeTab === "ai-tools" && <AIToolsCenter />}
          </div>
        </main>
      </div>
    </AuthProvider>
  );
};

export default Index;
