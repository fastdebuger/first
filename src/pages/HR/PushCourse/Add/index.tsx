import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import PushCourseList from "../Common/PushCourseList";
import PushRangeList from "@/pages/HR/PushCourse/Common/PushRangeList";
import moment from "moment";


const { CrudAddModal } = SingleTable;

/**
 * 新增推送课程
 * @param props
 * @constructor
 */
const PushCourseAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
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
        // 'id',
        'year',
        {
          title: "compinfo.course_id",
          subTitle: "课程id",
          dataIndex: "course_id",
          width: 160,
          align: "center",
          renderSelfForm: form => {
            const onChange = (id, item) => {
              form.setFieldsValue({
                course_id: id,
                course_name: item.course_name,
              })
            }
            return (
              <PushCourseList onChange={onChange}/>
            )
          }
        },
        'course_name',
        'study_duration_hour',
        // 1-全体，2-部门，3-工种，4-角色，5-个人
        {
          title: "compinfo.push_range_type",
          subTitle: "推送范围类型",
          dataIndex: "push_range_type",
          width: 160,
          align: "center",
          renderSelfForm: form => {
            const onChange = (values: any) => {
              form.setFieldsValue(values)
            }
            return (
              <PushRangeList onChange={onChange}/>
            )
          }
        },
        'push_range_value',
        "push_range_name",
        // 'is_push',
        // 'pusher_code',
        // 'pusher_name',
        // 'push_time',
      ])
      .setSplitGroupFormColumns([
        {title: '推送配置', columns: [
            'push_range_type',
            'push_range_value',
          ], order: 2}
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
        },
        {
          colSpan: 24,
          value: 'push_range_type',
          labelCol: {
            span: 24
          },
          wrapperCol: {
            span: 24
          }
        }
      ])
      .setFormColumnToInputNumber([
        {value: 'study_duration_hour', valueType: 'digit', min: 0}
      ])
      .setFormColumnToDatePicker([
        {value: 'year', valueType: 'dateTs', needValueType: 'date', picker: 'year'},
      ])
      .needToHide([
        'course_name',
        'push_range_value',
        'push_range_name'
      ])
      .needToDisabled([
        'year'
      ])
      .needToRules([
        "course_name",
        "course_id",
        "study_duration_hour",
        "push_range_type",
        "push_range_value",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={"新增推送课程"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        year: moment().format("YYYY"),
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        console.log(values);
        Object.assign(values, {
          study_duration: Number(values.study_duration_hour) * 60 * 60,
        })
        return new Promise((resolve) => {
          dispatch({
            type: "pushCourse/addPushCourse",
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

export default connect()(PushCourseAdd);
