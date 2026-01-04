import { UserRole } from "@/contexts/AuthContext";

// 定义各模块的权限配置
export interface ModulePermission {
  view: UserRole[];
  edit?: UserRole[];
  delete?: UserRole[];
  manage?: UserRole[];
}

export const permissions = {
  // 仪表盘权限
  dashboard: {
    // 完整统计数据（含敏感指标）
    fullStats: ["admin", "leadership"] as UserRole[],
    // 基础统计
    basicStats: ["admin", "leadership", "middle", "employee"] as UserRole[],
    // 系统状态
    systemStatus: ["admin"] as UserRole[],
    // 用户活动详情
    userActivity: ["admin", "leadership", "middle"] as UserRole[],
  },

  // 文档处理中心权限
  documents: {
    // 查看所有文档
    viewAll: ["admin", "leadership"] as UserRole[],
    // 查看部门文档
    viewDepartment: ["admin", "leadership", "middle"] as UserRole[],
    // 查看个人文档
    viewPersonal: ["admin", "leadership", "middle", "employee"] as UserRole[],
    // 上传文档
    upload: ["admin", "leadership", "middle", "employee"] as UserRole[],
    // 删除文档
    delete: ["admin", "leadership"] as UserRole[],
    // 使用AI分析
    aiAnalysis: ["admin", "leadership", "middle", "employee"] as UserRole[],
  },

  // 情报中心权限
  intelligence: {
    // 查看所有情报
    viewAll: ["admin", "leadership", "middle", "employee"] as UserRole[],
    // 查看机密情报
    viewConfidential: ["admin", "leadership"] as UserRole[],
    // 查看竞对情报
    viewCompetitor: ["admin", "leadership", "middle"] as UserRole[],
    // 推送配置
    pushConfig: ["admin", "leadership"] as UserRole[],
    // 情报来源管理
    sourceManage: ["admin"] as UserRole[],
  },

  // AI工具中心权限
  aiTools: {
    // 查看推荐模型
    viewModels: ["admin", "leadership", "middle", "employee"] as UserRole[],
    // 使用Prompt优化器
    promptOptimizer: ["admin", "leadership", "middle", "employee"] as UserRole[],
    // 查看使用统计
    viewStats: ["admin", "leadership", "middle"] as UserRole[],
    // 查看详细分析
    detailedAnalysis: ["admin", "leadership"] as UserRole[],
  },

  // 系统设置权限
  settings: {
    // 用户管理
    userManage: ["admin"] as UserRole[],
    // 角色管理
    roleManage: ["admin"] as UserRole[],
    // 系统配置
    systemConfig: ["admin"] as UserRole[],
    // 部门设置
    departmentSettings: ["admin", "leadership"] as UserRole[],
  },
};

// 权限检查工具函数
export function checkPermission(
  userRole: UserRole,
  permissionList: UserRole[]
): boolean {
  return permissionList.includes(userRole);
}

// 获取用户可见的菜单项
export function getVisibleMenuItems(userRole: UserRole) {
  return [
    { id: "dashboard", visible: true },
    { id: "documents", visible: true },
    { id: "intelligence", visible: true },
    { id: "ai-tools", visible: true },
    { id: "settings", visible: permissions.settings.userManage.includes(userRole) },
  ].filter((item) => item.visible);
}
