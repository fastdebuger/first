import React, { useState, useEffect } from 'react';
import { Cascader, Spin } from 'antd';
import { connect } from 'umi';
// 假设这是您的 umi/dva 架构中的 dispatch 方法，用于调用 effects
// 在实际项目中，您需要将这个组件 connect 到 model，并使用 props.dispatch
const mockDispatch = (action: { type: string; payload?: any }): Promise<any[]> => {
  console.log(`[Dispatching] Action: ${action.type}`, action.payload);

  // --- 模拟您的 Model/Service 层的数据请求 ---
  // 注意：实际项目中，您会在这里调用真实的 API

  if (action.type === 'common/fetchDevList') {
    // 模拟装置列表（第一级）
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { dev_code: 'D100', dev_name: '装置 A - 化工区' },
          { dev_code: 'D200', dev_name: '装置 B - 炼油区' },
          { dev_code: 'D300', dev_name: '装置 C - 公用区' },
        ]);
      }, 300);
    });
  }

  if (action.type === 'common/fetchUnitProjectList') {
    // 模拟单位工程列表（第二级），依赖 devCode
    const { devCode } = action.payload || {};
    return new Promise((resolve) => {
      setTimeout(() => {
        if (devCode === 'D100') {
          resolve([
            { unit_project_code: 'P101', unit_project_name: '塔器工程' },
            { unit_project_code: 'P102', unit_project_name: '管廊工程' },
          ]);
        } else if (devCode === 'D200') {
          resolve([
            { unit_project_code: 'P201', unit_project_name: '反应釜工程' },
          ]);
        } else {
          resolve([]);
        }
      }, 500);
    });
  }

  if (action.type === 'common/fetchUnitList') {
    // 模拟单元列表（第三级），依赖 unitProjectCode
    const { unitProjectCode } = action.payload || {};
    return new Promise((resolve) => {
      setTimeout(() => {
        if (unitProjectCode === 'P101') {
          resolve([
            { unit_code: 'U101A', unit_name: '塔A底部单元' },
            { unit_code: 'U101B', unit_name: '塔A顶部单元' },
          ]);
        } else if (unitProjectCode === 'P201') {
          resolve([
            { unit_code: 'U201Z', unit_name: 'A反应釜核心单元' },
          ]);
        } else {
          resolve([]);
        }
      }, 500);
    });
  }
  return Promise.resolve([]);
};

// --- 定义 Cascader 所需的选项接口 ---
interface CascaderOption {
  value: string;
  label: string;
  children?: CascaderOption[];
  isLeaf?: boolean;
  loading?: boolean;
}

// --- 辅助函数：将 API 数据转换为 Cascader 选项 ---

// 1. 转换装置列表 (DevList) -> 第一级选项
const mapDevToOption = (data: any[]): CascaderOption[] => {
  return data.map(item => ({
    value: item.dev_code,
    label: item.dev_name,
    isLeaf: false, // 装置下还有单位工程，所以不是叶子节点
  }));
};

// 2. 转换单位工程列表 (UnitProjectList) -> 第二级选项
const mapUnitProjectToOption = (data: any[]): CascaderOption[] => {
  return data.map(item => ({
    value: item.unit_project_code,
    label: item.unit_project_name,
    isLeaf: false, // 单位工程下还有单元，所以不是叶子节点
  }));
};

// 3. 转换单元列表 (UnitList) -> 第三级选项
const mapUnitToOption = (data: any[]): CascaderOption[] => {
  return data.map(item => ({
    value: item.unit_code,
    label: item.unit_name,
    isLeaf: true, // 单元是最后一级，是叶子节点
  }));
};

// =========================================================================
// 主应用组件
// =========================================================================

const DynamicCascaderApp: React.FC<any> = (props) => {
  const { dispatch } = props
  const [options, setOptions] = useState<CascaderOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string[]>([]);
  // 1. 组件初始化时，加载第一级数据 (装置列表)
  useEffect(() => {
    setLoading(true);
    dispatch({ type: 'common/fetchDevList' })
      .then((data) => {
        setOptions(mapDevToOption(data.result));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 2. 动态加载下一级数据
  const loadData = (selectedOptions: CascaderOption[]) => {
    const targetOption = selectedOptions[selectedOptions.length - 1]; // 当前点击的选项
    const level = selectedOptions.length; // 确定当前是第几级 (1, 2, or 3)
    targetOption.loading = true; // 显示加载状态

    let fetchPromise: Promise<any[]> | null = null;
    let mapFunction: (data: any[]) => CascaderOption[] = () => [];

    // Level 1 -> Level 2: 装置 -> 单位工程
    if (level === 1) {
      const devCode = targetOption.value;
      fetchPromise = dispatch({
        type: 'common/fetchUnitProjectList',
        payload: { devCode: devCode },
      });;
      mapFunction = mapUnitProjectToOption;
    }
    // Level 2 -> Level 3: 单位工程 -> 单元
    else if (level === 2) {
      const unitProjectCode = targetOption.value;
      fetchPromise = dispatch({
        type: 'common/fetchUnitList',
        payload: { unitProjectCode: unitProjectCode },
      });
      mapFunction = mapUnitToOption;
    }

    if (fetchPromise) {
      fetchPromise.then((data) => {
        targetOption.loading = false;
        const newChildren = mapFunction(data.result);

        // 如果没有子项，将其标记为叶子节点，否则它会继续尝试加载
        if (newChildren.length === 0) {
          targetOption.isLeaf = true;
          targetOption.children = undefined;
        } else {
          targetOption.children = newChildren;
        }

        // 必须通过 setOptions 触发组件重新渲染，更新 children
        setOptions([...options]);
      });
    }
  };

  const onChange = (value: string[], selectedOptions: CascaderOption[]) => {
    setSelectedValue(value);
    console.log('选中的字段值 (Value):', value);
    console.log('选中的选项对象 (Options):', selectedOptions);

    // 如果需要返回三个字段名，可以在这里构造对象
    if (selectedOptions.length === 3) {
      const result = {
        devCode: selectedOptions[0].value,
        unitProjectCode: selectedOptions[1].value,
        unitCode: selectedOptions[2].value,
      };
      console.log('最终返回对象:', result);
      // 这里可以调用外部的 onChange 或 dispatch
    }
  };

  const dropdownRender = (menus: React.ReactNode) => (
    <Spin spinning={loading} tip="正在加载装置列表...">
      {menus}
    </Spin>
  );

  return (
    <Cascader
      options={options}
      loadData={loadData}
      onChange={onChange}
      changeOnSelect
      placeholder="请选择装置/单位工程/单元"
      style={{ width: 450 }}
      size="large"
      value={selectedValue}
      dropdownRender={dropdownRender}
    />
  );
};

export default connect()(DynamicCascaderApp);
