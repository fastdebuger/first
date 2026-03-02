import { Form } from 'antd';
import React from 'react';
import {HUA_WEI_OBS_CONFIG} from "@/common/const";
import HuaWeiOBSUploadSingleFile from "@/components/HuaWeiOBSUploadSingleFile";

const SelectedMaterialUrl = (props: any) => {

  const { form, value, onChange, sysBasicDictList } = props;
  const materialType = Form.useWatch('material_type', form);
  const filterArr = sysBasicDictList.filter(r => r.type === 'material_type');
  console.log("filterArr", filterArr);
  console.log("materialType", materialType);
  const findObj = filterArr.find(r => r.value === materialType);
  console.log("findObj", findObj);
  return (
    <div>
      {materialType ? (
        <HuaWeiOBSUploadSingleFile
          accept={findObj.extend_1 || ''}
          sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
          limitSize={10}
          value={value}
          folderPath="/hr/courseMaterial"
          handleRemove={() => onChange('')}
          onChange={(file) => {
            onChange(file?.response?.url)
          }}
        />
      ) : (
        <span>先选择类型</span>
      )}
    </div>
  )
}
export default SelectedMaterialUrl;
