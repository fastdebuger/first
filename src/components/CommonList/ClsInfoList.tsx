import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { connect } from 'umi';

const { Option } = Select;
/**
 * 物料分类一级
 * @param props 
 * @returns 
 */
const ClsInfoList: React.FC<any> = (props) => {
  const {
    value,
    dispatch,
    onChange
  } = props;
  const [initValue, setInitvalue] = useState(value ? value : '')
  const [selectValue, setSelectValue] = useState<any>(undefined);
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'materialclsinfo/getMaterialClsInfo',
        payload: {
          sort: 'cls_code',
          order: 'asc',
          filter: JSON.stringify([
            {
              "Key": "level_no",
              "Val": "01",
              "Operator": "="
            }
          ])
        },
        callback: (res: any) => {
          setSelectValue(res.rows)
        }
      });
    }

    if (dispatch && value) {
      dispatch({
        type: 'materialclsinfo/getMaterialClsInfoFilter',
        payload: {
          sort: 'cls_code',
          order: 'asc',
          filter: JSON.stringify([
            {
              "Key": "up_cls_code",
              "Val": value + "%",
              "Operator": "like"
            }
          ])
        },
      });
    }
  }, []);


  const handleChange = (_value: string | any) => {
    if (onChange) onChange(_value.value);
    setInitvalue(_value.value);
    dispatch({
      type: 'materialclsinfo/getMaterialClsInfoFilter',
      payload: {
        sort: 'cls_code',
        order: 'asc',
        filter: JSON.stringify([
          {
            "Key": "up_cls_code",
            "Val": _value.value + "%",
            "Operator": "like"
          }
        ])
      },
    });
  };

  return (
    <Select
      // style={style}
      // size={size}
      onChange={handleChange}
      labelInValue={true}
      placeholder="请输入编码类型"
      showSearch
      allowClear
      // disabled={disabled}
      // defaultValue={selectValue}
      value={initValue}
      filterOption={(input, opt) => {
        // @ts-ignore
        return opt.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      }}
    >
      {selectValue &&
        selectValue.map((devItem: any) => {
          return (
            <Option key={devItem.cls_code} value={devItem.cls_code}>
              {devItem.cls_name}
            </Option>
          );
        })}
    </Select>
  );
};

export default connect()(ClsInfoList);
