import React, { useEffect, useState } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode, HUA_WEI_OBS_CONFIG } from "@/common/const";
import { Form, message } from "antd";
import { queryWBS } from "@/services/user";
import HuaWeiOBSUploadSingleFile from "@/components/HuaWeiOBSUploadSingleFile";


const { CrudEditModal } = SingleTable;

/**
 * 编辑锅炉施工业绩表
 * @param props
 * @constructor
 */
const BoilerPreformanceEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();

  const [form] = Form.useForm();
  const branchCompCode = Form.useWatch('branch_comp_code', form);

  // 分公司数据
  const [branchCompOptions, setBranchCompOptions] = useState<any[]>([]);
  // 项目部数据
  const [wbsOptions, setWbsOptions] = useState<any[]>([]);

  /**
   * 获取初始数据
   */
  const fetchData = async () => {
    // 获取分公司数据
    const branchCompRes = await queryWBS({
      sort: 'wbs_code',
      order: 'asc',
      filter: JSON.stringify([{ Key: 'prop_key', Val: 'subComp', Operator: '=' }])
    });
    // 判断是否成功获取分公司数据
    if (branchCompRes && branchCompRes.rows) {
      const options = branchCompRes.rows.map((item: any) => ({ value: item.wbs_code, name: item.wbs_name }));
      setBranchCompOptions(options);
      // 判断如果分公司只有一条数据，则自动选中
      if (options.length === 1) {
        form.setFieldsValue({ branch_comp_code: options[0].value });
      }
    }
  };

  /**
   * 根据分公司获取项目部数据
   */
  const fetchWbsData = async () => {
    // 判断是否选中了分公司
    if (branchCompCode) {
      const res = await queryWBS({
        sort: 'wbs_code',
        order: 'asc',
        filter: JSON.stringify([
          { Key: 'prop_key', Val: 'dep', Operator: '=' },
          { Key: 'up_wbs_code', Val: branchCompCode, Operator: '=' }
        ])
      });
      // 判断是否成功获取项目部数据
      if (res && res.rows) {
        const options = res.rows.map((item: any) => ({ value: item.wbs_code, name: item.wbs_name }));
        setWbsOptions(options);
        // 判断如果项目部只有一条数据，则自动选中
        if (options.length === 1) {
          form.setFieldsValue({ wbs_code: options[0].value });
        }
      } else {
        setWbsOptions([]);
      }
    }
    else {
      // 如果没有选中分公司，清空项目部数据
      setWbsOptions([]);
    }
  };


  useEffect(() => {
    fetchData();
  }, [])

  useEffect(() => {
    fetchWbsData();
  }, [branchCompCode]);

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'branch_comp_code', // 分公司名称
        'wbs_code', // 项目部名称
        'project_name', // 工程项目名称
        'completion_date', // 竣工日期
        "equipment_type",// 级别-
        "boiler_variety",// 品种-
        "boiler_model",// 型号-
        'equipment_name', // 设备名称
        "equipment_no",// 设备位号-
        'design_pressure', // 设计压力(MPa)
        'quantity', // 数量

        'user_unit_name', // 使用单位名称
        'inspection_unit_name', // 监检单位名称
        // 'inspection_report_file', // 上传监检报告
        {
          title: 'boilerPreformance.inspection_report_file',
          subTitle: "上传监检报告",
          dataIndex: "inspection_report_file",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) =>
            <HuaWeiOBSUploadSingleFile
              accept=".doc,.docx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png,.bmp,.webp"
              sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
              limitSize={100}
              folderPath="/PressureVessel"
              handleRemove={() => form.setFieldsValue({ inspection_report_file: null })}
              onChange={(file) => {
                form.setFieldsValue({ inspection_report_file: file?.response?.url })
              }}
            />
        },
      ])
      .setFormColumnToSelect([
        {
          value: 'branch_comp_code',
          valueAlias: 'value',
          name: 'name',
          valueType: 'select',
          data: branchCompOptions,
          onChange: () => {
            // 当分公司变化时，清空项目部
            form.setFieldsValue({ wbs_code: undefined });
          }
        },
        {
          value: 'wbs_code',
          valueAlias: 'value',
          name: 'name',
          valueType: 'select',
          data: wbsOptions,
        },
      ])
      .setFormColumnToDatePicker([
        { value: 'completion_date', valueType: 'dateTs', needValueType: 'timestamp' },
      ])
      .setFormColumnToInputNumber([
        { value: 'quantity', valueType: 'digit', min: 0 },
        { value: 'design_pressure', valueType: 'digit', min: 0 },
      ])
      .setSplitGroupFormColumns([
        {
          columns: [
            "branch_comp_code",
            "wbs_code"
          ],
          title: "单位归属信息",
          order: 1
        },
        {
          columns: [
            "project_name",
            "completion_date",
          ],
          title: "项目信息",
          order: 2
        },
        {
          columns: [
            "equipment_name",
            "equipment_type",
            "equipment_no",// 设备位号-
            "design_pressure",
            "quantity",
            "boiler_variety",// 品种-
            "boiler_model",// 型号-
          ],
          title: "设备技术参数",
          order: 3
        },
        {
          columns: [
            "inspection_report_file",
            "inspection_unit_name",
            "user_unit_name",
          ],
          title: "项目合规与使用信息",
          order: 4
        }
      ])
      .needToRules([
        'branch_comp_code', // 分公司名称
        'wbs_code', // 项目部名称
        'project_name', // 工程项目名称
        'completion_date', // 竣工日期
        "equipment_type",// 级别-
        "boiler_variety",// 品种-
        "boiler_model",// 型号-
        'equipment_name', // 设备名称
        "equipment_no",// 设备位号-
        'design_pressure', // 设计压力(MPa)
        'quantity', // 数量
        // 'user_unit_name', // 使用单位名称
        // 'inspection_unit_name', // 监检单位名称
        // 'inspection_report_file', // 上传监检报告
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudEditModal
      form={form}
      title={"编辑锅炉施工业绩表"}
      visible={visible}
      onCancel={onCancel}
      initialValue={selectedRecord}
      columns={getFormColumns()}
      onCommit={(values = {}) => {
        // 对编辑的数据值为undefined和null设置为""
        return new Promise((resolve) => {
          dispatch({
            type: "boilerPreformance/updateInfo",
            payload: {
              ...selectedRecord,
              ...values
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("编辑成功");
                setTimeout(() => {
                  callbackSuccess();
                }, 1000);
              }
            },
          });
        });
      }}
    />
  );
};

export default connect()(BoilerPreformanceEdit);
