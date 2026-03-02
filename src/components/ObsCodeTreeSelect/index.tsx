import React from 'react';
import { TreeSelect } from 'antd';

/**
 * OBS编码数据项接口
 * 用于表示组织架构编码的扁平数据结构
 */
export interface ObsCodeItem {
  /** WBS编码 */
  wbs_code: string;
  /** OBS编码，格式为层级结构，例如: "1325.mainDep.13250026" */
  obs_code: string;
  /** OBS名称，用于显示 */
  obs_name: string;
  /** 属性键值 */
  prop_key: string;
  /** 行号（可选） */
  RowNumber?: number;
}

/**
 * 树节点接口
 * 用于构建树形选择器的节点结构
 */
export interface TreeNode {
  /** 节点显示标题 */
  title: string;
  /** 节点值（obs_code） */
  value: string;
  /** 节点唯一标识（obs_code） */
  key: string;
  /** 子节点数组（可选） */
  children?: TreeNode[];
  /** 是否为叶子节点（可选） */
  isLeaf?: boolean;
}

/**
 * OBS编码树形选择器组件属性接口
 */
interface ObsCodeTreeSelectProps {
  /** 扁平化的OBS编码数据数组 */
  data: ObsCodeItem[];
  /** 当前选中的值，可以是单个字符串或字符串数组（多选模式） */
  value?: string | string[];
  /** 值变化时的回调函数 */
  onChange?: (value: string | string[]) => void;
  /** 占位符文本，默认为"请选择" */
  placeholder?: string;
  /** 是否支持多选，默认为false */
  multiple?: boolean;
  /** 是否显示清除按钮，默认为true */
  allowClear?: boolean;
  /** 自定义样式 */
  style?: React.CSSProperties;
  /** 是否禁用，默认为false */
  disabled?: boolean;
  /** 是否显示搜索框，默认为true */
  showSearch?: boolean;
  /** 是否默认展开所有节点，默认为false */
  treeDefaultExpandAll?: boolean;
}

/**
 * 将obs_code转换为层级数组
 * @param obsCode OBS编码字符串，格式为层级结构，例如: "1325.mainDep.13250026"
 * @returns 层级数组，例如: ["1325", "mainDep", "13250026"]
 */
const getObsCodeParts = (obsCode: string): string[] => {
  return obsCode.split('.').filter(Boolean);
};

/**
 * 获取obs_code的层级深度（点的数量）
 * @param obsCode OBS编码字符串
 * @returns 层级深度，例如: "1325.mainDep.13250026" 返回 2
 */
const getObsCodeLevel = (obsCode: string): number => {
  return (obsCode.match(/\./g) || []).length;
};

/**
 * 检查childCode是否是parentCode的子级（通过前缀匹配）
 * @param childCode 子级OBS编码
 * @param parentCode 父级OBS编码
 * @returns 如果childCode是parentCode的子级则返回true，否则返回false
 * 
 * 例如: 
 * - isChildOf("1325.mainDep.13250026", "1325") => true
 * - isChildOf("1325.mainDep.13250026", "1325.mainDep") => true
 * - isChildOf("1325.mainDep.13250026", "1326") => false
 */
const isChildOf = (childCode: string, parentCode: string): boolean => {
  return childCode.startsWith(parentCode + '.');
};

/**
 * 将扁平数据转换为树形结构
 * 根据obs_code的层级关系（通过点分隔符）构建父子关系
 * @param data 扁平化的OBS编码数据数组
 * @returns 树形结构的根节点数组
 * 
 * 算法说明：
 * 1. 按层级（点的数量）对数据进行分组
 * 2. 从低层级到高层级依次处理每个节点
 * 3. 为每个节点查找其父节点（通过前缀匹配）
 * 4. 将没有父节点的节点作为根节点返回
 */
