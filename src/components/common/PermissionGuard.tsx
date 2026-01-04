import { ReactNode } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Lock } from "lucide-react";

interface PermissionGuardProps {
  requiredRoles: UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
  showLock?: boolean;
}

export function PermissionGuard({
  requiredRoles,
  children,
  fallback,
  showLock = false,
}: PermissionGuardProps) {
  const { hasPermission } = useAuth();

  if (!hasPermission(requiredRoles)) {
    if (fallback) return <>{fallback}</>;
    if (showLock) {
      return (
        <div className="flex items-center justify-center p-4 text-muted-foreground">
          <Lock className="w-4 h-4 mr-2" />
          <span className="text-sm">无权限查看</span>
        </div>
      );
    }
    return null;
  }

  return <>{children}</>;
}

// 内联权限检查 Hook
export function usePermission(requiredRoles: UserRole[]): boolean {
  const { hasPermission } = useAuth();
  return hasPermission(requiredRoles);
}
