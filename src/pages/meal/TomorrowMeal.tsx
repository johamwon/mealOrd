import { useMeal } from '@/contexts/MealContext';
import { EmployeeLayout } from '@/components/meal/EmployeeLayout';
import { UserSelector } from '@/components/meal/UserSelector';
import { MealCard } from '@/components/meal/MealCard';
import { format, addDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import { Helmet } from 'react-helmet';

export default function TomorrowMeal() {
  const { getActiveMealTypes, getMySelections, currentUser } = useMeal();
  
  const tomorrow = addDays(new Date(), 1);
  const dateStr = format(tomorrow, 'yyyy-MM-dd');
  const displayDate = format(tomorrow, 'M月d日 EEEE', { locale: zhCN });
  
  const activeMealTypes = getActiveMealTypes(tomorrow);
  const mySelections = getMySelections(dateStr);
  
  return (
    <EmployeeLayout>
      <Helmet>
        <title>明日预报 - 企业报餐系统</title>
        <meta name="description" content="提前预报明日用餐情况，帮助食堂更好地准备" />
      </Helmet>
      
      <div className="space-y-6">
        {/* Date Header */}
        <div className="flex items-center gap-3 text-foreground">
          <Calendar className="w-5 h-5 text-primary" />
          <span className="text-lg font-medium">{displayDate}</span>
          <span className="px-2 py-0.5 bg-accent text-accent-foreground text-sm rounded-full">明天</span>
        </div>
        
        {/* User Selector */}
        <UserSelector />
        
        {/* Meal Cards */}
        {activeMealTypes.length > 0 ? (
          <div className="space-y-4">
            {activeMealTypes.map(mealType => (
              <MealCard
                key={mealType.id}
                mealType={mealType}
                date={dateStr}
                selection={mySelections.find(s => s.mealTypeId === mealType.id)}
                isToday={false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <p className="text-muted-foreground">明天没有需要报餐的餐别</p>
            <p className="text-sm text-muted-foreground mt-1">可能是周末或节假日</p>
          </div>
        )}
        
        {/* Tips */}
        {currentUser && activeMealTypes.length > 0 && (
          <div className="bg-accent/50 rounded-lg p-4 text-sm text-muted-foreground">
            <p>💡 提示：明日预报随时可修改，无截止时间限制</p>
            <p className="mt-1">提前预报可帮助食堂更好地备餐</p>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
