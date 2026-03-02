import React, { useEffect, useState } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message, Form, Tooltip, Alert } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import AddIncomeContract from "@/components/AddIncomeContract";
import type { SelectedIncomeContract } from "@/components/AddIncomeContract";
import ProfitCenterList from "@/components/CommonList/ProfitCenterList";

const { CrudEditModal } = SingleTable;

/**
 * 编辑债权填报表
 * @param props
 * @constructor
 */
const DebtStatisticsEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord, selectedQuarter } = props;
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();

  // 监听四个字段的变化，自动计算 received_subtotal（累计收款情况累计收款情况小计）
  const receivedCash = Form.useWatch('received_cash', form);
  const receivedBill = Form.useWatch('received_bill', form);
  const receivedMaterial = Form.useWatch('received_material', form);
  const receivedOther = Form.useWatch('received_other', form);

  // 监听两个字段的变化，自动计算 book_receivable_balance（账面应收款项余额）
  const progressSettlementTotal = Form.useWatch('progress_settlement_total', form);
  const receivedSubtotal = Form.useWatch('received_subtotal', form);

  // 监听字段变化，自动计算 net_receivable_amount（应收款项净额）和 net_receivable_bad_debt（已计提坏账及难以回收部分）
  const bookReceivableBalance = Form.useWatch('book_receivable_balance', form);
  const advanceReceiptBalance = Form.useWatch('advance_receipt_balance', form);
  const netReceivableRecoverInYear = Form.useWatch('net_receivable_recover_in_year', form);
  const netReceivableRecoverAfterYear = Form.useWatch('net_receivable_recover_after_year', form);
  const netReceivableAmount = Form.useWatch('net_receivable_amount', form);

  // 监听字段变化，自动计算 expected_receivable_amount（预计应收款项）
  const expectedSettlementAmount = Form.useWatch('expected_settlement_amount', form);
  const advanceReceiptBalanceForExpected = Form.useWatch('advance_receipt_balance', form);

  // 计算累计收款情况（不包括预收款余额）- 累计收款情况小计 = 货币资金 + 票据 + 材料款 + 其它
  useEffect(() => {
    const cash = Number(receivedCash) || 0;
    const bill = Number(receivedBill) || 0;
    const material = Number(receivedMaterial) || 0;
    const other = Number(receivedOther) || 0;
    const subtotal = cash + bill + material + other;
    form.setFieldsValue({ received_subtotal: subtotal });
  }, [receivedCash, receivedBill, receivedMaterial, receivedOther, form]);

  // 计算账面应收款项余额 =  累计办理 - 累计收款情况小计
  useEffect(() => {
    const settlementTotal = Number(progressSettlementTotal) || 0;
    const subtotal = Number(receivedSubtotal) || 0;
    const balance = settlementTotal - subtotal;
    form.setFieldsValue({ book_receivable_balance: balance });
  }, [progressSettlementTotal, receivedSubtotal, form]);

  /**
   * 计算应收款项净额 = 账面应收款项余额 - 预收款项余额
   */
  useEffect(() => {
    const bookBalance = Number(bookReceivableBalance) || 0;
    const advanceBalance = Number(advanceReceiptBalance) || 0;

    const calculatedNetReceivableAmount = bookBalance - advanceBalance;
    form.setFieldsValue({ net_receivable_amount: calculatedNetReceivableAmount });
  }, [bookReceivableBalance, advanceReceiptBalance, form]);

  /**
   * 计算已计提坏账及难以回收部分 = 应收款项净额 - 年内可回收 - 年后可回收
   */
  useEffect(() => {
    const netAmount = Number(netReceivableAmount) || 0;
    const recoverInYear = Number(netReceivableRecoverInYear) || 0;
    const recoverAfterYear = Number(netReceivableRecoverAfterYear) || 0;

    const badDebt = netAmount - recoverInYear - recoverAfterYear;
    form.setFieldsValue({ net_receivable_bad_debt: badDebt });
  }, [netReceivableAmount, netReceivableRecoverInYear, netReceivableRecoverAfterYear, form]);

  /**
   * 计算预计应收款项 = 预计结算值 - 累计收款情况小计 - 预收款项余额
   */
  useEffect(() => {
    const expectedSettlement = Number(expectedSettlementAmount) || 0;
    const subtotal = Number(receivedSubtotal) || 0;
    const advanceBalance = Number(advanceReceiptBalanceForExpected) || 0;

    const expectedReceivable = expectedSettlement - subtotal - advanceBalance;
    form.setFieldsValue({ expected_receivable_amount: expectedReceivable });
  }, [expectedSettlementAmount, receivedSubtotal, advanceReceiptBalanceForExpected, form]);


  /**
   * 创建带公式提示的标题
   * @param originalTitle 原始标题（国际化key）
   * @param formula 计算公式文本
   * @returns React节点
   */
  const createTitleWithFormula = (originalTitle: string, formula: string) => {
    return (
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {formatMessage({ id: originalTitle })}
        <Tooltip title={formula} placement="top">
          <QuestionCircleOutlined style={{ color: '#1890ff', cursor: 'help' }} />
        </Tooltip>
      </span>
    );
  };

  const getFormColumns = () => {
    const selectedYear = String(selectedQuarter)?.match(/^(\d{4})/)?.[1] || selectedQuarter;
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        {
          title: 'costControl.contract_income_id',
          subTitle: "收入合同信息",
          dataIndex: "contract_income_id",
          width: 300,
          align: 'center',
          renderSelfForm: (formInstance: any) => {
            return (
              <AddIncomeContract
                onChange={(data: SelectedIncomeContract) => {
                  if (data) {
                    formInstance.setFieldsValue({
                      contract_income_id: data.id,
                      wbs_code: data.wbs_code,
                      contract_name: data.contract_name,
                      relative_person_code: data.relative_person_code,
                      owner_unit_name: data.owner_unit_name,
                      contract_say_price: data.contract_say_price,
                      contract_no: data.contract_no,
                      responsible_person: data.responsible_person,
                    });
                  }
                }}
                onClear={() => {
                  formInstance.setFieldsValue({
                    contract_income_id: '',
                    wbs_code: '',
                    contract_name: '',
                    relative_person_code: '',
                    owner_unit_name: '',
                    contract_say_price: '',
                    contract_no: '',
                    responsible_person: '',
                  });
                }}
                width={300}
                filter={[{ Key: 'progress_payment_id', Val: '0', Operator: '=' }]}
                id={selectedRecord.contract_income_id}
              />
            )
          }
        },
        "wbs_code",
        "contract_name",
        "contract_no",
        "relative_person_code",
        "owner_unit_name",
        "settlement_status",
        "contract_say_price",
        "expected_settlement_amount",
        "responsible_person",
        "account_name",
        {
          title: "compinfo.profit_center_code",
          subTitle: "利润中心",
          dataIndex: "profit_center_code",
          width: 160,
          align: "center",
          renderSelfForm: formInstance => {
            const onChange = (val, fields) => {
              formInstance.setFieldsValue({
                profit_center_code: val,
                // profit_wbs_name: fields.profit_wbs_name,
                // profit_belong_wbs_name: fields.profit_belong_wbs_name,
              })
            }
            return(
              <ProfitCenterList onChange={onChange}/>
            )
          }
        },
        "counterparty_risk",
        "progress_settlement_current_year",
        "progress_settlement_total",
        "received_cash",
        "received_bill",
        "received_material",
        "received_other",
        "received_subtotal",
        "book_receivable_balance",
        "advance_receipt_balance",
        "net_receivable_amount",
        "net_receivable_analysis",
        {
          title: `${selectedYear}年内可回收（元）`,
          subTitle: `${selectedYear}年内可回收`,
          dataIndex: "net_receivable_recover_in_year",
          width: 160,
          align: "center",
          render: (text: any) => {
            return <span>{text}</span>;
          },
        },
        {
          title: `${selectedYear}年后可回收（元）`,
          subTitle: `${selectedYear}年后可回收`,
          dataIndex: "net_receivable_recover_after_year",
          width: 160,
          align: "center",
          render: (text: any) => {
            return <span>{text}</span>;
          },
        },
        "net_receivable_bad_debt",
        "expected_receivable_amount",
        "total_invoice_count",
        "collection_plan_reason",
      ])
      .setFormColumnToInputNumber([
        { value: 'expected_settlement_amount', valueType: 'digit', min: 0 },
        { value: 'progress_settlement_current_year', valueType: 'digit', min: 0 },
        { value: 'progress_settlement_total', valueType: 'digit', min: 0 },
        { value: 'received_cash', valueType: 'digit', min: 0 },
        { value: 'received_bill', valueType: 'digit', min: 0 },
        { value: 'received_material', valueType: 'digit', min: 0 },
        { value: 'received_other', valueType: 'digit', min: 0 },
        { value: 'received_subtotal', valueType: 'digit', min: 0 },
        { value: 'book_receivable_balance', valueType: 'digit', min: 0 },
        { value: 'advance_receipt_balance', valueType: 'digit', min: 0 },
        { value: 'net_receivable_amount', valueType: 'digit', min: 0 },
        { value: 'net_receivable_recover_in_year', valueType: 'digit', min: 0 },
        { value: 'net_receivable_recover_after_year', valueType: 'digit', min: 0 },
        { value: 'net_receivable_bad_debt', valueType: 'digit', min: 0 },
        { value: 'expected_receivable_amount', valueType: 'digit', min: 0 },
        { value: 'total_invoice_count', valueType: 'digit', min: 0 },
      ])
      .needToDisabled([
        'wbs_code',
        'contract_name',
        'relative_person_code',
        'owner_unit_name',
        'contract_say_price',
        'contract_no',
        "received_subtotal",
        "book_receivable_balance",
        "net_receivable_amount",
        "net_receivable_bad_debt",
        "expected_receivable_amount"
      ])
      .setFormColumnToSelfColSpan([
        {
          colSpan: 24,
          value: 'contract_income_id',
          labelCol: {
            span: 24
          },
          wrapperCol: {
            span: 24
          }
        },
      ])
      .setSplitGroupFormColumns([
        {
          title: '合同信息',
          columns: ['contract_income_id'],
        },
        {
          title: '进度结算情况（实际）',
          columns: ['progress_settlement_current_year', 'progress_settlement_total'],
        },
        {
          title: '累计收款情况',
          columns: ['received_cash', 'received_bill', 'received_material', 'received_other', 'received_subtotal'],
        },
        {
          title: '应收款项信息',
          columns: ['book_receivable_balance', 'advance_receipt_balance', 'net_receivable_amount', 'net_receivable_analysis'],
        },
        {
          title: '应收款项净额分析',
          columns: ['net_receivable_recover_in_year', 'net_receivable_recover_after_year', 'net_receivable_bad_debt'],
        },
        {
          title: '预计收款信息',
          columns: ['expected_receivable_amount', 'total_invoice_count', 'collection_plan_reason'],
        },
      ])
      .setFormColumnToSelect([
        {
          value: 'settlement_status',
          valueAlias: 'value',
          valueType: 'select',
          name: 'label',
          data: [
            { label: '与业主、分包全部结算完', value: '1' },
            { label: '与业主、分包全部未结算完', value: '2' },
            { label: '与业主结算完，分包未结算完', value: '3' },
            { label: '与业主未结算完，分包结算完', value: '4' },
            { label: '在建工程未结算', value: '5' },
            { label: '其他', value: '6' },
          ] as any
        },
      ])
      .needToRules([
        "contract_income_id",
        "wbs_code",
        "contract_name",
        "contract_no",
        "relative_person_code",
        "owner_unit_name",
        "settlement_status",
        "contract_say_price",
        "expected_settlement_amount",
        "progress_settlement_current_year",
        "progress_settlement_total",
        "received_cash",
        "received_bill",
        "received_material",
        "received_other",
        "received_subtotal",
        "book_receivable_balance",
        "advance_receipt_balance",
        "net_receivable_amount",
        "net_receivable_recover_in_year",
        "net_receivable_recover_after_year",
        "net_receivable_bad_debt",
        "expected_receivable_amount",
        "total_invoice_count",
        "collection_plan_reason",
        "responsible_person",
        "account_name",
        "counterparty_risk",
        "profit_center_code",
      ])
      .getNeedColumns();

    // 定义计算字段的公式映射
    const formulaMap: Record<string, string> = {
      'received_subtotal': '累计收款情况小计 = 货币资金 + 票据 + 材料款 + 其它',
      'book_receivable_balance': '账面应收款项余额 =  累计办理 - 累计收款情况小计',
      'net_receivable_amount': '应收款项净额 = 账面应收款项余额 - 预收款项余额',
      'net_receivable_bad_debt': '已计提坏账及难以回收部分 = 应收款项净额 - 年内可回收 - 年后可回收',
      'expected_receivable_amount': '预计应收款项 = 预计结算值 - 累计收款情况小计 - 预收款项余额',
    };

    cols.forEach((item: any) => {
      const originalTitle = item.title;
      const formula = formulaMap[item.dataIndex];

      if (formula) {
        // 如果有公式，使用带提示的标题
        item.title = createTitleWithFormula(originalTitle, formula);
      } else {
        // 否则使用普通标题
        item.title = formatMessage({ id: originalTitle });
      }
    });

    return cols;
  };

  return (
    <CrudEditModal
      form={form}
      title={"编辑债权填报表"}
      visible={visible}
      onCancel={onCancel}
      initialValue={selectedRecord}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          dispatch({
            type: "debtStatistics/updateDebtStatistics",
            payload: { ...selectedRecord, ...values },
            callback: (res: any) => {
              resolve(true);
              if (res.errCode === ErrorCode.ErrOk) {
                message.success("编辑成功");
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

export default connect()(DebtStatisticsEdit);
