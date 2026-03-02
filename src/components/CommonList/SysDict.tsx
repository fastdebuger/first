import {Empty, Select } from 'antd';
import {useEffect, useState } from 'react';
import {getSysDict} from "@/services/contract/basic";
const { Option } = Select;;

interface ISysDictProps {
  /** 要展示的字典表的KEY */
  sysTypeCode: string;
  onChange?: (value: string, fields: any) => void;
  style?: any;
  disabled?: boolean;
  value?: string;
}

const SysDict = (props: ISysDictProps) => {

  const { style, value, onChange, sysTypeCode = '', disabled = false } = props;

  const [selectValue, setSelectValue] = useState(undefined);
  const [list, setList] = useState<any[]>([]);

  const fetchList = async () => {
    const res = await getSysDict({
      sort: 'id',
      order: 'asc',
      filter: JSON.stringify([{ "Key": "sys_type_code", "Val": sysTypeCode, "Operator": "=" }]),
    })
    const _list: any[] = res.rows || [];
    setList(_list);
    // 说明有默认值
    if (value) {
      // 为了兼容 之前业务 把 字典表的 id 存到数据库中
      // 我这里就存值就行，不存ID
      const findIdObj = _list.find(item => item.dict_name === value);
      if(findIdObj) {
        setSelectValue(findIdObj.dict_name);
      }
    }
  }

  useEffect(() => {
    fetchList()
  }, [value]);

  const handleChange = (_value: string) => {
    const findDictNameObj = list.find(item => item.dict_name === value);
    onChange?.(_value, findDictNameObj);
  }

  return (
    <Select
      style={style}
      onChange={handleChange}
      showSearch
      allowClear
      disabled={disabled}
      placeholder="请选择"
      value={selectValue}
      filterOption={(input, opt) => {
        // @ts-ignore
        return opt.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      }}
    >
      {list.length > 0 ?
        list.map((item: any) => {
          return (
            <Option key={item['dict_name']} value={item['dict_name']}>
              {item['dict_name']}
            </Option>
          );
        }) : (
          <Empty/>
        )}
    </Select>
  )
}

export default SysDict
