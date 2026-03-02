import React, { useEffect } from "react";
import { columns } from "../columns";
import { BasicFormColumns, SingleTable, BasicTableColumns } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import {Descriptions, Form, InputNumber, message } from "antd";
import {scoreCheckValid} from "@/utils/utils-validate";
import {querySupplierContractScoreBody} from "@/services/engineering/supplierContractScore";


const { CrudAddModal } = SingleTable;

const ShowContractInfo = (props: any) => {
  const { selectedRecord } = props;
  const { formatMessage } = useIntl();

  const getTableColumns = () => {
    const cols = new BasicTableColumns(columns);
    cols.initTableColumns([
      // "id",
      // "year",
      "contract_no",
      "procurement_content",
      // "wbs_code",
      "buyer",
      "supplier_name",
      "supplier_code",
      "supplier_type",
      "contract_amount",
    ])

    return cols.getNeedColumns();
  }

  return (
    <div style={{ marginLeft: -24 }}>
      <Descriptions>
        {getTableColumns().map((col, index) => (
          <Descriptions.Item key={col.dataIndex} label={formatMessage({ id: col.title })}>
            {selectedRecord[col.dataIndex] || ''}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </div>
  )
}

const TotalInputNumber = (props: any) => {
  const { form } = props;
  const productQuality = Form.useWatch('product_quality', form);
  const serviceAbility = Form.useWatch('service_ability', form);
  const contractPerformance = Form.useWatch('contract_performance', form);
  const priceLevel = Form.useWatch('price_level', form);
  const technologicalLevel = Form.useWatch('technological_level', form);
  const integrityManagement = Form.useWatch('integrity_management', form);

  const [showValue, setShowValue] = React.useState(0);

  useEffect(() => {
    const _val = productQuality + serviceAbility + contractPerformance + priceLevel + technologicalLevel + integrityManagement;
    setShowValue(_val);
    form.setFieldsValue({
      total_score: _val,
    })
  }, [productQuality, serviceAbility, contractPerformance, priceLevel, technologicalLevel, integrityManagement]);

  return (
    <InputNumber style={{width: '100%'}} disabled value={showValue} />
  )
}

/**
 * 评分弹窗
 * @param props
 * @constructor
 */
const RatingScoreModal: React.FC<any> = (props) => {
  const { dispatch, visible, selectedRecord, selectedNodeInfo, onCancel, callbackSuccess } = props;
  const { formatMessage } = useIntl();
  // const wbsCode = localStorage.getItem('auth-default-wbsCode');
  const [initScoreFields, setInitScoreFields] = React.useState({});

  const fetchScore = async () => {
    const res = await querySupplierContractScoreBody({
      sort: 'id',
      order: 'desc',
      filter: JSON.stringify([
        {Key: 'id', Val: selectedRecord.id, Operator: '='}
      ]),
    })
    console.log('fetchScore-----res', res)
    setInitScoreFields(res.rows[0] || {})
  }

  useEffect(() => {
    if (selectedRecord.id) {
      fetchScore();
    }
  }, []);

  const getFormColumns = () => {
    const cols = new BasicFormColumns(columns)
      .initFormColumns([
        'id',
        'year',
        {
          title: "compinfo.contract_id",
          subTitle: "供应商合同id",
          dataIndex: "contract_id",
          width: 160,
          align: "center",
          renderSelfForm: () => {
            return (
              <ShowContractInfo selectedRecord={selectedRecord}/>
            )
          }
        },
        'product_quality',
        'service_ability',
        'contract_performance',
        'price_level',
        'technological_level',
        'integrity_management',
        {
          title: "compinfo.total_score",
          subTitle: "总成绩85分",
          dataIndex: "total_score",
          width: 160,
          align: "center",
          renderSelfForm: form => {
            return (
              <TotalInputNumber form={form} />
            )
          }
        },
        'delivery_amount',
      ])
      .setSplitGroupFormColumns([
        {title: '打分内容', columns: [
            'product_quality',
            'service_ability',
            'contract_performance',
            'price_level',
            'technological_level',
            'integrity_management',
            'total_score',
            'delivery_amount',
          ]}
      ])
      .setFormColumnToInputNumber([
        {value: 'product_quality', valueType: 'digit', min: 0, max: 20},
        {value: 'service_ability', valueType: 'digit', min: 0, max: 15},
        {value: 'contract_performance', valueType: 'digit', min: 0, max: 15},
        {value: 'price_level', valueType: 'digit', min: 0, max: 15},
        {value: 'technological_level', valueType: 'digit', min: 0, max: 10},
        {value: 'integrity_management', valueType: 'digit', min: 0, max: 10},
        {value: 'delivery_amount', valueType: 'digit', min: 0},
      ])
      .setFormColumnToSelfColSpan([
        {value: 'contract_id', colSpan: 24, labelCol: { span: 3 }, showLabel: false},
      ])
      .needToDisabled([
        'total_score',
        'year',
      ])
      .needToHide([
        'id',
      ])
      .needToRules([
        {
          value: 'product_quality',
          rules: [{ required: true, validator: scoreCheckValid.validateProductQualityScore }]
        },
        {
          value: 'service_ability',
          rules: [{ required: true, validator: scoreCheckValid.validateSeviceAbilityScore }]
        },
        {
          value: 'contract_performance',
          rules: [{ required: true, validator: scoreCheckValid.validateContractScore }]
        },
        {
          value: 'price_level',
          rules: [{ required: true, validator: scoreCheckValid.validatePriceLevelScore }]
        },
        {
          value: 'technological_level',
          rules: [{ required: true, validator: scoreCheckValid.validateTechnologicalLevelScore }]
        },
        {
          value: 'integrity_management',
          rules: [{ required: true, validator: scoreCheckValid.validateIntegrityManagementScore }]
        },
        'total_score',
        'delivery_amount',
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudAddModal
      title={"评分"}
      key={JSON.stringify(initScoreFields)}
      visible={visible}
      onCancel={onCancel}
      initialValue={selectedRecord.id ? initScoreFields :{
        contract_id: selectedRecord.contract_id,
        'id': selectedRecord.id,
        'year': selectedNodeInfo.year,
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "supplierContractScore/addSupplierContractScoreBody",
            payload: values,
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("已打分");
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

export default connect()(RatingScoreModal);
