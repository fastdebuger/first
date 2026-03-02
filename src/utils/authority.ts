import { PROP_KEY, RIGHT_BIT } from '@/common/const';
import { reloadAuthorized } from './Authorized';

// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str?: string): string | string[] {
  const authorityString =
    typeof str === 'undefined' && localStorage ? localStorage.getItem('antd-pro-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    if (authorityString) {
      authority = JSON.parse(authorityString);
    }
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  // preview.pro.ant.design only do not use in your production.
  // preview.pro.ant.design Dedicated environment variable, please do not use it in your project.
  if (!authority) {
    return ['admin'];
  }
  return authority;
}

export function setAuthority(authority: string | string[]): void {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority));
  // auto reload
  reloadAuthorized();
}
// 定义权限数据中单个能力的接口
interface AbilityItem {
  key: string;
  template_code: string;
}

// 定义权限数据中单个功能权限的接口
interface FuncRightItem {
  func_code: string;
  ability_code: AbilityItem[] | null; // ability_code 可能为空或 null
}

/**
 * 检查功能是否需要某个权限，检查是否可以在PC端添加用户：hasPermission('F10001', '新增')
 * @param funcCode 功能Code (页面权限码，如 'D51F101')
 * @param typeKey 按钮功能的类型(中文) 比如 '新增' | '编辑' | '删除' ...
 * @returns boolean 用户是否有该页面的该按钮权限
 */
export function hasPermission(funcCode: string, typeKey: string): boolean {
  // console.log('funcCode :>> ', funcCode, 'typeKey :>> ', typeKey);
  return true
  let funcArr: FuncRightItem[] = [];
  try {
    const authData = localStorage.getItem('auth_wbs_right');
    if (authData) {
      funcArr = JSON.parse(authData);
      // 简单校验解析结果是否为数组
      if (!Array.isArray(funcArr)) {
        funcArr = [];
      }
    }
  } catch (error) {
    // console.error('解析用户权限数据失败:', error);
    funcArr = [];
  }

  // 1. 如果权限数组为空，则无权限
  if (funcArr.length === 0) {
    // console.log('funcArr is empty, return false');
    return false;
  }

  // 2. 找到对应 funcCode 的权限项
  const targetFuncRight = funcArr.find(
    (item: FuncRightItem) => {
      return item.func_code === funcCode
    }
  );
  // console.log('targetFuncRight :>> ', targetFuncRight);

  // 3. 如果找不到对应功能码的权限，则无权限
  if (!targetFuncRight) {
    // console.log(`No right found for funcCode: ${funcCode}, return false`);
    return false;
  }

  const abilityCode = targetFuncRight.ability_code;

  // 4. 检查 ability_code 是否存在且是有效的数组
  if (!abilityCode || !Array.isArray(abilityCode) || abilityCode.length === 0) {
    // console.log(`No ability_code or ability_code is empty for funcCode: ${funcCode}, return false`);
    return false;
  }

  // 5. 提取所有按钮权限的 key
  const keyArr = abilityCode.map((item: AbilityItem) => item.key);
  // console.log('keyArr :>> ', keyArr);

  // 6. 检查用户所需的 typeKey 是否在权限列表中
  const hasThePermission = keyArr.includes(typeKey);

  // console.log(`Check result for ${funcCode} - ${typeKey}: ${hasThePermission}`);
  return hasThePermission;
}

/**
 * 是否有查看权限
 * @param funcCode
 */
export function hasCheckPermission(funcCode: string) {
  return hasPermission(funcCode, RIGHT_BIT.R_CHECK);
}

/**
 * 是否有增加权限
 * @param funcCode
 */
export function hasAddPermission(funcCode: string) {
  return hasPermission(funcCode, RIGHT_BIT.R_ADD);
}

/**
 * 是否有修改权限
 * @param funcCode
 */
export function hasModifyPermission(funcCode: string) {
  return hasPermission(funcCode, RIGHT_BIT.R_MODIFY);
}

/**
 * 是否有删除权限
 * @param funcCode
 */
export function hasDeletePermission(funcCode: string) {
  return hasPermission(funcCode, RIGHT_BIT.R_DELETE);
}

/**
 * 是否有导入权限
 * @param funcCode
 */
export function hasImportPermission(funcCode: string) {
  return hasPermission(funcCode, RIGHT_BIT.R_ADD);
}

/**
 * 是否有导出权限
 * @param funcCode
 */
export function hasExportPermission(funcCode: string) {
  return hasPermission(funcCode, RIGHT_BIT.R_EXPORT);
}

/**
 * 是否有打印权限
 * @param funcCode
 */
export function hasPrintPermission(funcCode: string) {
  return hasPermission(funcCode, RIGHT_BIT.R_PRINT);
}

/**
 * 是否有下载模块权限
 * @param funcCode
 */
export function getTemplateCode(funcCode: string) {
  return hasPermission(funcCode, RIGHT_BIT.R_PRINT);
}

/**
 * 是否具有审核权限
 * @param funcCode
 * @returns {*|boolean}
 */
export function hasApprovalPermission(funcCode: string) {
  return hasPermission(funcCode, RIGHT_BIT.R_APPROVAL);
}

/**
 * 是否具有驳回权限
 * @param funcCode
 * @returns {*|boolean}
 */
export function hasRejectPermission(funcCode: string) {
  return hasPermission(funcCode, RIGHT_BIT.R_APPROVAL);
}

/**
 * 根据权限判断是否有权限
 */
export const isAuthorized = (val: string): boolean => {
  // const permissions = getPermission();
  // return permissions.includes(val);
  return true;
}



/**
 * 用户登陆成功后 将返回的用户信息保存在缓存中
 * @param userInfo
 */
export function setLoginUserData(userInfo: any): void {
  localStorage.setItem('login-user-information', JSON.stringify(userInfo));
  localStorage.setItem('auth-default-cpecc-branchCompCode', userInfo.branch_comp_code);
}
