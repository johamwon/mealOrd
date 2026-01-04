import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { DingTalkUserInfo } from "@/types/dingtalk";
import {
  isDingTalkEnv,
  getMockDingTalkUser,
  convertDingTalkUserToSystemUser,
} from "@/services/dingtalk";

export type UserRole = "admin" | "leadership" | "middle" | "employee";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  department: string;
  avatar?: string;
  // 钉钉扩展字段
  company?: string;
  position?: string;
  jobLevel?: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  switchRole: (role: UserRole) => void;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDingTalk: boolean;
  dingTalkInfo: DingTalkUserInfo | null;
  loginWithDingTalk: (roleType?: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const roleLabels: Record<UserRole, string> = {
  admin: "管理员",
  leadership: "领导班子",
  middle: "中层干部",
  employee: "普通员工",
};

export const roleColors: Record<UserRole, string> = {
  admin: "bg-destructive/20 text-destructive",
  leadership: "bg-warning/20 text-warning",
  middle: "bg-primary/20 text-primary",
  employee: "bg-success/20 text-success",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dingTalkInfo, setDingTalkInfo] = useState<DingTalkUserInfo | null>(null);
  const isDingTalk = isDingTalkEnv();

  // 模拟钉钉登录
  const loginWithDingTalk = async (roleType?: UserRole) => {
    setIsLoading(true);
    try {
      // 开发环境使用模拟数据
      const ddUser = await getMockDingTalkUser(roleType);
      setDingTalkInfo(ddUser);
      
      const systemUser = convertDingTalkUserToSystemUser(ddUser);
      setUser(systemUser);
    } catch (error) {
      console.error("钉钉登录失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 切换角色（演示用）
  const switchRole = async (role: UserRole) => {
    await loginWithDingTalk(role);
  };

  const hasPermission = (requiredRoles: UserRole[]) => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  // 初始化：自动尝试钉钉登录
  useEffect(() => {
    loginWithDingTalk("admin"); // 默认以管理员身份登录（演示）
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        switchRole,
        hasPermission,
        isAuthenticated: !!user,
        isLoading,
        isDingTalk,
        dingTalkInfo,
        loginWithDingTalk,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
