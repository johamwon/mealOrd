import { useState } from 'react';
import { useMeal } from '@/contexts/MealContext';
import { AdminLayout } from '@/components/meal/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format, addDays, subDays } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Check, X, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Helmet } from 'react-helmet';

export default function AdminSummary() {
  const { getSummary, getDetails, mealTypes } = useMeal();
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const displayDate = format(selectedDate, 'yyyy年M月d日 EEEE', { locale: zhCN });
  
  const summary = getSummary(dateStr);
  const details = getDetails(dateStr);
  const enabledMealTypes = mealTypes.filter(m => m.enabled);
  
  const handlePrevDay = () => setSelectedDate(prev => subDays(prev, 1));
  const handleNextDay = () => setSelectedDate(prev => addDays(prev, 1));
  const handleToday = () => setSelectedDate(new Date());
  
  return (
    <AdminLayout>
      <Helmet>
        <title>今日统计 - 管理后台</title>
        <meta name="description" content="查看每日报餐统计和明细" />
      </Helmet>
      
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">今日统计</h2>
        
        {/* Date Selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" onClick={handlePrevDay}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Input
              type="date"
              value={dateStr}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="w-auto"
            />
            <Button variant="outline" size="icon" onClick={handleNextDay}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={handleToday}>
            今天
          </Button>
          <span className="text-muted-foreground">{displayDate}</span>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {summary.map(item => (
            <div key={item.mealTypeId} className="bg-card border rounded-xl p-5">
              <h3 className="font-semibold text-lg text-foreground mb-4">{item.mealTypeName}</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-success">{item.eating}</div>
                  <div className="text-sm text-muted-foreground">吃</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-destructive">{item.notEating}</div>
                  <div className="text-sm text-muted-foreground">不吃</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-muted-foreground">{item.total - item.eating - item.notEating}</div>
                  <div className="text-sm text-muted-foreground">未确认</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Details Table */}
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg text-foreground">报餐明细</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">姓名</TableHead>
                  <TableHead className="w-24">部门</TableHead>
                  {enabledMealTypes.map(mealType => (
                    <TableHead key={mealType.id} className="text-center w-20">
                      {mealType.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {details.map(detail => (
                  <TableRow key={detail.userId}>
                    <TableCell className="font-medium">{detail.userName}</TableCell>
                    <TableCell className="text-muted-foreground">{detail.dept || '-'}</TableCell>
                    {detail.selections.map(sel => (
                      <TableCell key={sel.mealTypeId} className="text-center">
                        {sel.updatedAt ? (
                          sel.choice ? (
                            <Check className="w-5 h-5 text-success mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-destructive mx-auto" />
                          )
                        ) : (
                          <Minus className="w-5 h-5 text-muted-foreground mx-auto" />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
