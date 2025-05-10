// 定义路由转换为菜单数据的函数
export const transformRoutesToMenuData = (routes: any[], menuUrlMap: any, accessRoutes: any) => {
  return routes
    .filter((route) => accessRoutes[route.name] && (!route.meta || !route.meta.hideMenu)) // 过滤掉隐藏的路由
    .map((route) => {
      const menuItem: any = {
        type: 'item', // 默认类型为 item
        key: route.path || route.name, // 使用路由的 name 或 path 作为 key
        label: route.meta?.title || route.name, // 使用 meta.title.name 或 path 作为 label
        icon: route.meta?.icon, // 使用 meta.icon 作为图标
        path: route.path, // 使用路由的 path 作为路径
      }

      menuUrlMap[menuItem.key] = route // 将路由路径映射到菜单项的 key

      // 如果路由有子路由，递归处理
      if (route.children && route.children.length > 0) {
        const children = transformRoutesToMenuData(route.children, menuUrlMap, accessRoutes) // 递归处理子路由
        if (children.length > 1 || route.meta?.showAlway) {
          menuItem.children = children
          menuItem.type = 'sub' // 类型改为 sub
        } else if (children.length === 1) {
          const firstChild = children[0]
          menuItem.path = firstChild.path
          menuItem.icon = firstChild.icon
          menuItem.label = firstChild.label
          menuItem.key = firstChild.key
        }
      }

      return menuItem
    })
}

// 定义查找祖先菜单项的函数
export const findAncestorKeys = (
  dataSource: any[],
  targetKey: string,
  path: string[] = [],
): string[] => {
  for (const item of dataSource) {
    // 如果当前项的 key 匹配目标 key，返回当前路径
    if (item.key === targetKey) {
      return path
    }
    // 如果当前项有子项，递归查找
    if (item.children && item.children.length > 0) {
      const result = findAncestorKeys(item.children, targetKey, [...path, item.key])
      if (result.length > 0) {
        return result
      }
    }
  }
  return [] // 如果未找到，返回空数组
}
