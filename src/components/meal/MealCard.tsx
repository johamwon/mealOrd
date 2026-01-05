import { MealType, MealSelection } from '@/types/meal';
import { useMeal } from '@/contexts/MealContext';
import { Button } from '@/components/ui/button';
import { Check, X, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MealCardProps {
  mealType: MealType;
  date: string;
  selection?: MealSelection;
  isToday?: boolean;
}

export function MealCard({ mealType, date, selection, isToday = false }: MealCardProps) {
  const { updateSelection, isCutoffPassed, currentUser } = useMeal();
  
  const isCutoff = isToday && isCutoffPassed(mealType);
  const currentChoice = selection?.choice ?? mealType.defaultChoice;
  
  const handleToggle = (choice: boolean) => {
    if (!currentUser) return;
    if (isCutoff) return;
    updateSelection(date, mealType.id, choice);
  };
  
  return (
    <div className={cn(
      "bg-card border rounded-xl p-5 transition-all",
      isCutoff ? "opacity-70" : "hover:shadow-md"
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center text-xl",
            mealType.name === '早餐' ? "bg-warning/10" : "bg-primary/10"
          )}>
            {mealType.name === '早餐' ? '🌅' : '☀️'}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">{mealType.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>截止 {mealType.cutoffTime}</span>
            </div>
          </div>
        </div>
        
        {isCutoff && (
          <div className="flex items-center gap-1 px-2 py-1 bg-destructive/10 text-destructive rounded-md text-sm">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>已截止</span>
          </div>
        )}
      </div>
      
      {!currentUser ? (
        <p className="text-center text-muted-foreground py-2">请先选择用户</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant={currentChoice ? "default" : "outline"}
            className={cn(
              "h-12 text-base font-medium transition-all",
              currentChoice && "bg-success hover:bg-success/90"
            )}
            onClick={() => handleToggle(true)}
            disabled={isCutoff}
          >
            <Check className="w-5 h-5 mr-2" />
            吃
          </Button>
          <Button
            variant={!currentChoice ? "default" : "outline"}
            className={cn(
              "h-12 text-base font-medium transition-all",
              !currentChoice && "bg-destructive hover:bg-destructive/90"
            )}
            onClick={() => handleToggle(false)}
            disabled={isCutoff}
          >
            <X className="w-5 h-5 mr-2" />
            不吃
          </Button>
        </div>
      )}
      
      {selection?.updatedAt && (
        <p className="text-xs text-muted-foreground mt-3 text-center">
          最后更新: {new Date(selection.updatedAt).toLocaleTimeString('zh-CN')}
        </p>
      )}
    </div>
  );
}
