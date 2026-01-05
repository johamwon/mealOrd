// 用户类型
export interface User {
  id: string;
  name: string;
  dept?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// 餐别类型
export interface MealType {
  id: string;
  name: string;
  enabled: boolean;
  cutoffTime: string; // HH:mm format
  defaultChoice: boolean; // true = 吃, false = 不吃
  daysOfWeek: number[]; // 1-7, 1=周一
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// 报餐选择
export interface MealSelection {
  id: string;
  date: string; // YYYY-MM-DD
  userId: string;
  mealTypeId: string;
  choice: boolean; // true = 吃, false = 不吃
  updatedAt: string;
}

// 设备绑定
export interface DeviceBinding {
  deviceToken: string;
  userId: string;
  createdAt: string;
  lastSeenAt: string;
}

// 统计数据
export interface MealSummary {
  mealTypeId: string;
  mealTypeName: string;
  eating: number;
  notEating: number;
  total: number;
}

// 详情列表项
export interface MealDetail {
  userId: string;
  userName: string;
  dept?: string;
  selections: {
    mealTypeId: string;
    mealTypeName: string;
    choice: boolean;
    updatedAt: string;
  }[];
}
