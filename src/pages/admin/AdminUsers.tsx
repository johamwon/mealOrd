import { useState } from 'react';
import { useMeal } from '@/contexts/MealContext';
import { AdminLayout } from '@/components/meal/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User } from '@/types/meal';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { Helmet } from 'react-helmet';

export default function AdminUsers() {
  const { users, addUser, updateUser, deleteUser } = useMeal();
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dept: '',
    status: 'active' as 'active' | 'inactive',
  });
  
  const filteredUsers = users.filter(user =>
    user.name.includes(search) || (user.dept && user.dept.includes(search))
  );
  
  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      dept: user.dept || '',
      status: user.status,
    });
    setIsDialogOpen(true);
  };
  
  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      dept: '',
      status: 'active',
    });
    setIsDialogOpen(true);
  };
  
  const handleSubmit = () => {
    if (!formData.name.trim()) return;
    
    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      addUser(formData);
    }
    setIsDialogOpen(false);
  };
  
  const handleDelete = (user: User) => {
    if (confirm(`确定要删除用户 "${user.name}" 吗？`)) {
      deleteUser(user.id);
    }
  };
  
  return (
    <AdminLayout>
      <Helmet>
        <title>用户管理 - 管理后台</title>
        <meta name="description" content="管理员工名单，添加或编辑用户信息" />
      </Helmet>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-2xl font-bold text-foreground">用户管理</h2>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            新增用户
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="搜索姓名或部门..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        
        {/* Users Table */}
        <div className="bg-card border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>姓名</TableHead>
                <TableHead>部门</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.dept || '-'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' 
                        ? 'bg-success/10 text-success' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {user.status === 'active' ? '在职' : '离职'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(user)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(user)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* User Count */}
        <p className="text-sm text-muted-foreground">
          共 {users.length} 名用户，其中 {users.filter(u => u.status === 'active').length} 名在职
        </p>
        
        {/* Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? '编辑用户' : '新增用户'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>姓名 *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="请输入姓名"
                />
              </div>
              
              <div className="space-y-2">
                <Label>部门</Label>
                <Input
                  value={formData.dept}
                  onChange={(e) => setFormData(prev => ({ ...prev, dept: e.target.value }))}
                  placeholder="请输入部门（可选）"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>状态</Label>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.status === 'active'}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, status: checked ? 'active' : 'inactive' }))
                    }
                  />
                  <span className="text-sm text-muted-foreground">
                    {formData.status === 'active' ? '在职' : '离职'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleSubmit} disabled={!formData.name.trim()}>
                保存
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
