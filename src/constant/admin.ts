/**
 * 后台管理员的操作权限
 */
export enum AdminPermission {
  READ = 1, // 可读
  WRITE = 2 // 可写
}

// 网站拥有者，即我，拥有所有权限
export const OwnerPermission: AdminPermission = AdminPermission.READ | AdminPermission.WRITE;

// 给游客访问后台的权限仅可读
export const VisitorPermission: AdminPermission = AdminPermission.READ;

/**
 * 验证target权限值是否包含permission权限
 * @param target 
 * @param permission 
 * @returns 
 */
export const hasPermission = (target: AdminPermission, permission: AdminPermission): boolean => {
  return (target & permission) === permission;
}