import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import ExpenditureInfoWbsNameModal from './ExpenditureInfoWbsNameModal';
import { connect, Dispatch } from 'umi';
import { ErrorCode } from '@/common/const';
import InfoCard from './InfoCard';

export interface SelectedExpenditureContract {
  RowNumber: number;
  branch_comp_code: string;
  branch_comp_name: string;
  contract_end_date: string;
  contract_end_date_str: string;
  contract_income_id: string;
  contract_name: string;
  contract_no: string;
  contract_out_name: string;
  contract_say_price: number;
  contract_scope: string;
  contract_sign_date: string;
  contract_sign_date_str: string;
  contract_start_date: string;
  contract_start_date_str: string;
  contract_type: string;
  contract_type_str: string;
  contract_un_say_price: number;
  dep_code: string;
  dep_name: string;
  file_url: null | string;
  form_make_time: number;
  form_make_time_str: string;
  form_make_tz: string;
  form_maker_code: string;
  form_maker_name: string;
  id: number;
  income_info_wbs_code: string;
  income_info_wbs_name: string;
  materials_type: string;
  materials_type_str: string;
  obs_code: string;
  obs_name: string;
  pur_way: string;
  pur_way_str: string;
  remark: null | string;
  subletting_enroll_code: null | string;
  subletting_enroll_name: null | string;
  tz: string;
  user_code: string;
  user_name: string;
  wbs_code: string;
  wbs_name: string;
  y_signatory_name: string;
  y_signatory_user: string;
  y_site_name: string;
  y_site_user: string;
  [key: string]: any;
}

interface AddExpenditureContractProps {
  record?: SelectedExpenditureContract | null;//选择的数据
  onChange?: (record: SelectedExpenditureContract | null) => void;//选择数据回调
  onClear?: () => void;//去除当前卡片数据
  width?: number | string;//宽度
  progressType?: string//进度款接口
  visaType?: string // 签证接口
  dispatch: Dispatch
  selectedRows?: {
    form_no: string;
    out_info_id: string;
  }//选中的数据
  isReadonly?: boolean//是否只读
  showEmptyState?: boolean//是否显示空状态（当数据为空时），默认 false
  filter?: any[]//过滤条件
  isNeedFilter?: boolean
  id?: string//合同ID 用于编辑时查询合同信息
}

/**
 * 支出合同选择组件
 * 包含选择按钮、信息卡片展示和选择模态框
 */
const AddExpenditureContract: React.FC<AddExpenditureContractProps> = (props) => {
  const {
    record,
    onChange,
    onClear,
    width = 160,
    progressType,
    visaType,
    dispatch,
    selectedRows = {
      form_no: '',
      out_info_id: ''
    },
    isReadonly = false,
    showEmptyState = false,
    filter = [],
    // 是否需要给分包合同台账传递这个参数 queryAlternativeInfo过滤
    isNeedFilter = false,
    id = '',
  } = props;

  const [expenditureInfoWbsNameOpen, setExpenditureInfoWbsNameOpen] = useState(false);//模态框打开状态
  const [progressData, setProgressData] = useState([])//存储进度款数据
  const [visaData, setVisaData] = useState([])//存储签证数据
  const [currentRecord, setCurrentRecord] = useState<SelectedExpenditureContract | null>(null)//存储当前选中的合同信息数据

  useEffect(() => {
    if (progressType && selectedRows.out_info_id) {
      const filterConditions: any[] = [
        { Key: 'out_info_id', Val: selectedRows.out_info_id, Operator: '=' }
      ];
      if (selectedRows.form_no) {
        filterConditions.push({ Key: 'form_no', Val: selectedRows.form_no, Operator: '=' });
      }

      dispatch({
        type: progressType,
        payload: {
          sort: 'form_no',
          'order': 'desc',
          filter: JSON.stringify(filterConditions)
        },
        callback: (res: any) => {
          if (res.rows && res.errCode === ErrorCode.ErrOk) {
            console.log(res.rows,'res.rows');

            setProgressData(res.rows)
          }
        },
      });
    }
    if (visaType && selectedRows.out_info_id) {
      const filterConditions: any[] = [
        { Key: 'out_info_id', Val: selectedRows.out_info_id, Operator: '=' }
      ];
      if (selectedRows.form_no) {
        filterConditions.push({ Key: 'form_no', Val: selectedRows.form_no, Operator: '=' });
      }

      dispatch({
        type: visaType,
        payload: {
          sort: 'form_no',
          'order': 'desc',
          filter: JSON.stringify(filterConditions)
        },
        callback: (res: any) => {
          if (res.rows && res.errCode === ErrorCode.ErrOk) {
            setVisaData(res.rows)
          }
        },
      });
    }
    if (isReadonly && selectedRows.out_info_id) {
      dispatch({
        type: "expenditure/queryContract",
        payload: {
          filter: JSON.stringify([
            { Key: 'id', Val: selectedRows.out_info_id, Operator: '=' }
          ]),
          order: 'desc',
          sort: 'id',
        },
        callback: (res: { errCode: number; rows: any }) => {
          if (res.errCode === ErrorCode.ErrOk) {
            const flatData = res.rows;
            if (flatData.length > 0) {
              setCurrentRecord(flatData[0])
            } else {
              setCurrentRecord(null)
            }
          } else {
            setCurrentRecord(null)
          }
        },
      });
    }
  }, [progressType, isReadonly, visaType, selectedRows])

  useEffect(() => {
    if (id) {
      dispatch({
        type: "expenditure/queryContract",
        payload: {
          filter: JSON.stringify([
            { Key: 'id', Val: id, Operator: '=' }
          ]),
          order: 'desc',
          sort: 'id',
        },
        callback: (res: { errCode: number; rows: any }) => {
          if (res.errCode === ErrorCode.ErrOk) {
            const flatData = res.rows;
            if (flatData.length > 0) {
              setCurrentRecord(flatData[0])
            } else {
              setCurrentRecord(null)
            }
          } else {
            setCurrentRecord(null)
          }
        },
      });
    }
  }, [])



  /**
   * 选择数据
   * @param data 选择的数据
   */
  const handleSelect = (data: any) => {
    setExpenditureInfoWbsNameOpen(false);
    setCurrentRecord(data);
    if (data && onChange) {
      onChange(data);
    }
  };

  /**
   * 打开模态框
   */
  const handleOpenModal = () => {
    setExpenditureInfoWbsNameOpen(true);
  };

  // 获取要显示的合同记录
  const displayRecord = record || currentRecord;

  return (
    <>
      {displayRecord ? (
        <InfoCard
          record={displayRecord}
          isReadonly={isReadonly}
          onClear={() => {
            setCurrentRecord(null);
            if (onClear) {
              onClear();
            }
          }}
          progressData={progressData}
          visaData={visaData}
          showEmptyState={showEmptyState}
        />
      ) : (
        <Button
          type="dashed"
          style={{
            width: width
          }}
          onClick={handleOpenModal}
          disabled={isReadonly}
        >
          请选择分包合同
        </Button>
      )}
      {expenditureInfoWbsNameOpen && (
        <ExpenditureInfoWbsNameModal
          visible={expenditureInfoWbsNameOpen}
          onCancel={() => setExpenditureInfoWbsNameOpen(false)}
          onSelect={handleSelect}
          filter={filter}
          isNeedFilter={isNeedFilter}
        />
      )}
    </>
  );
};

export default connect()(AddExpenditureContract);
