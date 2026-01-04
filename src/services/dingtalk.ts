import { DingTalkUserInfo, mapJobLevelToRole } from "@/types/dingtalk";
import { UserRole } from "@/contexts/AuthContext";

// 钉钉H5 JS SDK相关配置
declare global {
  interface Window {
    dd?: {
      ready: (callback: () => void) => void;
      error: (callback: (error: Error) => void) => void;
      runtime: {
        permission: {
          requestAuthCode: (options: {
            corpId: string;
            onSuccess: (result: { code: string }) => void;
            onFail: (error: Error) => void;
          }) => void;
        };
      };
      biz: {
        user: {
          get: (options: {
            onSuccess: (result: DingTalkUserInfo) => void;
            onFail: (error: Error) => void;
          }) => void;
        };
      };
    };
  }
}

// 检查是否在钉钉环境中
export function isDingTalkEnv(): boolean {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes("dingtalk");
}

// 模拟钉钉用户数据（用于开发环境测试）
const mockDingTalkUsers: Record<string, DingTalkUserInfo> = {
  leadership: {
    userId: "dd_001",
    name: "李明",
    company: "某科技集团有限公司",
    department: "总经理办公室",
    position: "总经理",
    jobLevel: "M5",
    avatar: "",
  },
  middle: {
    userId: "dd_002",
    name: "王芳",
    company: "某科技集团有限公司",
    department: "市场部",
    position: "市场经理",
    jobLevel: "M3",
    avatar: "",
  },
  employee: {
    userId: "dd_003",
    name: "张伟",
    company: "某科技集团有限公司",
    department: "研发部",
    position: "高级工程师",
    jobLevel: "P6",
    avatar: "",
  },
  admin: {
    userId: "dd_004",
    name: "陈静",
    company: "某科技集团有限公司",
    department: "信息技术部",
    position: "系统管理员",
    jobLevel: "P5",
    avatar: "",
  },
};

// 获取钉钉授权码（实际环境）
export async function getDingTalkAuthCode(corpId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!window.dd) {
      reject(new Error("钉钉JS SDK未加载"));
      return;
    }

    window.dd.ready(() => {
      window.dd!.runtime.permission.requestAuthCode({
        corpId,
        onSuccess: (result) => resolve(result.code),
        onFail: reject,
      });
    });

    window.dd.error((error) => reject(error));
  });
}

// 模拟获取钉钉用户信息（开发环境）
export async function getMockDingTalkUser(
  roleType?: UserRole
): Promise<DingTalkUserInfo> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const type = roleType || "employee";
  return mockDingTalkUsers[type] || mockDingTalkUsers.employee;
}

// 将钉钉用户信息转换为系统用户
export function convertDingTalkUserToSystemUser(ddUser: DingTalkUserInfo) {
  const role = mapJobLevelToRole(ddUser.jobLevel, ddUser.position);
  
  return {
    id: ddUser.userId,
    name: ddUser.name,
    role,
    department: ddUser.department,
    avatar: ddUser.avatar,
    company: ddUser.company,
    position: ddUser.position,
    jobLevel: ddUser.jobLevel,
  };
}

// 职级映射说明
export const jobLevelDescriptions: Record<UserRole, string[]> = {
  admin: ["系统管理员", "IT管理员"],
  leadership: ["总裁", "CEO", "CTO", "CFO", "副总裁", "总经理", "总监", "M4+职级"],
  middle: ["经理", "主管", "组长", "M2-M3职级"],
  employee: ["普通员工", "P系列职级"],
};
