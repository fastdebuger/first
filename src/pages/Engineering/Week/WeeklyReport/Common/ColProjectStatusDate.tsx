import {PROJECT_STATUS} from "@/common/const";
import FormItemIsDatePicker from "@/pages/Engineering/Week/WeeklyReport/FormItem/FormItemIsDatePicker";
import { Form } from "antd";
import { useEffect, useState } from "react";

const ColProjectStatusDate = ({form}: any) => {

  const projectStatus = Form.useWatch('project_status', form);

  const [labelName, setLabelName] = useState('');

  useEffect(() => {
    const findObj = PROJECT_STATUS.find(p => p.value === projectStatus);
    if (findObj) {
      setLabelName(findObj.date_label);
    }
  }, [projectStatus]);

  return (
    <Form.Item
      label={labelName}
      name="project_status_date"
      rules={[{ required: true, message: '必填项' }]}
    >
      <FormItemIsDatePicker needValue={"date"}/>
    </Form.Item>
  )
}

export default ColProjectStatusDate;
