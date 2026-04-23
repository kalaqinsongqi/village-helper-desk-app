/**
 * 权限检查工具
 */

export function getPermissions() {
  try {
    return JSON.parse(localStorage.getItem('permissions') || '[]')
  } catch {
    return []
  }
}

export function getRole() {
  return localStorage.getItem('role') || 'user'
}

export function hasPermission(permissionCode) {
  const perms = getPermissions()
  if (perms.includes('*')) return true
  return perms.includes(permissionCode)
}

export function hasAnyPermission(codes) {
  return codes.some(code => hasPermission(code))
}

/**
 * 菜单权限映射
 */
export const MENU_PERMISSIONS = {
  '/main': null, // 首页所有人可见
  '/main/land-rights': 'land:read',
  '/main/users': 'user:read',
}

/**
 * 检查菜单是否可见
 */
export function hasMenuPermission(path) {
  const perm = MENU_PERMISSIONS[path]
  if (!perm) return true
  return hasPermission(perm)
}

/**
 * 检查是否有任何需要权限的功能菜单可见（不含首页）
 * 用于控制整个侧边栏的显示/隐藏
 */
export function hasAnyVisibleMenu() {
  return Object.entries(MENU_PERMISSIONS).some(([path, perm]) => {
    if (!perm) return false // 跳过首页等无权限要求的菜单
    return hasPermission(perm)
  })
}
