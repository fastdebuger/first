import {Alert, Button, Descriptions, Empty, Form, Input, message, Modal, Spin } from 'antd';
import React, { useEffect } from 'react';
import {queryWbsDefineCompare} from "@/services/finance/wbsDefineCompare";
import {queryBusinessPartner} from "@/services/finance/businessPartner";


const ModalContent = (props) => {
  const { relativePersonCode, callback } = props;
  const [loading, setLoading] = React.useState(false);
  const [showResult, setShowResult] = React.useState<any | null>(null);

  const fetchList = async () => {
    setLoading(true);
    const res = await queryBusinessPartner({
      sort: 'id',
      order: 'asc',
      filter: JSON.stringify([
        {Key: 'business_partner_code', Val: relativePersonCode, Operator: '='}
      ]),
    })
    setLoading(false);
    if(res.rows.length > 0) {
      setShowResult(res.rows[0])
    }
  }

  useEffect(() => {
    fetchList()
  }, []);

  /**
   * 判断字符串是否包含 'L4' 但不包含 'L49'
   */
  const isShowButton = () => {
    const tradePartner = showResult.trade_partner;
    // 核心判断逻辑
    return tradePartner.includes('L4') && !tradePartner.includes('L49');
  }

  return (
    <div style={{marginTop: 8}}>
      {loading ? (
        <Spin spinning={loading} tip={'正在从 《往来单位》表获取 贸易伙伴字段 L4开头 排除L49'}></Spin>
      ) : (
        <span>
          {showResult ? (
            <span>
              <Descriptions title="查询到1条数据">
                <Descriptions.Item span={3} label="合同相对人编码">{relativePersonCode}</Descriptions.Item>
                <Descriptions.Item span={3} label="贸易伙伴">{showResult.trade_partner}</Descriptions.Item>
                <Descriptions.Item span={3} label="公司名称">{showResult.company_name}</Descriptions.Item>
              </Descriptions>
              {isShowButton() ? (
                <Button type={'primary'} onClick={() => {
                  if (callback) callback(showResult.company_name)
                }}>采用此条数据</Button>
              ) : (
                <span style={{color: 'orange'}}>
                  此数据不符合规则，不包含L4。则公司内部项目甲方名称 可填空
                </span>
              )}
            </span>
          ) : (
            <Empty description={'《往来单位》表没有对应的数据，需要维护'}/>
          )}
        </span>
      )}
    </div>
  )
}

const InCompanyJiaName = (props) => {
  const { value, onChange, form } = props;

  const relativePersonCode = Form.useWatch('relative_person_code', form);

  const [inputValue, setInputValue] = React.useState('');
  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    setInputValue(value || '');
  }, []);

  const onSearch = () => {
    if (!relativePersonCode) {
      message.warning('合同相对人编码为空，请去合同模块确实是否填报');
      return;
    }
    setVisible(true);
  };

  return (
    <>
      <Input.Search
        placeholder="点击右侧获取"
        allowClear
        readOnly
        value={inputValue}
        onChange={(e) => {
          const _value = e.target.value;
          setInputValue(_value);
          onChange(_value)
        }}
        enterButton="点击获取"
        size="middle"
        onSearch={onSearch}
      />
      {visible && (
        <Modal
          title={'获取公司内部项目甲方名称数据'}
          visible={visible}
          open={visible}
          onCancel={() => setVisible(false)}
          footer={null}
        >
          <Alert type={'info'} message={'关联《往来单位》里的 贸易伙伴字段 L4开头 排除L49'}/>
          <ModalContent relativePersonCode={relativePersonCode} callback={(_val) => {
            setInputValue(_val);
            onChange(_val)
            setVisible(false);
          }}/>
        </Modal>
      )}
    </>
  )
}

export default InCompanyJiaName;
