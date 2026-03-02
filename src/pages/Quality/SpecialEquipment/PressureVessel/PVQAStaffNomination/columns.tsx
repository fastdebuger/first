import { AUDIT_STATUS_NAME } from "@/common/common";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Input, InputNumber, Select, Space, Tag, Tooltip } from "antd";

export const configColumns = [
  {
    title: "PVQAStaffNomination.RowNumber",
    subTitle: "序号",
    dataIndex: "RowNumber",
    width: 160,
    align: "center",
  },
  {
    title: "PVQAStaffNomination.wbs_code",
    subTitle: "项目部",
    dataIndex: "wbs_code",
    width: 160,
    align: "center",
  },
  {
    title: "PVQAStaffNomination.wbs_code",
    subTitle: "项目部",
    dataIndex: "wbs_name",
    width: 160,
    align: "center",
  },
  {
    title: "PVQAStaffNomination.unit_name",
    subTitle: "单位名称",
    dataIndex: "unit_name",
    width: 160,
    align: "center",
  },
  {
    title: "PVQAStaffNomination.construction_category",
    subTitle: "施工类别",
    dataIndex: "construction_category",
    width: 160,
    align: "center",
  },
  {
    title: "PVQAStaffNomination.remark",
    subTitle: "备注",
    dataIndex: "remark",
    width: 160,
    align: "center",
  },
  {
    title: "PVQAStaffNomination.main_id",
    subTitle: "序号",
    dataIndex: "main_id",
    width: 160,
    align: "center",
  },
  {
    title: "PVQAStaffNomination.id",
    subTitle: "序号",
    dataIndex: "id",
    width: 160,
    align: "center",
  },
  {
    title: "PVQAStaffNomination.main_id",
    subTitle: "主表编号2",
    dataIndex: "main_id",
    width: 160,
    align: "center",
  },
  {
    title: "PVQAStaffNomination.post_config_id",
    subTitle: "质量控制职务",
    dataIndex: "post_config_id",
    width: 260,
    align: "center",
  },
  {
    title: "PVQAStaffNomination.post_config_id",
    subTitle: "质量控制职务",
    dataIndex: "post_name",
    width: 160,
    align: "center",
  },
  {
    title: "PVQAStaffNomination.person_name",
    subTitle: "姓名",
    dataIndex: "person_name",
    width: 160,
    align: "center",
  },
  {
    title: "PVQAStaffNomination.gender",
    subTitle: "性别",
    dataIndex: "gender",
    width: 160,
    align: "center",
  },
  {
    title: "PVQAStaffNomination.education_level",
    subTitle: "学历",
    dataIndex: "education_level",
    width: 160,
    align: "center",
  },
  {
    title: "PVQAStaffNomination.education_level",
    subTitle: "学历",
    dataIndex: "education_level_name",
    width: 160,
    align: "center",
  },
  {
    title: "PVQAStaffNomination.major_studied",
    subTitle: "所学专业",
    dataIndex: "major_studied",
    width: 160,
    align: "center",
  },
  {
    title: "PVQAStaffNomination.technical_title",
    subTitle: "技术职称",
    dataIndex: "technical_title",
    width: 160,
    align: "center",
  },
  {
    title: "PVQAStaffNomination.technical_title",
    subTitle: "技术职称",
    dataIndex: "technical_title_name",
    width: 160,
    align: "center",
  },
  {
    title: "PVQAStaffNomination.professial_id",
    subTitle: "从事专业",
    dataIndex: "professial_id",
    width: 160,
    align: "center",
  },
  {
    title: "PVQAStaffNomination.professial_id",
    subTitle: "从事专业",
    dataIndex: "professial_name",
    width: 160,
    align: "center",
  },
  {
    title: "PVQAStaffNomination.work_years",
    subTitle: "工作年限",
    dataIndex: "work_years",
    width: 160,
    align: "center",
  },
  {
    title: "PVQAStaffNomination.administrative_post_id",
    subTitle: "行政职务",
    dataIndex: "administrative_post_id",
    width: 160,
    align: "center",
  },
  {
    title: "PVQAStaffNomination.administrative_post_id",
    subTitle: "行政职务",
    dataIndex: "administrative_post_name",
    width: 160,
    align: "center",
  },
  {
    title: "PVQAStaffNomination.description",
    subTitle: "说明",
    dataIndex: "description",
    width: 160,
    align: "center",
  },
  {
    title: "pressureVesselPreformance.audit_status_name",
    subTitle: "审批状态",
    dataIndex: "audit_status_name",
    width: 160,
    align: "center",
    render: (text: any) => {
      if (AUDIT_STATUS_NAME[text]) {
        return <Tag color={AUDIT_STATUS_NAME[text]}>{text}</Tag>
      } else {
        return <Tag color="orange">{text || '暂无审批'}</Tag>
      }
    }
  },
];

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
          {(record[fieldsWithTooltips] || TooltipTitle) && <Tooltip title={record[fieldsWithTooltips] || TooltipTitle || '无'} placement="top">
            <QuestionCircleOutlined style={{ color: '#1890ff', cursor: 'help' }} />
          </Tooltip>}
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
          {(record[fieldsWithTooltips] || TooltipTitle) && <Tooltip title={record[fieldsWithTooltips] || TooltipTitle || '无'} placement="top">
            <QuestionCircleOutlined style={{ color: '#1890ff', cursor: 'help' }} />
          </Tooltip>}
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
          {(record[fieldsWithTooltips] || TooltipTitle) && <Tooltip title={record[fieldsWithTooltips] || TooltipTitle || '无'} placement="top">
            <QuestionCircleOutlined style={{ color: '#1890ff', cursor: 'help' }} />
          </Tooltip>}
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
