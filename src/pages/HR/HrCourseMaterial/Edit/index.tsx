import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import SelectedMaterialUrl from "@/pages/HR/HrCourseMaterial/Common/SelectedMaterialUrl";
import type {ConnectState} from "@/models/connect";

const { CrudEditModal } = SingleTable;

/**
 * 编辑课程资料
 * @param props
 * @constructor
 */
const HrCourseMaterialEdit: React.FC<any> = (props) => {
  const { dispatch, sysBasicDictList, visible, onCancel, callbackSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (dispatch) {
      // dispatch({
      //   type: '',
      //   payload: {
      //
      //   }
      // })
    }
  }, []);

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        "id",
        "course_id",
        "material_name",
        "material_type",
        {
          title: "compinfo.material_url",
          subTitle: "资料地址",
          dataIndex: "material_url",
          width: 160,
          align: "center",
          renderSelfForm: (form) => {
            const onChange = (value: string) => {
              form.setFieldsValue({ material_url: value })
            }
            return (
              <SelectedMaterialUrl
                from={form}
                sysBasicDictList={sysBasicDictList}
                onChange={onChange}
              />
            )
          }
        },
      ])
      .setFormColumnToSelect([
        {value: 'material_type', valueAlias: 'value', valueType:"select", name: 'label', data: sysBasicDictList.filter(r => r.type === 'material_type')},
      ])
      .setFormColumnToSelfColSpan([ // 设置自定义列跨度的列
        {
          colSpan: 24,
          value: 'course_id',
          labelCol: {
            span: 24
          },
          wrapperCol: {
            span: 24
          }
        }
      ])
      .needToHide([
        "id",
        "course_id",
      ])
      .needToRules([
        "material_name",
        "material_url",
        "material_type",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudEditModal
      title={"编辑课程资料"}
      visible={visible}
      onCancel={onCancel}
      initialValue={selectedRecord}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "hrCourseMaterial/updateHrCourseMaterial",
            payload: values,
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

export default connect(({ common }: ConnectState) => ({
  sysBasicDictList: common.sysBasicDictList
}))(HrCourseMaterialEdit);
