import { useState } from 'react';
import { useMeal } from '@/contexts/MealContext';
import { AdminLayout } from '@/components/meal/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Download, FileSpreadsheet } from 'lucide-react';
import { Helmet } from 'react-helmet';

export default function AdminExport() {
  const { getDetails, mealTypes } = useMeal();
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  const enabledMealTypes = mealTypes.filter(m => m.enabled);
  
  const handleExport = () => {
    // Generate CSV content
    const headers = ['日期', '姓名', '部门', '餐别', '选择', '更新时间'];
    const rows: string[][] = [];
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = format(d, 'yyyy-MM-dd');
      const details = getDetails(dateStr);
      
      details.forEach(detail => {
        detail.selections.forEach(sel => {
          rows.push([
            dateStr,
            detail.userName,
            detail.dept || '',
            sel.mealTypeName,
            sel.choice ? '吃' : '不吃',
            sel.updatedAt ? format(new Date(sel.updatedAt), 'yyyy-MM-dd HH:mm:ss') : '',
          ]);
        });
      });
    }
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');
    
    // Add BOM for Excel UTF-8 compatibility
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `报餐记录_${startDate}_${endDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  return (
    <AdminLayout>
      <Helmet>
        <title>导出数据 - 管理后台</title>
        <meta name="description" content="导出报餐记录为CSV文件" />
      </Helmet>
      
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">导出数据</h2>
        
        <div className="bg-card border rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-4">
            <FileSpreadsheet className="w-12 h-12 text-primary" />
            <div>
              <h3 className="font-semibold text-lg text-foreground">CSV 导出</h3>
              <p className="text-muted-foreground">导出指定日期范围的报餐记录</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">开始日期</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">结束日期</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          
          <div className="bg-accent/50 rounded-lg p-4 space-y-2 text-sm text-muted-foreground">
            <p>导出内容包含：</p>
            <ul className="list-disc list-inside space-y-1">
              <li>日期</li>
              <li>姓名</li>
              <li>部门</li>
              <li>餐别（{enabledMealTypes.map(m => m.name).join('、')}）</li>
              <li>选择（吃/不吃）</li>
              <li>更新时间</li>
            </ul>
          </div>
          
          <Button onClick={handleExport} className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            导出 CSV
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
}
