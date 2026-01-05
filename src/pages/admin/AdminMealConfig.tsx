import { useState } from 'react';
import { useMeal } from '@/contexts/MealContext';
import { AdminLayout } from '@/components/meal/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { MealType } from '@/types/meal';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { Helmet } from 'react-helmet';

const DAYS = [
  { value: 1, label: '周一' },
  { value: 2, label: '周二' },
  { value: 3, label: '周三' },
  { value: 4, label: '周四' },
  { value: 5, label: '周五' },
  { value: 6, label: '周六' },
  { value: 7, label: '周日' },
];

export default function AdminMealConfig() {
  const { mealTypes, addMealType, updateMealType, deleteMealType } = useMeal();
  const [editingMeal, setEditingMeal] = useState<MealType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cutoffTime: '10:30',
    defaultChoice: true,
    daysOfWeek: [1, 2, 3, 4, 5] as number[],
    sortOrder: 1,
  });
  
  const handleEdit = (mealType: MealType) => {
    setEditingMeal(mealType);
    setFormData({
      name: mealType.name,
      cutoffTime: mealType.cutoffTime,
      defaultChoice: mealType.defaultChoice,
      daysOfWeek: mealType.daysOfWeek,
      sortOrder: mealType.sortOrder,
    });
    setIsDialogOpen(true);
  };
  
  const handleAdd = () => {
    setEditingMeal(null);
    setFormData({
      name: '',
      cutoffTime: '10:30',
      defaultChoice: true,
      daysOfWeek: [1, 2, 3, 4, 5],
      sortOrder: mealTypes.length + 1,
    });
    setIsDialogOpen(true);
  };
  
  const handleSubmit = () => {
    if (!formData.name.trim()) return;
    
    if (editingMeal) {
      updateMealType(editingMeal.id, formData);
    } else {
      addMealType({
        ...formData,
        enabled: true,
      });
    }
    setIsDialogOpen(false);
  };
  
  const handleToggleDay = (day: number) => {
    setFormData(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter(d => d !== day)
        : [...prev.daysOfWeek, day].sort((a, b) => a - b),
    }));
  };
  
  return (
    <AdminLayout>
      <Helmet>
        <title>餐别配置 - 管理后台</title>
        <meta name="description" content="配置早餐、午餐等餐别的截止时间和生效日期" />
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">餐别配置</h2>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            新增餐别
          </Button>
        </div>
        
        <div className="space-y-4">
          {mealTypes.map(mealType => (
            <div key={mealType.id} className="bg-card border rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="text-muted-foreground mt-1">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg text-foreground">{mealType.name}</h3>
                      <Switch
                        checked={mealType.enabled}
                        onCheckedChange={(checked) => updateMealType(mealType.id, { enabled: checked })}
                      />
                      <span className="text-sm text-muted-foreground">
                        {mealType.enabled ? '已启用' : '已停用'}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>截止时间: {mealType.cutoffTime}</span>
                      <span>默认: {mealType.defaultChoice ? '吃' : '不吃'}</span>
                      <span>生效日: {mealType.daysOfWeek.map(d => DAYS.find(day => day.value === d)?.label).join('、')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(mealType)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => deleteMealType(mealType.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingMeal ? '编辑餐别' : '新增餐别'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>餐别名称</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="如：早餐、午餐、晚餐"
                />
              </div>
              
              <div className="space-y-2">
                <Label>截止时间</Label>
                <Input
                  type="time"
                  value={formData.cutoffTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, cutoffTime: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>默认选择</Label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.defaultChoice}
                      onChange={() => setFormData(prev => ({ ...prev, defaultChoice: true }))}
                      className="w-4 h-4 text-primary"
                    />
                    <span>吃</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!formData.defaultChoice}
                      onChange={() => setFormData(prev => ({ ...prev, defaultChoice: false }))}
                      className="w-4 h-4 text-primary"
                    />
                    <span>不吃</span>
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>生效星期</Label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map(day => (
                    <label
                      key={day.value}
                      className="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer hover:bg-accent"
                    >
                      <Checkbox
                        checked={formData.daysOfWeek.includes(day.value)}
                        onCheckedChange={() => handleToggleDay(day.value)}
                      />
                      <span className="text-sm">{day.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>排序</Label>
                <Input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: Number(e.target.value) }))}
                  min={1}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSubmit}>
                保存
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
