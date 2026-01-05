import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UtensilsCrossed, CalendarDays, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmployeeLayoutProps {
  children: ReactNode;
}

export function EmployeeLayout({ children }: EmployeeLayoutProps) {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: '今日报餐', icon: UtensilsCrossed },
    { path: '/tomorrow', label: '明日预报', icon: CalendarDays },
  ];
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur border-b">
        <div className="container max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="font-bold text-lg text-foreground">企业报餐</h1>
            </div>
            <Link 
              to="/admin" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container max-w-lg mx-auto px-4 py-6">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur border-t safe-area-pb">
        <div className="container max-w-lg mx-auto px-4">
          <div className="flex">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex-1 flex flex-col items-center py-3 gap-1 transition-colors",
                  location.pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
      
      {/* Bottom padding for nav */}
      <div className="h-20" />
    </div>
  );
}
