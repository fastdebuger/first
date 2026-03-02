import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import {Card, message, Select, Tag } from "antd";
import planPng from "@/assets/hr/plan.png";
import type {ConnectState} from "@/models/connect";
import SelectedMaterialUrl from "@/pages/HR/HrCourseMaterial/Common/SelectedMaterialUrl";

const { CrudAddModal } = SingleTable;

/**
 * 新增课程资料
 * @param props
 * @constructor
 */
const HrCourseMaterialAdd: React.FC<any> = (props) => {
  const { dispatch, sysBasicDictList, selectedCourseItem, visible, onCancel, callbackSuccess } = props;
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
        {
          title: "compinfo.course_id",
          subTitle: "培训课程",
          dataIndex: "course_id",
          width: 160,
          align: "center",
          renderSelfForm: form => {
            return (
              <>
                <Card
                  hoverable
                  cover={<img style={{width: 200}} alt="example" src={selectedCourseItem.course_cover} />}
                  style={{position: 'relative', width: 200}}
                  bodyStyle={{
                    padding: '8px 16px'
                  }}
                >
                  <Tag color={'blue'} style={{position: 'absolute', top: 6, right: -4}}>
                    {selectedCourseItem.course_tag_str}
                  </Tag>
                  <div><strong style={{fontSize: 16}}>{selectedCourseItem.course_name || ''}</strong></div>
                  <div><strong>{selectedCourseItem.tree_name || ''}分类</strong></div>
                  <div>{selectedCourseItem.course_intro || ''}</div>
                </Card>
              </>
            )
          }
        },
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
      .setSplitGroupFormColumns([
        {title: '资料信息', columns: [
            "material_name",
            "material_type",
            "material_url",
          ], order: 1}
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
    <CrudAddModal
      title={"新增课程资料"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        course_id: selectedCourseItem.id,
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "hrCourseMaterial/addHrCourseMaterial",
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
}))(HrCourseMaterialAdd);
