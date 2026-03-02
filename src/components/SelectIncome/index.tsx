import React, { useState } from 'react';
import { connect } from 'umi';
import { Button, Form } from 'antd';
import IncomeInfoWbsNameModal from './IncomeInfoWbsNameModal';
import InfoCard from './InfoCard';

interface Expenditure {
  initRecord: any,
  onChange: (data: any) => void
}

const ExpenditureAdd: React.FC<Expenditure> = (props) => {
  const { initRecord, onChange } = props;
  const [form] = Form.useForm()
  const [incomeInfoWbsNameOpen, setIncomeInfoWbsNameOpen] = useState(false)
  const [record, setRecord] = useState(initRecord)

  return (
    <>
      {
        record ? (
          <InfoCard
            record={record}
            setIncomeInfoWbsNameOpen={() => {
              onChange(record)
              setIncomeInfoWbsNameOpen(true)
            }
            }
          />
        ) : (
          <Button
            type="dashed"
            style={{
              width: 160
            }}
            onClick={() => {
              setIncomeInfoWbsNameOpen(true)
            }}
          >
            {record?.wbs_code ? record?.wbs_code : "请选择WBS项目定义"}
          </Button>
        )
      }
      {incomeInfoWbsNameOpen && <IncomeInfoWbsNameModal
        visible={incomeInfoWbsNameOpen}
        onCancel={() => setIncomeInfoWbsNameOpen(false)}
        onSelect={(data: any) => {
          console.log('data :>> ', data);
          setIncomeInfoWbsNameOpen(false)
          if (data) {
            setRecord(data)
            form.setFieldsValue({
              income_info_wbs_name: data.wbs_code,
              contract_name: data.contract_name,
            })
          }
        }}
      />}
    </>
  );
};

export default connect()(ExpenditureAdd);
