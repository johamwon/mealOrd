import { useAuth, UserRole, roleLabels, roleColors } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, ChevronDown, Shield, Crown, Briefcase, UserCircle, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { jobLevelDescriptions } from "@/services/dingtalk";

const roleIcons: Record<UserRole, typeof User> = {
  admin: Shield,
  leadership: Crown,
  middle: Briefcase,
  employee: UserCircle,
};

export function RoleSwitcher() {
  const { user, switchRole, dingTalkInfo, isLoading } = useAuth();

  if (!user) return null;

  const CurrentIcon = roleIcons[user.role];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2" disabled={isLoading}>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <CurrentIcon className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium">{user.name}</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {user.position && <span>{user.position}</span>}
              {user.jobLevel && <span className="text-primary">({user.jobLevel})</span>}
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        {/* 钉钉用户信息 */}
        {dingTalkInfo && (
          <>
            <DropdownMenuLabel className="font-normal">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col space-y-0.5 min-w-0">
                  <p className="text-sm font-medium truncate">{dingTalkInfo.company}</p>
                  <p className="text-xs text-muted-foreground truncate">{dingTalkInfo.department}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={cn("text-xs px-2 py-0.5 rounded-full", roleColors[user.role])}>
                      {roleLabels[user.role]}
                    </span>
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">切换角色演示</p>
            <p className="text-xs text-muted-foreground">模拟不同钉钉职级的权限视图</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {(Object.keys(roleLabels) as UserRole[]).map((role) => {
          const Icon = roleIcons[role];
          const descriptions = jobLevelDescriptions[role];
          return (
            <DropdownMenuItem
              key={role}
              onClick={() => switchRole(role)}
              className={cn(
                "cursor-pointer flex-col items-start py-2",
                user.role === role && "bg-primary/10"
              )}
            >
              <div className="flex items-center w-full">
                <Icon className="w-4 h-4 mr-2" />
                <span className="flex-1">{roleLabels[role]}</span>
                {role === user.role && (
                  <span className={cn("text-xs px-2 py-0.5 rounded-full", roleColors[role])}>
                    当前
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1 pl-6">
                {descriptions.slice(0, 3).join("、")}
              </p>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}