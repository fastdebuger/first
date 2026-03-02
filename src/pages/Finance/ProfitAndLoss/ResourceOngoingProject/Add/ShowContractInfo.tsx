import React, { useEffect } from 'react';
import {configColumns as showContractColumns} from "@/pages/Contract/Income/columns";
import {areAllElementsSame, getDepTitle} from "@/utils/utils";
import { BasicTableColumns } from "yayang-ui";
import {getIncomeInfo} from "@/services/contract/income";
import {Button, Col, Descriptions, message, Modal, Row } from 'antd';
import {queryWbsDefineCompare} from "@/services/finance/wbsDefineCompare";

const ShowContractInfo = (props:any) => {
  const { selectedMenuItem, callback } = props;
  const getTableColumns = () => {
    const cols = new BasicTableColumns(showContractColumns);
    cols
      .initTableColumns([
        "RowNumber",
        ...getDepTitle(),
        "contract_no",
        "wbs_code",
        "user_name",
        "owner_name",
        "owner_group_str",
        'owner_unit_name',
        "project_location",
        "contract_name",
        "scope_fo_work",
        "contract_mode_str",
        "bidding_mode_str",
        "valuation_mode_name",
        "contract_start_date_str",
        "contract_end_date_str",
        "contract_say_price",
        "contract_un_say_price",
        "contract_sign_date_str",
        "project_level_str",
        "project_category_str",
        "specialty_type_str",
        "revenue_method_str",
        "relative_person_code",
        "remark",
        "form_maker_code",
        "form_maker_name",
        "form_make_time_str",
        'settlement_management_id_str'
      ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
      .needToFixed([
        {
          value: "settlement_management_id_str",
          fixed: "right"
        }
      ])
    return cols.getNeedColumns();
  };
  const depCode = localStorage.getItem('auth-default-wbsCode') || '';
  // 项目定义对应查询出的合同数量 有一对多的情况
  const [contractList, setContractList] = React.useState<any[]>([]);
  // 选择哪一份 项目定义需要返回的值 给下一步用
  const [callbackItem, setCallbackItem] = React.useState<any>({});
  // 该项目定义下的合同是 一份 还是 多份，在下一步 展示UI用
  const [contractCountStr, setContractCountStr] = React.useState<any>('');
  const [visible, setVisible] = React.useState(false);
  // 是否进行下一步
  const [isNext, setIsNext] = React.useState(true);
  // 单份/多份合同 选择项目定义时的展示内容
  const [stepOneTitle, setStepOneTitle] = React.useState(() => <span>正在从《WBS对照表》获取 项目名称、利润中心编码、收入确认方式...</span>);
  const [stepThreeTitle, setStepThreeTitle] = React.useState(() => <span> </span>);

  const len = Number(selectedMenuItem.contract_no_count);

  const fetchList = async () => {
    const res = await getIncomeInfo({
      order: 'desc',
      sort: 'id',
      filter: JSON.stringify([
        { Key: 'wbs_code', Val: selectedMenuItem?.wbs_define_code, Operator: '=' },
        { Key: 'dep_code', Val: depCode, Operator: '=' },
      ]),
    })
    setContractList(res.rows || []);
  }

  useEffect(() => {
    fetchList()
  }, [selectedMenuItem]);

  return (
    <div>
      <Row justify={'space-between'} style={{marginTop: 8}}>
        <Col><strong style={{fontSize: 16, color: '#1890ff'}}>
          WBS项目定义：{selectedMenuItem.wbs_define_code} 共：{selectedMenuItem.contract_no_count} 份主合同
        </strong></Col>
        <Col>
          <Button disabled={len === 0} type="primary" onClick={async () => {
            if (len < 1) {
              message.warn('该项目定义下无任何合同信息');
              return;
            }
            if (contractList.length < 1) {
              message.warn('该项目定义下无任何合同信息');
              return;
            }
            // 就一份合同 直接赋值
            if(len === 1 && contractList.length === 1) {
              if (!contractList[0].relative_person_code) {
                message.warn('该项目定义下的合同 未配置 合同相对人十位编码，需要配置后才能操作');
                return;
              }
              setVisible(true)
              const res = await queryWbsDefineCompare({
                sort: 'id', order: 'desc',
                filter: JSON.stringify([
                  {Key: 'wbs_define_code', Val: selectedMenuItem.wbs_define_code, Operator: '='}
                ]),
              })
              const len = res.rows ? res.rows.length : 0;
              if (len === 0) {
                setTimeout(() => {
                  setStepOneTitle(() => <span style={{color: 'orange'}}>《WBS对照表》中未查询到 该WBS项目定义 对应的 利润中心及项目名称，需要在下一步手动选择</span>)
                  setStepThreeTitle(() => <span>正在从《合同信息》获取 合同金额、合同开工、合同类型等信息...</span>)
                }, 2000)
              } else {
                setTimeout(() => {
                  setStepOneTitle(() => (
                    <div>
                      <p>已从 《WBS对照表》中获取如下信息</p>
                      <ul>
                        <li>利润中心：<strong>{res.rows[0].profit_center_code}</strong></li>
                        <li>境内/外：<strong>{res.rows[0].inOrOut}</strong></li>
                        <li>项目名称：<strong>{res.rows[0].wbs_define_name}</strong></li>
                        <li>收入确认方式：<strong>{res.rows[0].income_method}</strong></li>
                      </ul>
                    </div>
                  ))
                  setStepThreeTitle(() => <span>正在从《合同信息》获取 合同金额、合同开工、合同类型等信息...</span>)
                }, 2000)
                Object.assign(contractList[0], {
                  profit_center_code: res.rows[0].profit_center_code,
                  inOrOut: res.rows[0].inOrOut,
                  wbs_define_code: selectedMenuItem.wbs_define_code,
                  wbs_define_name: res.rows[0].wbs_define_name,
                  income_method: res.rows[0].income_method,
                  contract_type: contractList[0].contract_mode,
                  company_a_b: contractList[0].project_level,
                })
              }
              setTimeout(() => {
                setStepThreeTitle(() => <span>已从《合同信息》获取 合同金额、合同开工、合同类型等信息</span>)
                setContractCountStr('single');
                setCallbackItem(contractList[0])
                setIsNext(false);
              }, 3000)
            }

            // 多份合同 要合并
            if (len > 1 && contractList.length > 1) {
              const filterRelativePersonCodeArr = contractList.filter(record => record.relative_person_code);
              if (filterRelativePersonCodeArr.length === 0) {
                message.warn(`该项目定义下的${contractList.length}份合同 都未配置 合同相对人十位编码，需要配置后才能操作`);
                return;
              }
              const arr = filterRelativePersonCodeArr.map(r => r.relative_person_code);
              const boolean = areAllElementsSame(arr);
              if (!boolean) {
                message.warn(`该项目定义下的${contractList.length}份合同 配置的 合同相对人十位编码不是同一个，不能继续操作`);
                return;
              }
              let totalPrice = 0;
              filterRelativePersonCodeArr.forEach(record => {
                totalPrice += Number(record.contract_say_price);
              })
              setVisible(true)
              const res = await queryWbsDefineCompare({
                sort: 'id', order: 'desc',
                filter: JSON.stringify([
                  {Key: 'wbs_define_code', Val: selectedMenuItem.wbs_define_code, Operator: '='}
                ]),
              })
              const len = res.rows ? res.rows.length : 0;
              const stepOneFields ={};
              if (len === 0) {
                setTimeout(() => {
                  setStepOneTitle(() => <span style={{color: 'orange'}}>《WBS对照表》中未查询到 该WBS项目定义 对应的 利润中心及项目名称，需要在下一步手动选择</span>)
                  setStepThreeTitle(() => (
                    <div>
                      <strong style={{color: 'orange'}}>因您目前有多份合同，所以 合同开工、合同类型等信息需要在下一步选择从哪份合同读取</strong>
                      <br/>
                      <strong>
                        多份合同总金额：{totalPrice}
                      </strong>
                    </div>
                  ))
                }, 2000)
              } else {
                setTimeout(() => {
                  setStepOneTitle(() => (
                    <div>
                      <p>已从 《WBS对照表》中获取如下信息</p>
                      <ul>
                        <li>利润中心：<strong>{res.rows[0].profit_center_code}</strong></li>
                        <li>境内/外：<strong>{res.rows[0].inOrOut}</strong></li>
                        <li>项目名称：<strong>{res.rows[0].wbs_define_name}</strong></li>
                        <li>收入确认方式：<strong>{res.rows[0].income_method}</strong></li>
                      </ul>
                    </div>
                  ))
                  setStepThreeTitle(() => (
                    <div>
                      <strong style={{color: 'orange'}}>因您目前有多份合同，所以 合同开工、合同类型等信息需要在下一步选择从哪份合同读取</strong>
                      <br/>
                      <strong>
                        多份合同总金额：{totalPrice}
                      </strong>
                    </div>
                  ))
                }, 2000)
                Object.assign(stepOneFields, {
                  profit_center_code: res.rows[0].profit_center_code,
                  inOrOut: res.rows[0].inOrOut,
                  wbs_define_code: selectedMenuItem.wbs_define_code,
                  wbs_define_name: res.rows[0].wbs_define_name,
                  income_method: res.rows[0].income_method,
                })
              }
              setTimeout(() => {
                Object.assign(stepOneFields, {
                  contract_say_price: totalPrice, // 多份合同总金额
                  relative_person_code: filterRelativePersonCodeArr[0].relative_person_code // 多份合同相同十位编码
                })
                setContractCountStr('multiple');
                setCallbackItem(stepOneFields)
                setIsNext(false);
              }, 3000)
            }
          }}>
            选择此WBS项目定义
          </Button>
        </Col>
      </Row>
      <div style={{marginTop: 8, overflowY: 'scroll', height: 'calc(100vh - 120px)'}}>
        {contractList.map((item, index) => {
          return (
            <Descriptions title={<span>合同{index + 1}：{item.contract_no}</span>}>
              {getTableColumns().map((column: any) => {
                return (
                  <Descriptions.Item label={column.subTitle}>
                    {item[column.dataIndex] || '--'}
                  </Descriptions.Item>
                )
              })}
            </Descriptions>
          )
        })}
      </div>
      {visible && (
        <Modal
          title={'获取相关信息'}
          visible={visible}
          onCancel={() => {
            setVisible(false)
            setStepOneTitle(() => <span>正在从《WBS对照表》获取 项目名称、利润中心编码、收入确认方式...</span>)
            setStepThreeTitle(() => <span>正在从《合同信息》获取 合同金额、合同开工、合同类型等信息</span>)
          }}
          footer={null}
        >
          <p>{stepOneTitle}</p>
          <p>{stepThreeTitle}</p>
          <Row justify='space-between'>
            <Col></Col>
            <Col>
              <Button type={'primary'} disabled={isNext} onClick={() => {
                callback(callbackItem, contractCountStr);
              }}>
                下一步
              </Button>
            </Col>
          </Row>
        </Modal>
      )}
    </div>
  )
}

export default ShowContractInfo;
