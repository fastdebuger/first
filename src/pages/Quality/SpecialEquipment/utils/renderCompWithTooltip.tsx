import { QuestionCircleOutlined } from "@ant-design/icons";
import { Input, InputNumber, Select, Space, Tooltip } from "antd";


const TooltipPrompt = ({ title }: any) => {
  return (
    <Tooltip title={title} placement="top">
      <QuestionCircleOutlined style={{ color: '#1890ff', cursor: 'help' }} />
    </Tooltip>
  )
}
/**
 * 组件需要提示
 * @param dataIndex 
 * @returns 
 */
export const renderSelect = (dataIndex: string, options: any = {}) => {
  const { datas = [], TooltipTitle = "", fieldsWithTooltips } = options;
  return {
    title: 'PVQAStaffNomination.' + dataIndex,
    dataIndex,
    width: 260,
    align: 'center',
    editable: true,
    renderSelfEditable: (record: any, handleSave: any) => {
      const handleChange = (e: any) => {
        const copyRecord = { ...record };
        Object.assign(copyRecord, {
          [dataIndex]: e,
        });
        handleSave(copyRecord)
      };
      return (
        <div
          style={{
            width: "100%"
          }}
        >
          {(record[fieldsWithTooltips] || TooltipTitle) && (
            <TooltipPrompt title={record[fieldsWithTooltips] || TooltipTitle || '无'} />
          )}
          <Select
            defaultValue={record[dataIndex]}
            style={{ width: "90%", padding: "0 5px" }}
            onChange={handleChange}
            options={datas}
          />
        </div>
      )
    },
  }
}

/**
 * 组件需要提示
 * @param dataIndex 
 * @returns 
 */
export const renderInput = (dataIndex: string, options: any = {}) => {
  const { TooltipTitle = "", fieldsWithTooltips } = options;
  return {
    title: 'PVQAStaffNomination.' + dataIndex,
    dataIndex,
    width: 200,
    align: 'center',
    editable: true,
    renderSelfEditable: (record: any, handleSave: any) => {
      const handleChange = (e: any) => {
        const copyRecord = { ...record };
        Object.assign(copyRecord, {
          [dataIndex]: e?.target?.value,
        });
        handleSave(copyRecord)
      };
      return (
        <Space
          style={{
            width: "100%",
            padding: "0 5px"
          }}
        >
          {(record[fieldsWithTooltips] || TooltipTitle) && (
            <TooltipPrompt title={record[fieldsWithTooltips] || TooltipTitle || '无'} />
          )}
          <Input.TextArea
            defaultValue={record[dataIndex]}
            rows={1}
            style={{ width: "100%", resize: "none" }}
            onChange={handleChange}
          />
        </Space>
      )
    },
  }
}

/**
 * 组件需要提示
 * @param dataIndex 
 * @returns 
 */
export const renderInputNumber = (dataIndex: string, options: any = {}) => {
  const { TooltipTitle = "", fieldsWithTooltips } = options;
  return {
    title: 'PVQAStaffNomination.' + dataIndex,
    dataIndex,
    width: 200,
    align: 'center',
    editable: true,
    renderSelfEditable: (record: any, handleSave: any) => {
      const handleChange = (e: any) => {
        const copyRecord = { ...record };
        Object.assign(copyRecord, {
          [dataIndex]: e
        });
        handleSave(copyRecord)
      };
      return (
        <Space
          style={{
            width: "100%",
            padding: "0 5px"
          }}
        >
          {(record[fieldsWithTooltips] || TooltipTitle) && (
            <TooltipPrompt title={record[fieldsWithTooltips] || TooltipTitle || '无'} />
          )}
          <InputNumber
            defaultValue={record[dataIndex]}
            style={{ width: "100%" }}
            onChange={handleChange}
          />
        </Space>
      )
    },
  }
}
