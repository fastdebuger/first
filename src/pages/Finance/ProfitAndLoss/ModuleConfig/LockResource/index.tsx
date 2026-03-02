import {message, Switch } from 'antd';
import React, { useEffect } from 'react';
import {updateIsLockResource} from "@/services/common/list";
import {connect} from "umi";

const LockResource = ({dispatch, sysBasicDictList}: any) => {

  const [checked, setChecked] = React.useState(false);

  useEffect(() => {
    const findObj = sysBasicDictList.find(s => s.type === 'IS_LOCK_RESOURCE');
    if (findObj && findObj.value) {
      setChecked(findObj.value === 'Y');
    }
  }, []);

  return (
    <div>
      <strong>是否锁定表格，锁定后项目部不可编辑</strong>
      <div>
        <Switch checkedChildren="开启" unCheckedChildren="关闭" checked={checked} onChange={async (checked) => {
          const _val = checked ? 'Y' : 'N';
          setChecked(checked);
          const res = await updateIsLockResource({
            value: _val,
          })
          if (res.errCode === 0) {
            message.success('配置成功');
            if (dispatch) {
              dispatch({
                type: 'common/querySysBasicDict',
                payload: {
                  sort: 'id',
                  order: 'asc',
                }
              })
            }
          }
        }}/>
      </div>
    </div>
  )
}
export default connect()(LockResource);
