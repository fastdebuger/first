import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import { message, Form, Modal, Tooltip, Alert, InputNumber } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import AddExpenditureContract from "@/components/AddExpenditureContract";
import type { SelectedExpenditureContract } from "@/components/AddExpenditureContract";
import ProfitCenterList from "@/components/CommonList/ProfitCenterList";

const { CrudEditModal } = SingleTable;

/**
 * 编辑债务填报表
 * @param props
 * @constructor
 */
const DebtPaymentStatisticsEdit: React.FC<any> = (props) => {
  const { dispatch, visible, onCancel, callbackSuccess, selectedRecord, selectedQuarter } = props;
  const { formatMessage } = useIntl();
  const [form] = Form.useForm();


  // 监听四个字段的变化，自动计算 received_subtotal（累计付款情况小计）
  // 公式：小计(9) = 货币资金(5) + 票据(6) + 材料款(7) + 其它(8)
  const receivedCash = Form.useWatch('received_cash', form);
  const receivedBill = Form.useWatch('received_bill', form);
  const receivedMaterial = Form.useWatch('received_material', form);
  const receivedOther = Form.useWatch('received_other', form);

  // 监听字段变化，自动计算 book_payable_balance（账面应付款项余额）
  // 公式：应付款项余额(11) = 累计办理(4) - 小计(9)
  const progressSettlementTotal = Form.useWatch('progress_settlement_total', form);
  const receivedSubtotal = Form.useWatch('received_subtotal', form);
  const bookPayableBalance = Form.useWatch('book_payable_balance', form);

  // 监听字段变化，自动计算 net_payable_amount（应付款项净额）
  // 公式：应付款项净额(12) = 账面应付款项余额(10) - 预付款项余额(11)
  const advancePaymentBalance = Form.useWatch('advance_payment_balance', form);

  // 监听字段变化，自动计算 net_payable_after_year（年后付款金额）
  // 公式：年后付款金额(15) = 应付款项净额(12) - 本年具备支付条件金额(13) - 质保金、结算资料押金(14) - 待结算后核销金额(16)
  const netPayableAmount = Form.useWatch('net_payable_amount', form);
  const netPayableCurrentYearAvailable = Form.useWatch('net_payable_current_year_available', form);
  const netPayableQualityAndDeposit = Form.useWatch('net_payable_quality_and_deposit', form);
  const netPayablePendingWriteoff = Form.useWatch('net_payable_pending_writeoff', form);

  // 监听字段变化，自动计算 expected_remaining_payable（预计剩余应付款项）
  // 公式：按计划剩余应付款项(17) = 最终结算值/预计结算值(2) - 小计(9) - 预付款项余额(11)
  const finalOrExpectedSettlementAmount = Form.useWatch('final_or_expected_settlement_amount', form);
  const advancePaymentBalanceForExpected = Form.useWatch('advance_payment_balance', form);

  // 监听字段变化，自动计算 two_arrears_cost_not_invoiced（已列成本未开发票数）
  // 公式：已列成本,未开发票数(19) = 累计办理(4) - 累计开发票数(18)
  const twoArrearsTotalInvoiced = Form.useWatch('two_arrears_total_invoiced', form);


  // 监听字段变化，自动计算 two_arrears_actual_payment_ratio（实际付款比例）
  // 公式：实际付款比例(21) = (小计(9) + 应付款项余额(11)) / 累计办理(4)

  // 监听字段变化，自动计算 two_arrears_remaining_by_ratio（按照付款比例尚欠款数）
  // 公式：欠款数(22) = 1年以内(23) + 1-3年(24) + 3年以上(25)
  const twoArrearsWithin1Year = Form.useWatch('two_arrears_within_1_year', form);
  const twoArrears1To3Years = Form.useWatch('two_arrears_1_to_3_years', form);
  const twoArrearsOver3Years = Form.useWatch('two_arrears_over_3_years', form);

  // 监听字段变化，自动计算 contract_progress_ratio_contract（进度结算比例）
  // 公式：进度结算比例(29) = 累计办理(4) / 合同额（含税）(1)
  const contractSayPrice = Form.useWatch('contract_say_price', form);

  /**
   * 计算累计付款情况（不包括预付款余额）- 小计 = 货币资金 + 票据 + 材料款 + 其它
   * 公式：小计(9) = 货币资金(5) + 票据(6) + 材料款(7) + 其它(8)
   */
  useEffect(() => {
    const cash = Number(receivedCash) || 0;
    const bill = Number(receivedBill) || 0;
    const material = Number(receivedMaterial) || 0;
    const other = Number(receivedOther) || 0;
    const subtotal = cash + bill + material + other;
    form.setFieldsValue({ received_subtotal: subtotal });
  }, [receivedCash, receivedBill, receivedMaterial, receivedOther, form]);

  /**
   * 计算账面应付款项余额 = 累计办理 - 小计
   * 公式：应付款项余额(11) = 累计办理(4) - 小计(9)
   */
  useEffect(() => {
    const settlementTotal = Number(progressSettlementTotal) || 0;
    const subtotal = Number(receivedSubtotal) || 0;
    const balance = settlementTotal - subtotal;
    form.setFieldsValue({ book_payable_balance: balance });
  }, [progressSettlementTotal, receivedSubtotal, form]);

  /**
   * 计算应付款项净额 = 账面应付款项余额 - 预付款项余额
   * 公式：应付款项净额(12) = 账面应付款项余额(10) - 预付款项余额(11)
   */
  useEffect(() => {
    const bookBalance = Number(bookPayableBalance) || 0;
    const advanceBalance = Number(advancePaymentBalance) || 0;
    const netAmount = bookBalance - advanceBalance;
    form.setFieldsValue({ net_payable_amount: netAmount });
  }, [bookPayableBalance, advancePaymentBalance, form]);

  /**
   * 计算年后付款金额 = 应付款项净额 - 本年具备支付条件金额 - 质保金、结算资料押金 - 待结算后核销金额
   * 公式：年后付款金额(15) = 应付款项净额(12) - 本年具备支付条件金额(13) - 质保金、结算资料押金(14) - 待结算后核销金额(16)
   */
  useEffect(() => {
    const netAmount = Number(netPayableAmount) || 0;
    const currentYear = Number(netPayableCurrentYearAvailable) || 0;
    const qualityDeposit = Number(netPayableQualityAndDeposit) || 0;
    const pendingWriteoff = Number(netPayablePendingWriteoff) || 0;
    const afterYear = netAmount - currentYear - qualityDeposit - pendingWriteoff;
    form.setFieldsValue({ net_payable_after_year: afterYear });
  }, [netPayableAmount, netPayableCurrentYearAvailable, netPayableQualityAndDeposit, netPayablePendingWriteoff, form]);

  /**
   * 计算预计剩余应付款项 = 最终结算值/预计结算值 - 小计 - 预付款项余额
   * 公式：按计划剩余应付款项(17) = 最终结算值/预计结算值(2) - 小计(9) - 预付款项余额(11)
   */
  useEffect(() => {
    const finalOrExpected = Number(finalOrExpectedSettlementAmount) || 0;
    const subtotal = Number(receivedSubtotal) || 0;
    const advanceBalance = Number(advancePaymentBalanceForExpected) || 0;
    const expectedRemaining = finalOrExpected - subtotal - advanceBalance;
    form.setFieldsValue({ expected_remaining_payable: expectedRemaining });
  }, [finalOrExpectedSettlementAmount, receivedSubtotal, advancePaymentBalanceForExpected, form]);

  /**
   * 计算已列成本未开发票数 = 累计办理 - 累计开发票数
   * 公式：已列成本,未开发票数(19) = 累计办理(4) - 累计开发票数(18)
   */
  useEffect(() => {
    const settlementTotal = Number(progressSettlementTotal) || 0;
    const totalInvoiced = Number(twoArrearsTotalInvoiced) || 0;
    const costNotInvoiced = settlementTotal - totalInvoiced;
    form.setFieldsValue({ two_arrears_cost_not_invoiced: costNotInvoiced });
  }, [progressSettlementTotal, twoArrearsTotalInvoiced, form]);

  /**
   * 计算根据结算方式和工程进度情况已结算部分应达到的付款比例 = (小计 + 预付款项余额 + 本年具备支付条件金额) / 累计办理
   * 公式：根据结算方式和工程进度情况已结算部分应达到的付款比例(20) = (小计(9) + 预付款项余额(11) + 本年具备支付条件金额(13)) / 累计办理(4)
   * 显示值 = 计算值 * 100，四舍五入保留两位小数
   */
  useEffect(() => {
    const subtotal = Number(receivedSubtotal) || 0;
    const advanceBalance = Number(advancePaymentBalance) || 0;
    const currentYear = Number(netPayableCurrentYearAvailable) || 0;
    const settlementTotal = Number(progressSettlementTotal) || 0;

    if (settlementTotal > 0) {
      const expectedRatio = (subtotal + advanceBalance + currentYear) / settlementTotal;
      // 转换为百分比：乘以100，四舍五入保留两位小数
      const expectedRatioPercent = Math.round(expectedRatio * 10000) / 100;
      form.setFieldsValue({ two_arrears_expected_payment_ratio: expectedRatioPercent });
    } else {
      form.setFieldsValue({ two_arrears_expected_payment_ratio: 0 });
    }
  }, [receivedSubtotal, advancePaymentBalance, netPayableCurrentYearAvailable, progressSettlementTotal, form]);

  /**
   * 计算实际付款比例 = (小计 + 预付款项余额) / 累计办理
   * 公式：实际付款比例(21) = (小计(9) + 预付款项余额(11)) / 累计办理(4)
   * 显示值 = 计算值 * 100，四舍五入保留两位小数
   */
  useEffect(() => {
    const subtotal = Number(receivedSubtotal) || 0;
    const advanceBalance = Number(advancePaymentBalance) || 0;
    const settlementTotal = Number(progressSettlementTotal) || 0;

    if (settlementTotal > 0) {
      const actualRatio = (subtotal + advanceBalance) / settlementTotal;
      // 转换为百分比：乘以100，四舍五入保留两位小数
      const actualRatioPercent = Math.round(actualRatio * 10000) / 100;
      form.setFieldsValue({ two_arrears_actual_payment_ratio: actualRatioPercent });
    } else {
      form.setFieldsValue({ two_arrears_actual_payment_ratio: 0 });
    }
  }, [receivedSubtotal, advancePaymentBalance, progressSettlementTotal, form]);

  /**
   * 计算按照付款比例尚欠款数 = 1年以内 + 1-3年 + 3年以上
   * 公式：欠款数(22) = 1年以内(23) + 1-3年(24) + 3年以上(25)
   */
  useEffect(() => {
    const within1Year = Number(twoArrearsWithin1Year) || 0;
    const oneTo3Years = Number(twoArrears1To3Years) || 0;
    const over3Years = Number(twoArrearsOver3Years) || 0;
    const remainingByRatio = within1Year + oneTo3Years + over3Years;
    form.setFieldsValue({ two_arrears_remaining_by_ratio: remainingByRatio });
  }, [twoArrearsWithin1Year, twoArrears1To3Years, twoArrearsOver3Years, form]);

  /**
   * 计算进度结算比例（按合同额）= 累计办理 / 合同额（含税）
   * 公式：进度结算比例(29) = 累计办理(4) / 合同额（含税）(1)
   * 显示值 = 计算值 * 100，四舍五入保留两位小数
   */
  useEffect(() => {
    const settlementTotal = Number(progressSettlementTotal) || 0;
    const contractPrice = Number(contractSayPrice) || 0;

    if (contractPrice > 0) {
      const progressRatio = settlementTotal / contractPrice;
      // 转换为百分比：乘以100，四舍五入保留两位小数
      const progressRatioPercent = Math.round(progressRatio * 10000) / 100;
      form.setFieldsValue({ contract_progress_ratio_contract: progressRatioPercent });
    } else {
      form.setFieldsValue({ contract_progress_ratio_contract: 0 });
    }
  }, [progressSettlementTotal, contractSayPrice, form]);

  // 监听字段变化，自动计算 contract_progress_ratio_budget（进度结算比例按预算）
  // 公式：进度结算比例（按预算）= 累计办理(4) / 预算额(2)
  const budgetAmount = Form.useWatch('final_or_expected_settlement_amount', form);

  /**
   * 计算进度结算比例（按预算）= 累计办理 / 预算额
   * 公式：进度结算比例（按预算）= 累计办理(4) / 预算额(2)
   * 显示值 = 计算值 * 100，四舍五入保留两位小数
   */
  useEffect(() => {
    const settlementTotal = Number(progressSettlementTotal) || 0;
    const budget = Number(budgetAmount) || 0;

    if (budget > 0) {
      const progressRatio = settlementTotal / budget;
      // 转换为百分比：乘以100，四舍五入保留两位小数
      const progressRatioPercent = Math.round(progressRatio * 10000) / 100;
      form.setFieldsValue({ contract_progress_ratio_budget: progressRatioPercent });
    } else {
      form.setFieldsValue({ contract_progress_ratio_budget: 0 });
    }
  }, [progressSettlementTotal, budgetAmount, form]);

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
          title: 'costControl.out_info_id',
          subTitle: "支出合同信息",
          dataIndex: "out_info_id",
          width: 300,
          align: 'center',
          renderSelfForm: (formInstance: any) => {
            return (
              <AddExpenditureContract
                onChange={(data: SelectedExpenditureContract) => {
                  if (data) {
                    formInstance.setFieldsValue({
                      out_info_id: data.id,
                      wbs_code: data.income_info_wbs_code,
                      contract_name: data.contract_name,
                      relative_person_code: data.relative_person_code,
                      owner_unit_name: data.owner_unit_name,
                      contract_say_price: data.contract_say_price,
                      contract_no: data.contract_no,
                      responsible_person: data.responsible_person,
                      subletting_enroll_name: data.subletting_enroll_name,
                      income_info_contract_no: data.income_info_contract_no,
                      contract_category : data.contract_type_str
                    });
                  }
                }}
                onClear={() => {
                  formInstance.setFieldsValue({
                    out_info_id: '',
                    wbs_code: '',
                    contract_name: '',
                    relative_person_code: '',
                    owner_unit_name: '',
                    contract_say_price: '',
                    contract_no: '',
                    responsible_person: '',
                    subletting_enroll_name: '',
                    income_info_contract_no: '',
                    contract_category : '',
                  });
                }}
                width={300}
                filter={[{ Key: 'sub_progress_payment_id', Val: '0', Operator: '=' }]}
                id={selectedRecord?.out_info_id}
              />
            )
          }
        },
        "wbs_code",
        "income_info_contract_no",
        "contract_name",
        "contract_no",
        "relative_person_code",
        "subletting_enroll_name",
        "settlement_status",
        "contract_say_price",
        "final_or_expected_settlement_amount",
        "account_name",
        "contract_category",
        {
          title: "compinfo.profit_center_code",
          subTitle: "利润中心",
          dataIndex: "profit_center_code",
          width: 160,
          align: "center",
          renderSelfForm: formInstance => {
            const onChange = (val: any, fields: any) => {
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
        "book_payable_balance",
        "advance_payment_balance",
        "net_payable_amount",
        "net_payable_current_year_available",
        "net_payable_quality_and_deposit",
        {
          title: `${selectedYear}年后可付款（元）`,
          subTitle: `${selectedYear}年后付款金额`,
          dataIndex: "net_payable_after_year",
          width: 160,
          align: "center",
          render: (text: any) => {
            return <span>{text}</span>;
          },
        },
        "net_payable_pending_writeoff",
        "expected_remaining_payable",
        "two_arrears_total_invoiced",
        "two_arrears_cost_not_invoiced",
        {
          title: "compinfo.two_arrears_expected_payment_ratio",
          subTitle: "根据结算方式和工程进度情况已结算部分应达到的付款比例",
          dataIndex: "two_arrears_expected_payment_ratio",
          width: 400,
          align: "center",
          renderSelfForm: () => {
            return (
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                precision={2}
                formatter={(value) => `${value}%`}
                parser={(value) => value!.replace('%', '') as any}
                disabled
              />
            );
          }
        },
        {
          title: "compinfo.two_arrears_actual_payment_ratio",
          subTitle: "实际付款比例",
          dataIndex: "two_arrears_actual_payment_ratio",
          width: 160,
          align: "center",
          renderSelfForm: () => {
            return (
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                precision={2}
                formatter={(value) => `${value}%`}
                parser={(value) => value!.replace('%', '') as any}
                disabled
              />
            );
          }
        },
        "two_arrears_remaining_by_ratio",
        "two_arrears_within_1_year",
        "two_arrears_1_to_3_years",
        "two_arrears_over_3_years",
        "two_arrears_due_to_funds_shortage",
        "two_arrears_reason_analysis",
        "contract_payment_clause",
        {
          title: "进度款结算比例（按合同额）",
          subTitle: "进度结算比例（按合同额）",
          dataIndex: "contract_progress_ratio_contract",
          width: 200,
          align: "center",
          renderSelfForm: () => {
            return (
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                precision={2}
                formatter={(value) => `${value}%`}
                parser={(value) => value!.replace('%', '') as any}
                disabled
              />
            );
          }
        },
        {
          title: "进度款结算比例（按预算）",
          subTitle: "进度结算比例（按预算）",
          dataIndex: "contract_progress_ratio_budget",
          width: 200,
          align: "center",
          renderSelfForm: () => {
            return (
              <InputNumber
                style={{ width: '100%' }}
                min={0}
                precision={2}
                formatter={(value) => `${value}%`}
                parser={(value) => value!.replace('%', '') as any}
                disabled
              />
            );
          }
        },


      ])
      .needToRules([
        'out_info_id',
        "wbs_code",
        "income_info_contract_no",
        "contract_name",
        "contract_no",
        "relative_person_code",
        "subletting_enroll_name",
        "settlement_status",
        "contract_say_price",
        "final_or_expected_settlement_amount",
        "account_name",
        "profit_center_code",
        "counterparty_risk",
        "progress_settlement_current_year",
        "progress_settlement_total",
        "received_cash",
        "received_bill",
        "received_material",
        "received_other",
        "received_subtotal",
        "book_payable_balance",
        "advance_payment_balance",
        "net_payable_amount",
        "net_payable_current_year_available",
        "net_payable_quality_and_deposit",
        "net_payable_after_year",
        "net_payable_pending_writeoff",
        "expected_remaining_payable",
        "two_arrears_total_invoiced",
        "two_arrears_cost_not_invoiced",
        "two_arrears_expected_payment_ratio",
        "two_arrears_actual_payment_ratio",
        "two_arrears_remaining_by_ratio",
        "two_arrears_within_1_year",
        "two_arrears_1_to_3_years",
        "two_arrears_over_3_years",
        "two_arrears_due_to_funds_shortage",
        "two_arrears_reason_analysis",
        "contract_payment_clause",
        "contract_progress_ratio_contract",
        "contract_progress_ratio_budget",
        "contract_category",
      ])
      .setFormColumnToInputNumber([
        { value: 'contract_say_price', valueType: 'digit', min: 0 },
        { value: 'final_or_expected_settlement_amount', valueType: 'digit', min: 0 },
        { value: 'progress_settlement_current_year', valueType: 'digit', min: 0 },
        { value: 'progress_settlement_total', valueType: 'digit', min: 0 },
        { value: 'received_cash', valueType: 'digit', min: 0 },
        { value: 'received_bill', valueType: 'digit', min: 0 },
        { value: 'received_material', valueType: 'digit', min: 0 },
        { value: 'received_other', valueType: 'digit', min: 0 },
        { value: 'received_subtotal', valueType: 'digit', min: 0 },
        { value: 'book_payable_balance', valueType: 'digit', min: 0 },
        { value: 'advance_payment_balance', valueType: 'digit', min: 0 },
        { value: 'net_payable_amount', valueType: 'digit', min: 0 },
        { value: 'net_payable_current_year_available', valueType: 'digit', min: 0 },
        { value: 'net_payable_quality_and_deposit', valueType: 'digit', min: 0 },
        { value: 'net_payable_after_year', valueType: 'digit', min: 0 },
        { value: 'net_payable_pending_writeoff', valueType: 'digit', min: 0 },
        { value: 'expected_remaining_payable', valueType: 'digit', min: 0 },
        { value: 'two_arrears_total_invoiced', valueType: 'digit', min: 0 },
        { value: 'two_arrears_cost_not_invoiced', valueType: 'digit', min: 0 },
        { value: 'two_arrears_within_1_year', valueType: 'digit', min: 0 },
        { value: 'two_arrears_1_to_3_years', valueType: 'digit', min: 0 },
        { value: 'two_arrears_over_3_years', valueType: 'digit', min: 0 },
        { value: 'two_arrears_due_to_funds_shortage', valueType: 'digit', min: 0 },
      ])
      .setFormColumnToDatePicker([
        { value: 'create_ts', valueType: 'dateTs', needValueType: 'timestamp' },
        { value: 'modify_ts', valueType: 'dateTs', needValueType: 'timestamp' },
      ])
      .needToDisabled([
        'wbs_code',
        'contract_name',
        'contract_no',
        'relative_person_code',
        'subletting_enroll_name',
        'contract_say_price',
        'received_subtotal',
        'book_payable_balance',
        'net_payable_amount',
        'expected_remaining_payable',
        'two_arrears_cost_not_invoiced',
        'two_arrears_expected_payment_ratio',
        'two_arrears_actual_payment_ratio',
        'two_arrears_remaining_by_ratio',
        'contract_progress_ratio_contract',
        'contract_progress_ratio_budget',
        'net_payable_after_year',
        'contract_category',
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
        },
      ])
      .setSplitGroupFormColumns([
        {
          title: '合同信息',
          columns: ['out_info_id'],
        },
        {
          title: '进度结算情况（实际）',
          columns: ['progress_settlement_current_year', 'progress_settlement_total'],
        },
        {
          title: '累计付款情况（不包括预付款余额）',
          columns: ['received_cash', 'received_bill', 'received_material', 'received_other', 'received_subtotal'],
        },
        {
          title: '应付款项信息',
          columns: ['book_payable_balance', 'advance_payment_balance', 'net_payable_amount'],
        },
        {
          title: '应付款项净额分析',
          columns: ['net_payable_current_year_available', 'net_payable_quality_and_deposit', 'net_payable_after_year', 'net_payable_pending_writeoff'],
        },
        {
          title: '预计付款信息',
          columns: ['expected_remaining_payable'],
        },
        {
          title: '两拖欠相关分析',
          columns: ['two_arrears_total_invoiced', 'two_arrears_cost_not_invoiced', 'two_arrears_expected_payment_ratio', 'two_arrears_actual_payment_ratio', 'two_arrears_remaining_by_ratio', 'two_arrears_within_1_year', 'two_arrears_1_to_3_years', 'two_arrears_over_3_years', 'two_arrears_due_to_funds_shortage', 'two_arrears_reason_analysis'],
        },
        {
          title: '合同执行情况分析',
          columns: ['contract_payment_clause', 'contract_progress_ratio_contract', 'contract_progress_ratio_budget'],
        }
      ])
      .setFormColumnToSelect([
        {
          value: 'settlement_status',
          valueAlias: 'value',
          valueType: 'select',
          name: 'label',
          data: [
            { label: '与业主、分包全部结算完', value: '1' },
            { label: '与业主、分包全部未结算完', value: '1' },
            { label: '与业主结算完，分包未结算完', value: '2' },
            { label: '与业主未结算完，分包结算完', value: '4' },
            { label: '在建工程未结算', value: '5' },
            { label: '其他', value: '6' },
          ] as any
        },
      ])
      .getNeedColumns();

    // 定义计算字段的公式映射
    const formulaMap: Record<string, string> = {
      'received_subtotal': '小计(9) = 货币资金(5) + 票据(6) + 材料款(7) + 其它(8)',
      'book_payable_balance': '应付款项余额(11) = 累计办理(4) - 小计(9)',
      'net_payable_amount': '应付款项净额(12) = 账面应付款项余额(10) - 预付款项余额(11)',
      'net_payable_after_year': '年后付款金额(15) = 应付款项净额(12) - 本年具备支付条件金额(13) - 质保金、结算资料押金(14) - 待结算后核销金额(16)',
      'expected_remaining_payable': '按计划剩余应付款项(17) = 最终结算值/预计结算值(2) - 小计(9) - 预付款项余额(11)',
      'two_arrears_cost_not_invoiced': '已列成本未开发票数(19) = 累计办理(4) - 累计开发票数(18)',
      'two_arrears_expected_payment_ratio': '根据结算方式和工程进度情况已结算部分应达到的付款比例(20) = (小计(9) + 预付款项余额(11) + 本年具备支付条件金额(13)) / 累计办理(4)',
      'two_arrears_actual_payment_ratio': '实际付款比例(21) = (小计(9) + 预付款项余额(11)) / 累计办理(4)',
      'two_arrears_remaining_by_ratio': '按照付款比例尚欠款数(22) = 1年以内(23) + 1-3年(24) + 3年以上(25)',
      'contract_progress_ratio_contract': '进度结算比例（按合同额）(29) = 累计办理(4) / 合同额（含税）(1)',
      'contract_progress_ratio_budget': '进度结算比例（按预算） = 累计办理(4) / 预算额(2)',
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
      title={"编辑债务填报表"}
      visible={visible}
      onCancel={onCancel}
      initialValue={selectedRecord}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          // 验证公式2和公式3的计算结果是否相等（公式1由于四舍五入保留两位小数可能存在偏差，仅作为参考提示）
          // 公式1: 按照付款比例尚欠款数(22) = 累计办理(4) × 根据结算方式和工程进度情况已结算部分应达到的付款比例(20) - 小计(9) - 预付款项余额(11)
          // 公式2: 按照付款比例尚欠款数(22) = 本年具备支付条件金额(13)
          // 公式3: 按照付款比例尚欠款数(22) = 1年以内(23) + 1-3年(24) + 3年以上(25)

          const progressSettlementTotalValue = Number(values.progress_settlement_total) || 0; // 累计办理(4)
          const expectedPaymentRatioPercent = Number(values.two_arrears_expected_payment_ratio) || 0; // 根据结算方式和工程进度情况已结算部分应达到的付款比例(20) - 百分比形式
          const expectedPaymentRatioValue = expectedPaymentRatioPercent / 100; // 转换为小数形式用于计算
          const receivedSubtotalValue = Number(values.received_subtotal) || 0; // 小计(9)
          const advancePaymentBalanceValue = Number(values.advance_payment_balance) || 0; // 预付款项余额(11)
          const netPayableCurrentYearAvailableValue = Number(values.net_payable_current_year_available) || 0; // 本年具备支付条件金额(13)
          const twoArrearsWithinOneYear = Number(values.two_arrears_within_1_year) || 0; // 1年以内(23)
          const twoArrearsOneToThreeYears = Number(values.two_arrears_1_to_3_years) || 0; // 1-3年(24)
          const twoArrearsOverThreeYears = Number(values.two_arrears_over_3_years) || 0; // 3年以上(25)

          // 计算三个公式的结果
          const formula1Result = progressSettlementTotalValue * expectedPaymentRatioValue - receivedSubtotalValue - advancePaymentBalanceValue; // 公式1: 累计办理(4) × 根据结算方式和工程进度情况已结算部分应达到的付款比例(20) - 小计(9) - 预付款项余额(11)
          const formula2Result = netPayableCurrentYearAvailableValue; // 公式2: 本年具备支付条件金额(13)
          const formula3Result = twoArrearsWithinOneYear + twoArrearsOneToThreeYears + twoArrearsOverThreeYears; // 公式3: 1年以内(23) + 1-3年(24) + 3年以上(25)

          // 只判断公式2和公式3是否相等（允许小数点后2位的误差）
          const tolerance = 0.01;
          const isEqual = Math.abs(formula2Result - formula3Result) < tolerance;

          if (!isEqual) {
            // 如果公式2和公式3不一致，显示错误提示
            Modal.error({
              title: '计算公式验证失败',
              width: 600,
              content: (
                <div>
                  <p style={{ marginBottom: 16, color: '#ff4d4f' }}>按照付款比例尚欠款数(22)的公式2和公式3计算结果不一致，请检查并修改相关字段：</p>
                  <div style={{ marginBottom: 12 }}>
                    <strong>公式1：</strong> 按照付款比例尚欠款数(22) = 累计办理(4) × 根据结算方式和工程进度情况已结算部分应达到的付款比例(20) - 小计(9) - 预付款项余额(11)
                    <br />
                    <span style={{ marginLeft: 20 }}>
                      = {progressSettlementTotalValue} × {expectedPaymentRatioPercent}% - {receivedSubtotalValue} - {advancePaymentBalanceValue}
                    </span>
                    <br />
                    <span style={{ marginLeft: 20, color: '#1890ff' }}>
                      = {formula1Result.toFixed(2)}
                    </span>
                    <br />
                    <span style={{ marginLeft: 20, color: '#faad14', fontSize: '12px' }}>
                      （提示：由于四舍五入保留两位小数，此公式计算结果可能存在一定偏差）
                    </span>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <strong>公式2：</strong> 按照付款比例尚欠款数(22) = 本年具备支付条件金额(13)
                    <br />
                    <span style={{ marginLeft: 20 }}>
                      = {netPayableCurrentYearAvailableValue}
                    </span>
                    <br />
                    <span style={{ marginLeft: 20, color: '#1890ff' }}>
                      = {formula2Result.toFixed(2)}
                    </span>
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <strong>公式3：</strong> 按照付款比例尚欠款数(22) = 1年以内(23) + 1-3年(24) + 3年以上(25)
                    <br />
                    <span style={{ marginLeft: 20 }}>
                      = {twoArrearsWithinOneYear} + {twoArrearsOneToThreeYears} + {twoArrearsOverThreeYears}
                    </span>
                    <br />
                    <span style={{ marginLeft: 20, color: '#1890ff' }}>
                      = {formula3Result.toFixed(2)}
                    </span>
                  </div>
                  <p style={{ marginTop: 16, color: '#ff4d4f' }}>请修改相关字段使公式2和公式3的计算结果一致后再提交。</p>
                </div>
              ),
            });
            resolve(true);
            return;
          }

          // 如果验证通过，继续提交
          dispatch({
            type: "debtPaymentStatistics/updateDebtPaymentStatistics",
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

export default connect()(DebtPaymentStatisticsEdit);
