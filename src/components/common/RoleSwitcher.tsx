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
import { User, ChevronDown, Shield, Crown, Briefcase, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const roleIcons: Record<UserRole, typeof User> = {
  admin: Shield,
  leadership: Crown,
  middle: Briefcase,
  employee: UserCircle,
};

export function RoleSwitcher() {
  const { user, switchRole } = useAuth();

  if (!user) return null;

  const CurrentIcon = roleIcons[user.role];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <CurrentIcon className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.department}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">切换角色演示</p>
            <p className="text-xs text-muted-foreground">选择角色查看不同权限视图</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.keys(roleLabels) as UserRole[]).map((role) => {
          const Icon = roleIcons[role];
          return (
            <DropdownMenuItem
              key={role}
              onClick={() => switchRole(role)}
              className={cn(
                "cursor-pointer",
                user.role === role && "bg-primary/10"
              )}
            >
              <Icon className="w-4 h-4 mr-2" />
              <span className="flex-1">{roleLabels[role]}</span>
              <span className={cn("text-xs px-2 py-0.5 rounded-full", roleColors[role])}>
                {role === user.role ? "当前" : ""}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
