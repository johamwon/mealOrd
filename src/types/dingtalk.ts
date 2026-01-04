// 钉钉用户信息类型
export interface DingTalkUserInfo {
  userId: string;
  name: string;
  avatar?: string;
  company: string;
  department: string;
  position: string; // 职务
  jobLevel: string; // 职级
  mobile?: string;
  email?: string;
}

// 钉钉职级到系统角色的映射
export type JobLevelMapping = {
  pattern: RegExp | string;
  role: "admin" | "leadership" | "middle" | "employee";
};

// 默认职级映射规则
export const defaultJobLevelMappings: JobLevelMapping[] = [
  { pattern: /^(CEO|总裁|董事长|总经理|CTO|CFO|COO)$/i, role: "leadership" },
  { pattern: /^(副总|VP|副总裁|总监|Director)$/i, role: "leadership" },
  { pattern: /^(经理|主管|Manager|Supervisor|组长|Team Lead)$/i, role: "middle" },
  { pattern: /^(系统管理员|IT管理员|Admin)$/i, role: "admin" },
  { pattern: "default", role: "employee" },
];

// 根据职级获取系统角色
export function mapJobLevelToRole(
  jobLevel: string,
  position: string,
  mappings: JobLevelMapping[] = defaultJobLevelMappings
): "admin" | "leadership" | "middle" | "employee" {
  const combined = `${position} ${jobLevel}`.trim();
  
  for (const mapping of mappings) {
    if (mapping.pattern === "default") continue;
    if (typeof mapping.pattern === "string") {
      if (combined.includes(mapping.pattern)) return mapping.role;
    } else if (mapping.pattern.test(combined)) {
      return mapping.role;
    }
  }
  
  return "employee";
}
