import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message } from "antd";
import ClassTypeList from "@/pages/HR/Common/ClassTypeList";


const { CrudAddModal } = SingleTable;

/**
 * 新增考卷管理
 * @param props
 * @constructor
 */
const ExamPaperAdd: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess } = props;
  const { formatMessage } = useIntl();
  const wbsCode = localStorage.getItem('auth-default-wbsCode') || '';
  const propKey = localStorage.getItem("auth-default-wbs-prop-key") || "";

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
        'wbs_code',
        'prop_key',
        // 'subComp',
        // 'dep',
        'paper_name',
        {
          title: "compinfo.class_type",
          subTitle: "课程分类",
          dataIndex: "class_type",
          width: 160,
          align: "center",
          renderSelfForm: form => {

            const onChange = (node) => {
              form.setFieldsValue({
                class_type: node.id,
                'module_code': node.parentNode.expand_id,
                'grade': node.expand_id,
              })
            }

            return (
              <ClassTypeList onChange={onChange}/>
            )
          }
        },
        'module_code',
        'grade',
        'start_time',
        'end_time',
        'publish_status',
        'is_allow_apply',
        'total_score',
        'pass_score',
        'single_count',
        'single_score',
        'judge_count',
        'judge_score',
        'other_count',
        'other_score',
        // 'create_ts',
        // 'create_tz',
        // 'create_user_code',
        // 'create_user_name',
        // 'modify_ts',
        // 'modify_tz',
        // 'modify_user_code',
        // 'modify_user_name',
      ])
      .setFormColumnToDatePicker([
        {value: 'start_time', valueType: 'dateTs', needValueType: 'timestamp'},
        {value: 'end_time', valueType: 'dateTs', needValueType: 'timestamp'},
      ])
      .setFormColumnToSelect([
        {value: 'is_allow_apply', name: 'is_allow_apply_str', valueType: 'radio', data: [
            {is_allow_apply: '0', is_allow_apply_str: '不允许'},
            {is_allow_apply: '1', is_allow_apply_str: '允许'},
          ]},
      ])
      .setFormColumnToInputNumber([
        {value: 'total_score', valueType: 'digit', min: 0},
        {value: 'pass_score', valueType: 'digit', min: 0},
        {value: 'single_count', valueType: 'digit', min: 0},
        {value: 'single_score', valueType: 'digit', min: 0},
        {value: 'judge_count', valueType: 'digit', min: 0},
        {value: 'judge_score', valueType: 'digit', min: 0},
        {value: 'other_count', valueType: 'digit', min: 0},
        {value: 'other_score', valueType: 'digit', min: 0},
      ])
      .setSplitGroupFormColumns([
        {
          title: '单选题配置',
          columns: [
            'single_count',
            'single_score',
          ],
          order: 1
        },
        {
          title: '判断题配置',
          columns: [
            'judge_count',
            'judge_score',
          ],
          order: 1
        },
        {
          title: '简答题配置',
          columns: [
            'other_count',
            'other_score',
          ],
          order: 1
        }
      ])
      .needToHide([
        'wbs_code',
        'prop_key',
        'module_code',
        'grade',
        'publish_status',
      ])
      .needToRules([
        'wbs_code',
        'prop_key',
        // 'subComp',
        // 'dep',
        'paper_name',
        'module_code',
        'grade',
        'start_time',
        'end_time',
        'publish_status',
        'is_allow_apply',
        'total_score',
        'pass_score',
        'single_count',
        'single_score',
        'judge_count',
        'judge_score',
        'other_count',
        'other_score',
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={"新增考卷管理"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        wbs_code: wbsCode,
        prop_key: propKey,
        'publish_status': '0'
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "examPaper/addExamPaper",
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

export default connect()(ExamPaperAdd);
