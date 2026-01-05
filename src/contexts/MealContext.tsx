import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, MealType, MealSelection, MealSummary, MealDetail } from '@/types/meal';
import { format, addDays, isWeekend, getDay, isBefore, parse, isToday, isTomorrow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { toast } from 'sonner';

interface MealContextType {
  // 当前用户
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  
  // 用户列表
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  // 餐别配置
  mealTypes: MealType[];
  addMealType: (mealType: Omit<MealType, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMealType: (id: string, data: Partial<MealType>) => void;
  deleteMealType: (id: string) => void;
  
  // 报餐选择
  selections: MealSelection[];
  getSelectionsByDate: (date: string) => MealSelection[];
  getMySelections: (date: string) => MealSelection[];
  updateSelection: (date: string, mealTypeId: string, choice: boolean) => void;
  
  // 统计
  getSummary: (date: string) => MealSummary[];
  getDetails: (date: string) => MealDetail[];
  
  // 辅助函数
  isCutoffPassed: (mealType: MealType) => boolean;
  isMealTypeActiveOnDate: (mealType: MealType, date: Date) => boolean;
  getActiveMealTypes: (date: Date) => MealType[];
  
  // 管理员
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const MealContext = createContext<MealContextType | undefined>(undefined);

// 默认餐别
const defaultMealTypes: MealType[] = [
  {
    id: 'breakfast',
    name: '早餐',
    enabled: true,
    cutoffTime: '08:30',
    defaultChoice: true,
    daysOfWeek: [1, 2, 3, 4, 5],
    sortOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lunch',
    name: '午餐',
    enabled: true,
    cutoffTime: '10:30',
    defaultChoice: true,
    daysOfWeek: [1, 2, 3, 4, 5],
    sortOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// 默认用户（模拟数据）
const defaultUsers: User[] = [
  { id: '1', name: '张三', dept: '技术部', status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', name: '李四', dept: '产品部', status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', name: '王五', dept: '设计部', status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '4', name: '赵六', dept: '运营部', status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '5', name: '孙七', dept: '技术部', status: 'active', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

const ADMIN_PASSWORD = 'admin123';

export function MealProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('meal_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('meal_users');
    return saved ? JSON.parse(saved) : defaultUsers;
  });
  
  const [mealTypes, setMealTypes] = useState<MealType[]>(() => {
    const saved = localStorage.getItem('meal_types');
    return saved ? JSON.parse(saved) : defaultMealTypes;
  });
  
  const [selections, setSelections] = useState<MealSelection[]>(() => {
    const saved = localStorage.getItem('meal_selections');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('meal_is_admin') === 'true';
  });

  // 持久化存储
  useEffect(() => {
    localStorage.setItem('meal_current_user', JSON.stringify(currentUser));
  }, [currentUser]);
  
  useEffect(() => {
    localStorage.setItem('meal_users', JSON.stringify(users));
  }, [users]);
  
  useEffect(() => {
    localStorage.setItem('meal_types', JSON.stringify(mealTypes));
  }, [mealTypes]);
  
  useEffect(() => {
    localStorage.setItem('meal_selections', JSON.stringify(selections));
  }, [selections]);
  
  useEffect(() => {
    localStorage.setItem('meal_is_admin', String(isAdmin));
  }, [isAdmin]);

  // 用户管理
  const addUser = (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newUser: User = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
    toast.success('用户添加成功');
  };
  
  const updateUser = (id: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => 
      u.id === id ? { ...u, ...data, updatedAt: new Date().toISOString() } : u
    ));
    toast.success('用户更新成功');
  };
  
  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    toast.success('用户删除成功');
  };

  // 餐别管理
  const addMealType = (mealTypeData: Omit<MealType, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newMealType: MealType = {
      ...mealTypeData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setMealTypes(prev => [...prev, newMealType].sort((a, b) => a.sortOrder - b.sortOrder));
    toast.success('餐别添加成功');
  };
  
  const updateMealType = (id: string, data: Partial<MealType>) => {
    setMealTypes(prev => prev.map(m => 
      m.id === id ? { ...m, ...data, updatedAt: new Date().toISOString() } : m
    ).sort((a, b) => a.sortOrder - b.sortOrder));
    toast.success('餐别更新成功');
  };
  
  const deleteMealType = (id: string) => {
    setMealTypes(prev => prev.filter(m => m.id !== id));
    toast.success('餐别删除成功');
  };

  // 报餐选择
  const getSelectionsByDate = (date: string) => {
    return selections.filter(s => s.date === date);
  };
  
  const getMySelections = (date: string) => {
    if (!currentUser) return [];
    return selections.filter(s => s.date === date && s.userId === currentUser.id);
  };
  
  const updateSelection = (date: string, mealTypeId: string, choice: boolean) => {
    if (!currentUser) {
      toast.error('请先选择用户');
      return;
    }
    
    const mealType = mealTypes.find(m => m.id === mealTypeId);
    if (!mealType) return;
    
    // 检查是否已截止（仅对今日生效）
    const today = format(new Date(), 'yyyy-MM-dd');
    if (date === today && isCutoffPassed(mealType)) {
      toast.error(`${mealType.name}已过截止时间，无法修改`);
      return;
    }
    
    setSelections(prev => {
      const existingIndex = prev.findIndex(
        s => s.date === date && s.userId === currentUser.id && s.mealTypeId === mealTypeId
      );
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          choice,
          updatedAt: new Date().toISOString(),
        };
        return updated;
      } else {
        return [...prev, {
          id: crypto.randomUUID(),
          date,
          userId: currentUser.id,
          mealTypeId,
          choice,
          updatedAt: new Date().toISOString(),
        }];
      }
    });
    
    toast.success(choice ? '已报餐' : '已取消报餐');
  };

  // 统计
  const getSummary = (date: string): MealSummary[] => {
    const dateSelections = getSelectionsByDate(date);
    const activeUsers = users.filter(u => u.status === 'active');
    
    return mealTypes
      .filter(m => m.enabled)
      .map(mealType => {
        const mealSelections = dateSelections.filter(s => s.mealTypeId === mealType.id);
        const eating = mealSelections.filter(s => s.choice).length;
        const notEating = mealSelections.filter(s => !s.choice).length;
        
        return {
          mealTypeId: mealType.id,
          mealTypeName: mealType.name,
          eating,
          notEating,
          total: activeUsers.length,
        };
      });
  };
  
  const getDetails = (date: string): MealDetail[] => {
    const dateSelections = getSelectionsByDate(date);
    const activeUsers = users.filter(u => u.status === 'active');
    
    return activeUsers.map(user => {
      const userSelections = dateSelections.filter(s => s.userId === user.id);
      
      return {
        userId: user.id,
        userName: user.name,
        dept: user.dept,
        selections: mealTypes
          .filter(m => m.enabled)
          .map(mealType => {
            const selection = userSelections.find(s => s.mealTypeId === mealType.id);
            return {
              mealTypeId: mealType.id,
              mealTypeName: mealType.name,
              choice: selection?.choice ?? mealType.defaultChoice,
              updatedAt: selection?.updatedAt ?? '',
            };
          }),
      };
    });
  };

  // 辅助函数
  const isCutoffPassed = (mealType: MealType): boolean => {
    const now = new Date();
    const [hours, minutes] = mealType.cutoffTime.split(':').map(Number);
    const cutoff = new Date();
    cutoff.setHours(hours, minutes, 0, 0);
    return now >= cutoff;
  };
  
  const isMealTypeActiveOnDate = (mealType: MealType, date: Date): boolean => {
    if (!mealType.enabled) return false;
    const dayOfWeek = getDay(date);
    // JavaScript getDay: 0=周日, 1=周一...6=周六
    // 我们的格式: 1=周一...7=周日
    const adjustedDay = dayOfWeek === 0 ? 7 : dayOfWeek;
    return mealType.daysOfWeek.includes(adjustedDay);
  };
  
  const getActiveMealTypes = (date: Date): MealType[] => {
    return mealTypes
      .filter(m => isMealTypeActiveOnDate(m, date))
      .sort((a, b) => a.sortOrder - b.sortOrder);
  };

  // 管理员
  const login = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      toast.success('登录成功');
      return true;
    }
    toast.error('密码错误');
    return false;
  };
  
  const logout = () => {
    setIsAdmin(false);
    toast.success('已退出管理');
  };

  return (
    <MealContext.Provider value={{
      currentUser,
      setCurrentUser,
      users,
      addUser,
      updateUser,
      deleteUser,
      mealTypes,
      addMealType,
      updateMealType,
      deleteMealType,
      selections,
      getSelectionsByDate,
      getMySelections,
      updateSelection,
      getSummary,
      getDetails,
      isCutoffPassed,
      isMealTypeActiveOnDate,
      getActiveMealTypes,
      isAdmin,
      login,
      logout,
    }}>
      {children}
    </MealContext.Provider>
  );
}

export function useMeal() {
  const context = useContext(MealContext);
  if (!context) {
    throw new Error('useMeal must be used within a MealProvider');
  }
  return context;
}
