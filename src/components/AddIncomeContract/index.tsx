import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import IncomeInfoWbsNameModal from './IncomeInfoWbsNameModal';
import { connect, Dispatch } from 'umi';
import { ErrorCode } from '@/common/const';
import InfoCard from './InfoCard';


export interface SelectedIncomeContract {
  id: number;
  branch_comp_code: string;
  dep_code: string;
  user_code: string;
  owner_name: string;
  owner_group: string;
  owner_unit_name: string;
  project_location: string;
  contract_no: string;
  wbs_code: string;
  contract_name: string;
  scope_fo_work: string;
  contract_mode: string;
  bidding_mode: string;
  valuation_mode: string;
  contract_commencement_date: string;
  contract_completion_date: string;
  contract_say_price: number;
  contract_un_say_price: number;
  contract_sign_date: string;
  project_level: string;
  project_category: string;
  revenue_method: string;
  file_url: string;
  remark: string;
  form_maker_code: string;
  form_maker_name: string;
  form_make_time: number;
  form_make_tz: string;
  owner_group_str: string;
  contract_mode_str: string;
  bidding_mode_str: string;
  valuation_mode_name: string;
  project_level_str: string;
  project_category_str: string;
  revenue_method_str: string;
  user_name: string;
  wbs_name: string;
  dep_name: string;
  branch_comp_name: string;
  contract_commencement_date_str: string;
  contract_completion_date_str: string;
  contract_sign_date_str: string;
  form_make_time_str: string;
  contract_start_date_str?: string;
  contract_end_date_str?: string;
  RowNumber: number;
  [key: string]: any;
}

interface AddIncomeContractProps {
  record: SelectedIncomeContract | null;//选择的数据
  onChange?: (record: SelectedIncomeContract | null) => void;//选择数据回调
  onClear?: () => void;//去除当前卡片数据
  width?: number | string;//宽度
  progressType?: string//进度款接口
  visaType?: string // 签证接口
  dispatch: Dispatch
  selectedRows?: {
    contract_income_id: string;
    form_no: string;
    prepay_approval_amount?: string;
    prepay_is_arrival_str?: string;
    prepay_ratio?: string;
    prepay_file_url?: string;
  }//选中的数据
  isReadonly?: boolean//是否只读
  showEmptyState?: boolean//是否显示空状态（当数据为空时），默认 false
  filter?: any//过滤条件
  id?: string//合同ID 用于编辑时查询合同信息
}

/**
 * 收入合同选择组件
 * 包含选择按钮、信息卡片展示和选择模态框
 */
const AddIncomeContract: React.FC<AddIncomeContractProps> = (props) => {
  const {
    record,
    onChange,
    onClear,
    width = 160,
    progressType,
    visaType,
    dispatch,
    selectedRows = {
      contract_income_id: '',
      form_no: ''
    },
    isReadonly = false,
    showEmptyState = false,
    filter = [],
    id
  } = props;

  const [incomeInfoWbsNameOpen, setIncomeInfoWbsNameOpen] = useState(false);//模态框打开状态
  const [progressData, setProgressData] = useState([])//存储进度款数据
  const [visaData, setVisaData] = useState([])//存储签证数据
  const [currentRecord, setCurrentRecord] = useState<SelectedIncomeContract | null>(null)//存储当前选中的合同信息数据


  useEffect(() => {
    console.log(selectedRows, progressType, visaType, 'progressType');

    if (progressType && selectedRows.contract_income_id) {
      const filterConditions: any[] = [
        { Key: 'contract_income_id', Val: selectedRows.contract_income_id, Operator: '=' },
        { Key: 'dep_code', Val: localStorage.getItem('auth-default-wbsCode'), Operator: '=' }
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
            setProgressData(res.rows)
          }
        },
      });
    }
    if (visaType && selectedRows.contract_income_id) {
      const filterConditions: any[] = [
        { Key: 'contract_income_id', Val: selectedRows.contract_income_id, Operator: '=' },
        { Key: 'income_info_wbs_code', Val: localStorage.getItem('auth-default-wbsCode'), Operator: '=' },
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
    if (isReadonly && selectedRows.contract_income_id) {
      dispatch({
        type: "income/getIncomeInfo",
        payload: {
          filter: JSON.stringify([
            { Key: 'id', Val: selectedRows.contract_income_id, Operator: '=' }
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
        type: "income/getIncomeInfo",
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
    setIncomeInfoWbsNameOpen(false);
    setCurrentRecord(data);
    if (data && onChange) {
      onChange(data);
    }
  };

  /**
   * 打开模态框
   */
  const handleOpenModal = () => {
    setIncomeInfoWbsNameOpen(true);
  };
console.log(record);

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
          selectedRows={selectedRows}
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
          请选择收入合同
        </Button>
      )}
      {incomeInfoWbsNameOpen && (
        <IncomeInfoWbsNameModal
          visible={incomeInfoWbsNameOpen}
          onCancel={() => setIncomeInfoWbsNameOpen(false)}
          onSelect={handleSelect}
          filter={filter}
        />
      )}
    </>
  );
};

export default connect()(AddIncomeContract);