const buildTree = (data: ObsCodeItem[]): TreeNode[] => {
  if (!data || data.length === 0) return [];

  // 按层级分组（点的数量）
  const levelMap = new Map<number, ObsCodeItem[]>();
  data.forEach(item => {
    const level = getObsCodeLevel(item.obs_code);
    if (!levelMap.has(level)) {
      levelMap.set(level, []);
    }
    levelMap.get(level)!.push(item);
  });

  // 获取所有层级，从小到大排序
  const levels = Array.from(levelMap.keys()).sort((a, b) => a - b);

  // 创建节点映射表，用于快速查找
  const nodeMap = new Map<string, TreeNode>();

  // 按层级从低到高构建树
  levels.forEach(level => {
    const items = levelMap.get(level)!;
    
    items.forEach(item => {
      const node: TreeNode = {
        title: item.obs_name,
        value: item.obs_code,
        key: item.obs_code,
        isLeaf: true,
      };

      // 查找父节点：从当前层级-1开始向上查找
      let parentFound = false;
      for (let i = level - 1; i >= 0; i--) {
        const parentItems = levelMap.get(i) || [];
        // 找到最匹配的父节点（前缀匹配）
        for (const parentItem of parentItems) {
          if (isChildOf(item.obs_code, parentItem.obs_code)) {
            const parentNode = nodeMap.get(parentItem.obs_code);
            if (parentNode) {
              if (!parentNode.children) {
                parentNode.children = [];
                parentNode.isLeaf = false;
              }
              // 检查是否已存在，避免重复
              const exists = parentNode.children.some(child => child.value === node.value);
              if (!exists) {
                parentNode.children.push(node);
              }
              parentFound = true;
              break;
            }
          }
        }
        if (parentFound) break;
      }

      // 保存节点到映射表
      nodeMap.set(item.obs_code, node);
    });
  });

  // 找出所有根节点（没有父节点的节点，或者是最低层级的节点）
  const rootNodes: TreeNode[] = [];
  const minLevel = Math.min(...levels);
  
  nodeMap.forEach((node, obsCode) => {
    // 如果是最低层级，直接作为根节点
    const nodeLevel = getObsCodeLevel(obsCode);
    if (nodeLevel === minLevel) {
      rootNodes.push(node);
    } else {
      // 检查是否有父节点
      let hasParent = false;
      for (const [parentCode] of nodeMap) {
        if (parentCode !== obsCode && isChildOf(obsCode, parentCode)) {
          hasParent = true;
          break;
        }
      }
      // 如果没有父节点，说明是根节点
      if (!hasParent) {
        rootNodes.push(node);
      }
    }
  });

  return rootNodes;
};

/**
 * 递归排序树节点
 * 按照obs_code的层级顺序进行排序，确保树形结构按层级有序显示
 * @param nodes 树节点数组
 * @returns 排序后的树节点数组
 * 
 * 排序规则：
 * 1. 按层级从浅到深排序
 * 2. 同层级内按obs_code的字符串顺序排序
 */
const sortTree = (nodes: TreeNode[]): TreeNode[] => {
  return nodes
    .map(node => ({
      ...node,
      children: node.children ? sortTree(node.children) : undefined,
    }))
    .sort((a, b) => {
      const aParts = getObsCodeParts(a.value);
      const bParts = getObsCodeParts(b.value);
      for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
        if (aParts[i] !== bParts[i]) {
          return aParts[i].localeCompare(bParts[i]);
        }
      }
      return aParts.length - bParts.length;
    });
};

/**
 * OBS编码树形选择器组件
 * 基于Ant Design的TreeSelect组件，支持扁平化的OBS编码数据自动转换为树形结构
 * 
 * 功能特性：
 * 1. 自动根据obs_code的层级关系构建树形结构
 * 2. 支持单选和多选模式
 * 3. 支持搜索过滤
 * 4. 自动排序，确保层级有序显示
 * 5. 支持自定义样式和禁用状态
 * 
 * 使用示例：
 * ```tsx
 * <ObsCodeTreeSelect
 *   data={obsCodeData}
 *   value={selectedValue}
 *   onChange={(value) => setSelectedValue(value)}
 *   multiple={false}
 *   placeholder="请选择OBS编码"
 * />
 * ```
 */
const ObsCodeTreeSelect: React.FC<ObsCodeTreeSelectProps> = ({
  data,
  value,
  onChange,
  placeholder = '请选择',
  multiple = false,
  allowClear = true,
  style,
  disabled = false,
  showSearch = true,
  treeDefaultExpandAll = false,
}) => {
  // 计算树形数据并排序
  let treeData: TreeNode[] = [];
  if (data && data.length > 0) {
    const tree = buildTree(data);
    treeData = sortTree(tree);
  }

  return (
    <TreeSelect
      style={style}
      value={value}
      onChange={onChange}
      treeData={treeData}
      placeholder={placeholder}
      multiple={multiple}
      allowClear={allowClear}
      disabled={disabled}
      showSearch={showSearch}
      treeDefaultExpandAll={treeDefaultExpandAll}
      treeNodeFilterProp="title"
      filterTreeNode={(inputValue, node) => {
        return node.title?.toString().toLowerCase().includes(inputValue.toLowerCase()) || false;
      }}
      maxTagCount="responsive"
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
    />
  );
};

export default ObsCodeTreeSelect;

