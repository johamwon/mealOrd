import { useMeal } from '@/contexts/MealContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';

export function UserSelector() {
  const { currentUser, setCurrentUser, users } = useMeal();
  
  const activeUsers = users.filter(u => u.status === 'active');
  
  if (currentUser) {
    return (
      <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-foreground">{currentUser.name}</p>
          {currentUser.dept && (
            <p className="text-sm text-muted-foreground">{currentUser.dept}</p>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setCurrentUser(null)}
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="w-4 h-4 mr-1" />
          切换
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">请选择您的姓名</p>
      <Select
        onValueChange={(value) => {
          const user = activeUsers.find(u => u.id === value);
          if (user) setCurrentUser(user);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="选择用户" />
        </SelectTrigger>
        <SelectContent>
          {activeUsers.map(user => (
            <SelectItem key={user.id} value={user.id}>
              {user.name} {user.dept && `(${user.dept})`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
