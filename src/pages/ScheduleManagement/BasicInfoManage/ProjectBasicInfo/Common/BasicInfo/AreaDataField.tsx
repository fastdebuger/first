import React, { useState, useEffect } from 'react';
import { Form, message } from 'antd';
import DynamicFormList from './DynamicFormList';
import { getChildren } from "@/utils/utils-array";
import { ErrorCode } from "@/common/const";

interface AreaDataFieldProps {
  /**
   * 表单实例对象，用于表单控件的绑定和操作
   */
  form: any;
  
  /**
   * 数据源，用于初始化表单数据
   */
  dataSource?: any;
  
  /**
   * 更新数据源的回调函数
   */
  updateDataSource?: (data: any) => void;
  
  /**
   * Redux dispatch 函数，用于发起获取区域数据的 action
   */
  dispatch: any;
  
  /**
   * 是否禁用表单控件
   */
  disabled?: boolean
}

/**
 * 区域数据字段组件
 * 
 * 根据表单「区域类别」（region_category）动态返回项目部地址相关的表单字段配置
 * - region_category 为 '国外' 时：只需要填"区域 + 国家 + 详细地址"
 * - region_category 为 '国内' 时：需要填"区域 + 省/直辖市 + 城市 + 详细地址"
 * 
 * 该组件会被表单渲染逻辑调用，每次 regionCategory 值变化时都会重新执行，
 * 以实现字段的动态切换。
 */
const AreaDataField: React.FC<AreaDataFieldProps> = ({
  form,
  dataSource,
  updateDataSource,
  dispatch,
  disabled,
}) => {
  // 监听表单中的 region_category 字段值变化
  const regionCategory = Form.useWatch('region_category', form);
  
  // 存储区域树形数据的状态
  const [areaTree, setAreaTree] = useState<any[]>([]);
  
  // 加载状态标识
  const [loading, setLoading] = useState(true);

  /**
   * 区域数据获取副作用
   * 当 regionCategory 发生变化时触发，用于获取相应的区域数据
   */
  useEffect(() => {
    // 如果没有选择区域类别，则清空区域树并结束加载
    if (!regionCategory) {
      setAreaTree([]);
      setLoading(false);
      return;
    }
    
    // 开始加载数据
    setLoading(true);
    
    // 发起获取区域字典树的 action
    dispatch({
      type: 'basicInfo/getAreaDictTree',
      payload: { sort: 'id', order: 'asc' },
      callback: (res: any) => {
        // 根据返回结果设置区域树数据
                /**
         * 根据接口返回结果和区域分类设置区域树数据
         * @param res 接口返回的结果对象，包含errCode错误码和result数据
         * @param regionCategory 区域分类标识，'国内'表示中国境内区域，'国外'表示境外区域
         * @param setAreaTree 设置区域树数据的状态更新函数
         * @param message 用于显示错误提示信息的对象
         */
        if (res.errCode === ErrorCode.ErrOk) {
          // 根据不同的区域分类设置对应的区域树数据
          if (regionCategory === '国内') {
            setAreaTree(res.result[0].children || []);
          } else if (regionCategory === '国外') {
            setAreaTree(res.result[1].children || []);
          } else {
            setAreaTree([]);
          }
        } else {
          message.error('加载区域数据失败');
        }
        // 结束加载状态
        setLoading(false);
      },
    });
  }, [regionCategory, dispatch]);

  /**
   * 动态生成字段配置函数
   * 根据当前选择的区域类别生成相应的表单字段配置
   * 
   * @returns {Array} 返回当前应展示的地址字段配置数组
   *          每个对象结构：
   *          - label:   字段标签
   *          - name:    字段名（对应表单的 field name）
   *          - span:    栅格占据列数（基于 antd Col span，最大24）
   *          - type:    组件类型（这里统一为 'input'，可后续扩展）
   *          - rules:   校验规则
   */
  const getAreaFields = (): any[] => {
    const areaData = form?.getFieldValue('area_data');
    console.log('areaData', areaData);
    // 如果没有选择区域类别、正在加载或区域树为空，则返回空数组
    if (!regionCategory || loading || areaTree.length === 0) {
      return [];
    }

    // 判断是否为国内项目
    const isDomestic = regionCategory === '国内';

    // 构造并返回字段配置数组
    return [
      {
        name: 'area',
        label: '区域',
        span: 6,
        type: 'select',
        rules: [{ required: true, message: '请选择区域' }],
        options: areaTree.map((n: any) => ({ label: n.dict_name, value: n.dict_name })),
      },
      ...(areaData.length>0 && areaData[0].area === '其他区域' ?
        [
          {
            name: 'country',
            label: '项目所在国',
            span: 6,
            type: 'input',
            rules: [{ required: true, message: '请输入项目所在国' }],
          },
        ]
        : [
          {
            name: isDomestic ? 'province' : 'country',
            label: isDomestic ? '项目部所在省/直辖市' : '项目所在国',
            span: 6,
            type: 'select',
            rules: [{ required: true, message: '请选择' + (isDomestic ? '项目部所在省/直辖市' : '项目所在国') }],
            options: ({ getFieldValue }: any) => {
              const area = getFieldValue('area');
              return area ? getChildren(areaTree, [area], {
                nameKey: 'dict_name',
                idKey: 'id',
                valueAs: 'name'   // 这一层强制用 dict_name 作为 value
              }) : [];
            },
          },
        ]),
      // 根据是国内还是国外项目决定是否显示城市字段
      ...(isDomestic
        ? [
          {
            name: 'city',
            label: '城市',
            span: 6,
            type: 'select',
            rules: [{ required: true, message: '请选择城市' }],
            options: ({ getFieldValue }: any) => {
              const area = getFieldValue('area');
              const province = getFieldValue('province');
              return area && province ? getChildren(areaTree, [area, province],{
                nameKey: 'dict_name',
                idKey: 'id',
                valueAs: 'name'   // 这一层强制用 dict_name 作为 value
              }) : [];
            },
          },
        ]
        : []),
      {
        name: 'address',
        label: '项目部详细地址',
        span: isDomestic ? 6 : 12,
        type: 'input',
        rules: [{ required: true, message: '请输入项目部详细地址' }],
      },
    ];
  };

    // 当前正在加载地区数据时，显示加载提示信息
    // 该组件会渲染一个居中的加载提示文本，告知用户正在获取地区数据
    if (loading) {
      return <div style={{ padding: '20px', textAlign: 'center' }}>加载地区数据中...</div>;
    }

  // 渲染动态表单列表组件
  return (
    <DynamicFormList
      name="area_data"
      disabled={disabled}
      title="项目区域"
      fieldsList={getAreaFields()}
      form={form}
      dataSource={dataSource}
      updateDataSource={updateDataSource}
      dispatch={dispatch}
    />
  );
};

export default AreaDataField;
