import React, { useState } from 'react';
import { Select } from 'antd';
import { connect } from 'umi';

const { Option } = Select;

/**
 * 携带过滤的物料分类
 * @param props 
 * @returns 
 */
const ClsInfoListFilter: React.FC<any> = (props) => {
  const {
    value,
    onChange,
    materialClsInfoList
  } = props;
  const [initValue, setInitvalue] = useState(value ? value : '')

  const handleChange = (_value: string | any) => {
    if (onChange) onChange(_value.value);
    setInitvalue(_value.value);
  };
  return (
    <Select
      value={initValue}
      placeholder="请输入分类名称"
      allowClear
      showSearch
      optionFilterProp="children"
      labelInValue={true}
      filterOption={(input: any, option: any) =>
        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      onChange={handleChange}
    >
      {materialClsInfoList &&
        materialClsInfoList
          .map((devItem: any) => {
            return (
              <Option key={devItem.cls_code} value={devItem.cls_code}>
                {devItem.cls_name}
              </Option>
            );
          })}
    </Select>
  );
};


export default connect(({ common, materialclsinfo }: any) => ({
  materialClsInfoList: materialclsinfo.materialClsInfoListFilter,
}))(ClsInfoListFilter);
