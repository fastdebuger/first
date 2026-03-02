import React, { useEffect, useMemo, useState } from "react";
import { Button, Input, message, Space, Tooltip } from "antd";
import { connect, useIntl } from "umi";
import { BasicFormColumns, HeaderAndBodyTable } from "yayang-ui";
import { configColumns } from "../columns";
import { ErrorCode } from "@yayang/constants";
import useSysDict from "@/utils/useSysDict";
import { QuestionCircleOutlined } from "@ant-design/icons";
import _ from "lodash"
import { getEquipmentBodyTableColumns, toolBarRender } from "../../../utils/equipmentBody";
import { SpecialEquipmentVerifyService } from "../../../utils/SpecialEquipmentVerifyService";

const { CrudAddModal } = HeaderAndBodyTable;

/**
 * 新增锅炉安装改造修理质量保证体系责任人员推荐表
 * @param props
 * @returns
 */
const BoilerQAStaffNominationAdd: React.FC<any> = (props: any) => {
  const { dispatch, visible, onCancel, callbackAddSuccess } = props;
  const { formatMessage } = useIntl();

  // 质量控制职务
  const [postName, setPostName] = useState<any[]>([]);

  const { configData } = useSysDict({
    filter: [
      {
        "Key": "sys_type_code",
        "Val": "'PROFESSIAL','ADMINISTRATIVE_POST'",
        "Operator": "in"
      }
    ]
  })

  // 质量控制职务查询
  useEffect(() => {
    dispatch({
      type: "SEPostConfig/getInfo",
      payload: {
        sort: "id",
        order: 'asc',
        filter: JSON.stringify([
          { Key: 'special_equip_type', Val: "3", Operator: '=' },
        ])
      },
      callback: (res: any) => {
        setPostName(res?.rows || [])
      }
    })
  }, [])


  // 处理数据（平铺、加前缀、删父级）
  const flattenPostName = useMemo(() => {
    const result: any[] = [];
    const nameMap: any = {};
    postName.forEach(item => { nameMap[item.id] = item.post_name; });
    postName.forEach(item => {
      // 检查当前项是否为父节点
      const isParent = postName.some(child => child.parent_id === item.id);
      if (isParent) {
        return;
      }
      if (item.parent_id && nameMap[item.parent_id]) {
        result.push({
          ...item,
          post_name: `${nameMap[item.parent_id]} - ${item.post_name}`
        });
      } else {
        result.push(item);
      }
    });
    return result;
  }, [postName]);

  const staffNominationList = useMemo(() => {
    if (!Array.isArray(flattenPostName)) return []
    return flattenPostName.map(item => ({
      'post_config_id': String(item.id), //质量控制职务
      'post_name': item.post_name, //质量控制职务
      education_level_hint: item.education_level_hint,
      major_studied_hint: item.major_studied_hint,
      technical_title_hint: item.technical_title_hint,
      // 'person_name': "", //姓名
      // 'gender': "", //性别
      // 'education_level': "", //学历
      // 'major_studied': "", //所学专业
      // 'technical_title': "", //技术职称
      // 'professial_id': "", //从事专业
      // 'work_years': "", //工作年限
      // 'administrative_post_id': "", //行政职务
      // 'remark': "", //说明
    }))
  }, [flattenPostName])


  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'unit_name',
        'construction_category',
        {
          title: 'PVQAStaffNomination.description',
          dataIndex: 'description',
          width: 160,
          subTitle: '说明',
          align: 'center',
          renderSelfForm(form) {
            const handleChange = (e) => {
              form.current.setFieldsValue({
                description: e.target.value
              });
            }
            return (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start"
                }}
              >
                <Tooltip title={"包括：建设单位名称、工程名称、地点、开竣工日期、锅炉形式、级别、台数、介质、额定出口压力、材质等参数"} placement="top">
                  <QuestionCircleOutlined style={{ color: '#1890ff', cursor: 'help', padding: "0 5px" }} />
                </Tooltip>
                <Input.TextArea
                  rows={1}
                  style={{ width: "90%" }}
                  onChange={handleChange}
                />
              </div>
            )
          }
        },
      ])
      .setFormColumnToSelect([
        {
          value: 'construction_category',
          name: 'construction_category_str',
          valueType: 'multiple',
          data: [
            {
              construction_category: "安装改造修理",
              construction_category_str: "安装改造修理",
            }
          ],
        }
      ])
      .needToRules([
        'unit_name',
        'construction_category',
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={"新增锅炉安装改造修理质量保证体系责任人员推荐表"}
      visible={visible}
      onCancel={onCancel}
      formColumns={getFormColumns()}
      initFormValues={{}}
      initDataSource={[...staffNominationList]}
      toolBarRender={toolBarRender}
      tableColumns={getEquipmentBodyTableColumns({
        configColumns,
        flattenPostName,
        configData
      })}
      onCommit={(data: any) => {
        const { form, dataSource } = data;
        const values = form.getFieldsValue();
        return new Promise((resolve: any) => {
          if (!dataSource.length) {
            return resolve(true);
          }
          const result = SpecialEquipmentVerifyService.validate("4", dataSource);
          if (!result.success) {
            message.warning({
              content: result.msg,
              duration: 5,
            });
            return resolve(true)
          }
          const datas = dataSource.map((item: any) => _.omit(item, ["id", "key", "isEditRow", "isAddRow", "RowNumber"]))

          dispatch({
            type: "boilerQAStaffNomination/saveInfo",
            payload: {
              ...values,
              construction_category: Array.isArray(values.construction_category) ? values.construction_category.join(",") : "",
              Items: JSON.stringify(datas)
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("新增成功");
                setTimeout(() => {
                  callbackAddSuccess();
                }, 1000);
              }
            },
          });
        });
      }}
    />
  )
}

export default connect()(BoilerQAStaffNominationAdd);
