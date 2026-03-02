import React, { useEffect, useMemo, useState } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, HeaderAndBodyTable } from "yayang-ui";
import { connect, useIntl } from "umi";
import { ErrorCode } from "@/common/const";
import { Button, Input, message, Tooltip } from "antd";
import useSysDict from "@/utils/useSysDict";
import { getEquipmentBodyTableColumns, toolBarRender } from "../../../utils/equipmentBody";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { SpecialEquipmentVerifyService } from "../../../utils/SpecialEquipmentVerifyService";

const { CrudEditModal } = HeaderAndBodyTable;

/**
 * 压力管道元件制造质量保证体系责任人员推荐表编辑
 * @param props 
 * @returns 
 */
const PCQAStaffNominationnEdit: React.FC<any> = (props: any) => {
  const { dispatch, visible, onCancel, callbackEditSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();
  const [initTableData, setInitTableData] = useState<any>([]);
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

  useEffect(() => {
    //获取表格数据
    dispatch({
      type: "pcQAStaffNomination/getBody",
      payload: {
        sort: 'id',
        order: 'asc',
        filter: JSON.stringify([
          { Key: 'main_id', Val: selectedRecord.main_id, Operator: '=' },
        ]),
      },
      callback: (res: any) => {
        const result = res.rows.map((item: any) => ({
          ...item,
          post_config_id: item.post_config_id ? String(item.post_config_id) : item.post_config_id,
        }))
        setInitTableData(result);
      },
    });
  }, []);

  // 质量控制职务查询
  useEffect(() => {
    dispatch({
      type: "SEPostConfig/getInfo",
      payload: {
        sort: "id",
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
              construction_category: "压力管道元件",
              construction_category_str: "压力管道元件",
            },
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
    <CrudEditModal
      title={"编辑压力管道元件制造质量保证体系责任人员推荐表"}
      visible={visible}
      onCancel={onCancel}
      toolBarRender={toolBarRender}
      initFormValues={{
        ...selectedRecord,
        construction_category: selectedRecord.construction_category.split(",")
      }}
      formColumns={getFormColumns()}
      tableColumns={getEquipmentBodyTableColumns({
        configColumns,
        flattenPostName,
        configData
      })}
      initDataSource={initTableData}
      onCommit={(data: any) => {
        const { addItems, editItems, dataSource, delItems, form } = data;
        const values = form.getFieldsValue();
        return new Promise((resolve) => {
          if (!dataSource.length) {
            return resolve(true);
          }

          const result = SpecialEquipmentVerifyService.validate("6", dataSource);
          if (!result.success) {
            message.warning({
              content: result.msg,
              duration: 5,
            });
            return resolve(true)
          }
          
          dispatch({
            type: "pcQAStaffNomination/updateInfo",
            payload: {
              ...selectedRecord,
              ...values,
              construction_category: Array.isArray(values.construction_category) ? values.construction_category.join(",") : "",
              AddItems: JSON.stringify(addItems),
              UpdateItems: JSON.stringify(editItems),
              DelItems: JSON.stringify(delItems.reduce((result: any[], item: any) => {
                result.push(item.id)
                return result;
              }, [])),
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success('修改成功');
                setTimeout(() => {
                  callbackEditSuccess();
                }, 200);
              }
            },
          });
        });
      }}
    />
  )
}

export default connect()(PCQAStaffNominationnEdit);