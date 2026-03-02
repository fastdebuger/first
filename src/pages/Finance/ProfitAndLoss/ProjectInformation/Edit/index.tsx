import React, { useEffect } from "react";
import { configColumns } from "../columns";
import { BasicFormColumns, SingleTable } from "yayang-ui";
import { useIntl, connect } from "umi";
import { ErrorCode } from "@/common/const";
import {Alert, message, Modal } from "antd";
import PopulateCardWithData from "@/pages/Contract/Expenditure/PopulateCardWithData";
import {showTS} from "@/utils/utils-date";
import ProfitCenterList from "@/components/CommonList/ProfitCenterList";
import SysDict from "@/components/CommonList/SysDict";
import {ConnectState} from "@/models/connect";
import {queryWbsDefineCompare} from "@/services/finance/wbsDefineCompare";
import {getDepByContractNo} from "@/services/engineering/monthlyReport";

const { CrudEditModal } = SingleTable;

/**
 * 编辑项目信息
 * @param props
 * @constructor
 */
const ProjectInformationEdit: React.FC<any> = (props) => {
  const { dispatch, visible, sysBasicDictList, onCancel, callbackSuccess, selectedRecord } = props;
  const { formatMessage } = useIntl();

  const [contractList, setContractList] = React.useState<any[]>([]);

  const fetchList = async (contractNo: string) => {
    const res = await getDepByContractNo({
      contract_no: contractNo,
      sort: 'contract_no',
      order: 'asc',
    })
    setContractList(res.result || []);
  }

  useEffect(() => {
    fetchList(selectedRecord.contract_no)
  }, []);

  const getMessage = () => {
    return (
      <span>
        该合同存在多个项目部中, <strong>{contractList.map(c => `${c.dep_name}: 已填报 ${c.filled_contract_say_price}元`).join(', ')}</strong> 都存在该合同，本次填报合同金额 不能超过或等于 总合同金额 减去其它项目部已填报金额
      </span>
    )
  }

  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        "id",
        {
          title: 'compinfo.contract_no', // 对应的主合同 ERP 项目编号
          subTitle: "合同编码", // 副标题
          dataIndex: "contract_no", // 数据索引
          width: 160, // 列宽
          align: 'center', // 对齐方式
          renderSelfForm: (form: any) => { // 自定义表单渲染
            return (
              <>
                {contractList.length > 0 && (
                  <Alert style={{marginBottom: 16}} type={'warning'} message={getMessage()}/>
                )}
                <PopulateCardWithData
                  operate={'edit'}
                  selectedRecord={selectedRecord}
                  onSelect={async (values: any) => {
                    form.setFieldsValue({ // 设置表单字段值
                      contract_no: values.contract_no,
                      contract_income_id: values.id,
                      wbs_define_code: values.wbs_code,
                      wbs_define_name: values.contract_name,
                      "owner_group": values.owner_group,
                      "client_name": values.owner_unit_name,
                      "contract_start_date": showTS(Number(values.contract_start_date), 'YYYY-MM-DD'),
                      "contract_end_date": showTS(Number(values.contract_end_date), 'YYYY-MM-DD'),
                      "contract_say_price": values.contract_say_price,
                      "contract_un_say_price": values.contract_un_say_price,
                      "project_level": values.project_level,
                    })
                    const res = await queryWbsDefineCompare({
                      sort: 'id', order: 'desc',
                      filter: JSON.stringify([
                        {Key: 'wbs_define_code', Val: values.wbs_code, Operator: '='}
                      ]),
                    })
                    const len = res.rows ? res.rows.length : 0;
                    if (len === 0) {
                      Modal.confirm({
                        title: '提示',
                        content: '未在WBS配置表中查询到 该WBS项目定义 对应的 利润中心及项目名称，是否要继续操作？如要继续操作，需要用户手动选择利润中心和填写项目名称，如不继续操作，可去 WBS对照表模块 维护相应的对照关系',
                        okText: '继续操作',
                        onOk: () => {

                        }
                      })
                    } else {
                      form.setFieldsValue({ // 设置表单字段值
                        wbs_define_name: res.rows[0].wbs_define_name || '',
                        profit_center_code: res.rows[0].profit_center_code || '',
                      })
                    }
                  }}
                  onCardCancel={() => {
                    form.resetFields();
                  }}
                />
              </>
            )
          }
        },
        "wbs_define_code",
        "wbs_define_name",
        "contract_income_id",
        {
          title: "compinfo.profit_center_code",
          subTitle: "利润中心",
          dataIndex: "profit_center_code",
          width: 160,
          align: "center",
          renderSelfForm: form => {
            const onChange = (val, fields) => {
              form.setFieldsValue({
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
        {
          title: "compinfo.owner_group",
          subTitle: "工程所属集团",
          dataIndex: "owner_group",
          width: 160,
          align: "center",
          renderSelfForm: (form) => {
            const onChange = (_val) => {
              form.setFieldsValue({
                project_level: _val
              })
            }
            return (
              <SysDict sysTypeCode={'OWNER_GROUP'} onChange={onChange}/>
            )
          }
        },
        "client_name",
        "contract_start_date",
        "actual_start_date",
        "contract_end_date",
        "actual_end_date",
        "contract_say_price",
        "contract_un_say_price",
        // "engineering_calc_finish_amount",
        // "project_status",
        // "settlement_status",
        {
          title: "compinfo.project_level",
          subTitle: "项目等级",
          dataIndex: "project_level",
          width: 160,
          align: "center",
          renderSelfForm: (form) => {
            const onChange = (_val) => {
              form.setFieldsValue({
                project_level: _val
              })
            }
            return (
              <SysDict sysTypeCode={'PROJECT_LEVEL'} onChange={onChange}/>
            )
          }
        },
        "company_supervision_user",
        "sub_company_manager",
        "sub_company_supervision_user",
        "project_manager",
        "project_sub_engine_manager",
        "project_sub_settlement_manager",
        "project_finance_user",
        "remark",
      ])
      .setFormColumnToInputNumber([
        {value: 'contract_say_price', valueType: 'digit'},
        {value: 'contract_un_say_price', valueType: 'digit'},
        // {value: 'engineering_calc_finish_amount', valueType: 'digit'}
      ])
      .setFormColumnToSelfColSpan([ // 设置自定义列跨度的列
        {
          colSpan: 24,
          value: 'contract_no',
          labelCol: {
            span: 24
          },
          wrapperCol: {
            span: 24
          }
        }
      ])
      .setSplitGroupFormColumns([ // 设置分组表单列
        {
          title: '相关合同信息',
          order: 2,
          columns: [
            "wbs_define_code",
            "wbs_define_name",
            "profit_center_code",
            "owner_group",
            "client_name",
            "contract_start_date",
            "actual_start_date",
            "contract_end_date",
            "actual_end_date",
            "contract_say_price",
            "contract_un_say_price",
            // "engineering_calc_finish_amount",
            // "project_status",
            // "settlement_status",
            "project_level",
          ]},
        {
          title: '项目管理责任人',
          order: 3,
          columns: [
            "company_supervision_user",
            "sub_company_manager",
            "sub_company_supervision_user",
            "project_manager",
            "project_sub_engine_manager",
            "project_sub_settlement_manager",
            "project_finance_user",
          ]
        },
        {
          title: '其它',
          order: 3,
          columns: [
            "remark",
          ]
        }
      ])
      .setFormColumnToInputTextArea([
        {value: 'remark'}
      ])
      .setFormColumnToDatePicker([
        {value: 'contract_start_date', valueType: 'dateTs', needValueType: 'date'},
        {value: 'actual_start_date', valueType: 'dateTs', needValueType: 'date'},
        {value: 'contract_end_date', valueType: 'dateTs', needValueType: 'date'},
        {value: 'actual_end_date', valueType: 'dateTs', needValueType: 'date'},
      ])
      // .setFormColumnToSelect([
      //   {value: 'project_status', valueAlias: 'value', valueType:"select", name: 'label', data: sysBasicDictList.filter(r => r.type === 'PROJECT_STATUS')},
      //   {value: 'settlement_status', valueAlias: 'value', valueType:"select", name: 'label', data: sysBasicDictList.filter(r => r.type === 'SETTLEMENT_STATUS')},
      // ])
      .needToHide([
        'id',
        'contract_income_id'
      ])
      .needToDisabled([
        "wbs_define_code",
      ])
      .needToRules([
        "wbs_define_code",
        "wbs_define_name",
        "profit_center_code",
        // "project_status",
        // "settlement_status",
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  return (
    <CrudEditModal
      title={"编辑项目信息"}
      visible={visible}
      onCancel={onCancel}
      initialValue={{
        ...selectedRecord,
        project_status: `${selectedRecord.project_status}`,
        settlement_status: `${selectedRecord.settlement_status}`,
      }}
      columns={getFormColumns()}
      onCommit={(values: any) => {
        return new Promise((resolve) => {
          if(contractList.length > 0) {
            let _commitContractSayPrice = Number(values.contract_say_price || 0);
            let contractSayTotalPrice = 0;
            let _filledContractSayTotalPrice = 0;
            contractList.forEach((item: any) => {
              contractSayTotalPrice = item.contract_say_price;
              _filledContractSayTotalPrice += Number(item.filled_contract_say_price || 0)
            })
            let allowContractSayPrice = contractSayTotalPrice - _filledContractSayTotalPrice;
            if (_commitContractSayPrice > allowContractSayPrice) {
              resolve(true);
              Modal.warning({
                title: "警告",
                content: (
                  <div>
                    <div>
                      <strong>填报金额超过 允许填报金额 {allowContractSayPrice}</strong>
                    </div>
                    <strong>该合同在多个项目部存在，请确定你本次输入的合同额 </strong>
                    <div>
                      <ul>
                        {contractList.map(item => {
                          return (
                            <li key={item.dep_code}>
                              {item.dep_name} 已填报 {item.filled_contract_say_price} 元
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                ),
              })
              return;
            }
          }
          dispatch({
            type: "projectInformation/updateProjectInformation",
            payload: values,
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

export default connect(({common}: ConnectState) => ({
  sysBasicDictList: common.sysBasicDictList,
}))(ProjectInformationEdit);
