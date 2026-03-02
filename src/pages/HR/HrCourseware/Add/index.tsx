import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import SelectedMaterialUrl from "../Common/SelectedMaterialUrl";
import type {ConnectState} from "@/models/connect";

const { CrudAddModal } = SingleTable;

/**
 * 新增课件表
 * @param props
 * @constructor
 */
const HrCoursewareAdd: React.FC<any> = (props) => {
  const { dispatch, sysBasicDictList, visible, onCancel, callbackSuccess } = props;
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
        // "id",
        "courseware_name",
        "courseware_type",
        // "is_public",
        {
          title: "compinfo.courseware_url",
          subTitle: "课件资料",
          dataIndex: "courseware_url",
          width: 160,
          align: "center",
          renderSelfForm: (form) => {
            const onChange = (value: string) => {
              form.setFieldsValue({ courseware_url: value })
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
        {value: 'courseware_type', valueAlias: 'value', valueType:"select", name: 'label', data: sysBasicDictList.filter(r => r.type === 'material_type')},
      ])
      .needToRules([
        "courseware_name",
        "courseware_type",
        "courseware_url",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={"新增课件表"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{}}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "hrCourseware/addHrCourseware",
            payload: values,
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("新增成功");
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
}))(HrCoursewareAdd);
