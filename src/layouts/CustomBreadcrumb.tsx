import React, { useMemo } from "react";
import { Breadcrumb } from "antd";
import { history } from "umi";

type RouteItem = {
  path?: string;
  name?: string;
  redirect?: string;
  exact?: boolean;
  component?: any;
  routes?: RouteItem[];
};

interface ICustomBreadcrumbProps {
  routes: RouteItem[];
  pathName: string;
}

const CustomBreadcrumb: React.FC<ICustomBreadcrumbProps> = ({ routes, pathName }) => {
  const propKey = localStorage.getItem("auth-default-wbs-prop-key") || "dep";

  const filterRoutes = useMemo(() => {
    if (!Array.isArray(routes)) return [];
    return routes.filter((r) => r?.path?.includes(`/${propKey}`));
  }, [routes, propKey]);

  // 找到当前 path 对应的面包屑链路（从根到叶）
  const trail = useMemo(() => {
    const isMatchPrefix = (target: string, nodePath?: string) => {
      if (!nodePath) return false;
      if (nodePath === "/") return true;
      return target === nodePath || target.startsWith(nodePath + "/") || target.startsWith(nodePath);
    };

    const findTrail = (nodes: RouteItem[], target: string): RouteItem[] | null => {
      for (const node of nodes) {
        const nodePath = node.path;

        // 没有 path 的目录节点也可能有 routes（比如纯分组），允许继续向下找
        const canGoDown = Array.isArray(node.routes) && node.routes.length > 0;

        // 叶子：精确命中
        if (nodePath && nodePath === target) {
          return [node];
        }

        // 目录：前缀命中才继续向下
        if (canGoDown && (!nodePath || isMatchPrefix(target, nodePath))) {
          const child = findTrail(node.routes!, target);
          if (child) {
            // 有些 node 没 name 但仍是层级节点，这里也把它带上，显示时再兜底
            return [node, ...child];
          }
        }
      }
      return null;
    };

    return findTrail(filterRoutes, pathName) || [];
  }, [filterRoutes, pathName]);

  if (!pathName || filterRoutes.length < 1 || trail.length < 1) return null;

  // 生成兄弟节点和子菜单
  const buildMenuItems = (siblings: RouteItem[] = []): any["items"] => {
    const valid = siblings.filter((s) => !!s?.name && !!s?.path && !s.redirect);

    return valid.map((s) => {
      const hasChildren = Array.isArray(s.routes) && s.routes.some((c) => !!c?.name && !!c?.path && !c.redirect);

      if (hasChildren) {
        return {
          key: s.path!,
          label: s.name!,
          children: buildMenuItems(s.routes), // 递归处理子菜单
        };
      }

      return {
        key: s.path!,
        label: (
          <span
            style={{ cursor: "pointer", display: "inline-block", width: "100%" }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              history.push(s.path!);
            }}
          >
            {s.name}
          </span>
        ),
      };
    });
  };

  // 渲染面包屑项，非最后节点不可点击
  const renderItems = () => {
    const nodes = trail.filter((n) => !!n?.name); // 没 name 的节点不显示

    return nodes.map((node, idx) => {
      const isFirst = idx === 0;
      const isLast = idx === nodes.length - 1; // 判断是否是最后节点
      const parent = idx > 0 ? nodes[idx - 1] : null;

      // 当前节点所在层级的 siblings 来自 parent.routes
      const siblings = parent?.routes || [];
      const menuItems = !isFirst ? buildMenuItems(siblings) : undefined;

      const content = isFirst || isLast ? (
        <span>{node.name}</span> // 第一个和最后一个节点不可点击
      ) : (
        <a
          onClick={(e) => {
            e.preventDefault();
            // history.push(node.path!); // 点击跳转
          }}
        >
          {node.name}
        </a>
      );

      return (
        <Breadcrumb.Item
          key={node.path || `${node.name}-${idx}`}
          // 只有非第一个节点才展示菜单
          menu={!isFirst && menuItems && menuItems.length ? { items: menuItems } : undefined}
        >
          {content}
        </Breadcrumb.Item>
      );
    });
  };

  return <Breadcrumb>{renderItems()}</Breadcrumb>;
};

export default CustomBreadcrumb;
