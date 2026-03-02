import React from 'react';
import { configColumns } from '../columns';
import { BasicFormColumns, SingleTable } from 'yayang-ui';
import { useIntl } from 'umi';
import { connect } from 'umi';
import { ErrorCode, HUA_WEI_OBS_CONFIG } from '@/common/const';
import { message, Form } from 'antd';
import type { ConnectState } from '@/models/connect';
import type { Dispatch, ISteelMemberCategoryStateType } from 'umi';
import AddExpenditureContract from '@/components/AddExpenditureContract';
import HuaWeiOBSUploadSingleFile from '@/components/HuaWeiOBSUploadSingleFile';
import { analysisSubSettlementManagementOcr } from '@/services/costControl/settlement/subcontractorSettlement';

const { CrudAddModal } = SingleTable;

interface OCRUploadProps {
  dispatch: Dispatch,
  visible: boolean,
  onCancel: () => void,
  callbackAddSuccess: () => void,
  steelmembercategoryTypeList: ISteelMemberCategoryStateType[]
}

const OCRUpload: React.FC<OCRUploadProps> = (props) => {
  const {
    dispatch,
    visible,
    onCancel,
    callbackAddSuccess
  } = props;


  const { formatMessage } = useIntl();
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        {
          title: '上传图片',
          subTitle: "上传图片",
          dataIndex: "attachment_url",
          width: 160,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <HuaWeiOBSUploadSingleFile
                sysPath={HUA_WEI_OBS_CONFIG.SYS_PATH.SAFE}
                limitSize={100}
                folderPath="/CostControl/Settlement/SubcontractorSettlement"
                accept=".jpg,.jpeg,.png,.gif,.bmp,.webp"
                onChange={async (file: any) => {
                  const fileObj = file?.originFileObj || file?.file;
                  if (!fileObj) {
                    return;
                  }
                  form.setFieldsValue({
                    attachment_url: '',
                  });
                  message.loading({ content: '正在识别图片...', key: 'ocr' });
                  const response = await analysisSubSettlementManagementOcr(fileObj);

                  if (response?.errCode === ErrorCode.ErrOk && response?.result) {
                    message.success({ content: '识别成功', key: 'ocr' });
                    form.setFieldsValue({
                      out_info_id: response.result.contractId,
                      report_amount1: response.result.subcontractorAmount,
                      approval_amount1: response.result.initialReviewAmount,
                      approval_amount2: response.result.finalReviewAmount,
                      approval_date1: response.result.projectManagerTime,
                      approval_date2: response.result.companyPreSettleControlCenterTime,
                    });
                    console.log(response.result, 'response.result');

                  }
                }}
              />
            )
          }
        },
        'contract_say_price',
        {
          title: 'compinfo.subcontractName',
          subTitle: "分包合同信息",
          dataIndex: "out_info_id",
          width: 300,
          align: 'center',
          renderSelfForm: (form: any) => {
            return (
              <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.out_info_id !== currentValues.out_info_id}>
                {() => {
                  const outInfoId = form.getFieldValue('out_info_id');
                  return (
                    <AddExpenditureContract
                      record={null}
                      dispatch={dispatch}
                      selectedRows={{
                        out_info_id: outInfoId || '',
                      }}
                      isReadonly={true}
                      progressType={'subcontractorProgress/querySubProgressPaymentBody'}
                      visaType={'visaSub/querySubEngineeringVisa'}
                      showEmptyState={true}
                    />
                  );
                }}
              </Form.Item>
            )
          }
        },
        {
          title: '上报金额',
          subTitle: "上报金额",
          dataIndex: "report_amount1",
          width: 300,
          align: 'center',
        },
        {
          title: '上报时间',
          subTitle: "上报时间",
          dataIndex: "report_date1",
          width: 300,
          align: 'center',
        },
        {
          title: '初审金额',
          subTitle: "初审金额",
          dataIndex: "approval_amount1",
          width: 300,
          align: 'center',
        },
        {
          title: '初审完成日期',
          subTitle: "初审完成日期",
          dataIndex: "approval_date1",
          width: 300,
          align: 'center',
        },
        {
          title: '复审金额',
          subTitle: "复审金额",
          dataIndex: "approval_amount2",
          width: 300,
          align: 'center',
        },
        {
          title: '复审完成日期',
          subTitle: "复审完成日期",
          dataIndex: "approval_date2",
          width: 300,
          align: 'center',
        },
        {
          title: '审计金额',
          subTitle: "审计金额",
          dataIndex: "approval_amount3",
          width: 300,
          align: 'center',
        },
        {
          title: '审计完成日期',
          subTitle: "审计完成日期",
          dataIndex: "approval_date3",
          width: 300,
          align: 'center',
        },
      ])
      .setFormColumnToInputNumber([
        {
          min: 0,
          value: 'approval_amount1',
          valueType: "digit",
        },
        {
          min: 0,
          value: 'approval_amount2',
          valueType: "digit",
        },
        {
          min: 0,
          value: 'approval_amount3',
          valueType: "digit",
        },
        {
          min: 0,
          value: 'report_amount1',
          valueType: "digit",
        }
      ])
      .setFormColumnToDatePicker([
        { value: 'approval_date1', valueType: 'dateTs', needValueType: 'timestamp' },
        { value: 'approval_date2', valueType: 'dateTs', needValueType: 'timestamp' },
        { value: 'approval_date3', valueType: 'dateTs', needValueType: 'timestamp' },
        { value: 'report_date1', valueType: 'dateTs', needValueType: 'timestamp' },
      ])
      .setFormColumnToSelfColSpan([
        {
          colSpan: 24,
          value: 'out_info_id',
          labelCol: {
            span: 24
          },
          wrapperCol: {
            span: 24
          }
        }
      ])
      .needToHide([
        'contract_say_price'
      ])
      .needToRules([
        'out_info_id',
        'report_amount1',
        'approval_amount1',
        'approval_amount2',
        'approval_date1',
        'approval_date2',
        'approval_amount3',
        'approval_date3',
        'report_date1',
      ])
      .setSplitGroupFormColumns([
        {
          title: '附件信息',
          columns: ['attachment_url'],
        },
        {
          title: '合同信息',
          columns: ['out_info_id', 'contract_say_price'],
        },
      ])
      .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  };

  return (
    <CrudAddModal
      title={'OCR上传'}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        approval_amount1: 0,
        approval_amount2: 0,
        report_amount1: 0
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          const { report_amount1, approval_amount1, approval_amount2 } = values;

          // 判断：分包商上报金额 > 项目部审核金额 > 预结算费控中心审核金额
          if (report_amount1 < approval_amount1) {
            message.warning('分包商上报金额必须大于项目部审核金额');
            resolve(true);
            return;
          }

          if (approval_amount1 < approval_amount2) {
            message.warning('项目部审核金额必须大于预结算费控中心审核金额');
            resolve(true);
            return;
          }

          dispatch({
            type: 'subcontractorSettlement/addSubSettlementManagementOcr',
            payload: {
              ...values,
              report_amount2: values.approval_amount1,
              report_amount3: values.approval_amount2,
              number: 7,
              approval_schedule1: 1,
              approval_schedule2: 1,
              approval_schedule3: 1
            },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success('新增成功');
                setTimeout(() => {
                  callbackAddSuccess();
                }, 1000);
              }
            },
          });
        });
      }}
    />
  );
};

export default connect(({ steelmembercategory }: ConnectState) => ({
  steelmembercategoryTypeList: steelmembercategory.steelmembercategoryTypeList,
}))(OCRUpload);
