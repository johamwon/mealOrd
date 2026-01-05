import { useMeal } from '@/contexts/MealContext';
import { EmployeeLayout } from '@/components/meal/EmployeeLayout';
import { UserSelector } from '@/components/meal/UserSelector';
import { MealCard } from '@/components/meal/MealCard';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Calendar } from 'lucide-react';
import { Helmet } from 'react-helmet';

export default function TodayMeal() {
  const { getActiveMealTypes, getMySelections, currentUser } = useMeal();
  
  const today = new Date();
  const dateStr = format(today, 'yyyy-MM-dd');
  const displayDate = format(today, 'M月d日 EEEE', { locale: zhCN });
  
  const activeMealTypes = getActiveMealTypes(today);
  const mySelections = getMySelections(dateStr);
  
  return (
    <EmployeeLayout>
      <Helmet>
        <title>今日报餐 - 企业报餐系统</title>
        <meta name="description" content="企业员工今日报餐，快速选择早餐和午餐" />
      </Helmet>
      
      <div className="space-y-6">
        {/* Date Header */}
        <div className="flex items-center gap-3 text-foreground">
          <Calendar className="w-5 h-5 text-primary" />
          <span className="text-lg font-medium">{displayDate}</span>
          <span className="px-2 py-0.5 bg-primary/10 text-primary text-sm rounded-full">今天</span>
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
                isToday={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎉</span>
            </div>
            <p className="text-muted-foreground">今天没有需要报餐的餐别</p>
            <p className="text-sm text-muted-foreground mt-1">可能是周末或节假日</p>
          </div>
        )}
        
        {/* Tips */}
        {currentUser && activeMealTypes.length > 0 && (
          <div className="bg-accent/50 rounded-lg p-4 text-sm text-muted-foreground">
            <p>💡 提示：默认选择为"吃"，如果不用餐请点击"不吃"</p>
            <p className="mt-1">截止时间后将无法修改</p>
          </div>
        )}
      </div>
    </EmployeeLayout>
  );
}
