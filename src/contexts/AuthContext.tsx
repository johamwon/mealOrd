import { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "leadership" | "middle" | "employee";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  department: string;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  switchRole: (role: UserRole) => void;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 模拟用户数据
const mockUsers: Record<UserRole, User> = {
  admin: {
    id: "1",
    name: "系统管理员",
    role: "admin",
    department: "信息技术部",
  },
  leadership: {
    id: "2",
    name: "李总",
    role: "leadership",
    department: "总经理办公室",
  },
  middle: {
    id: "3",
    name: "王经理",
    role: "middle",
    department: "市场部",
  },
  employee: {
    id: "4",
    name: "张员工",
    role: "employee",
    department: "研发部",
  },
};

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
  const [user, setUser] = useState<User | null>(mockUsers.admin);

  const switchRole = (role: UserRole) => {
    setUser(mockUsers[role]);
  };

  const hasPermission = (requiredRoles: UserRole[]) => {
    if (!user) return false;
    return requiredRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        switchRole,
        hasPermission,
        isAuthenticated: !!user,
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
