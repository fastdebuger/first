import React, { useState, useEffect } from 'react';
import { Alert, Button, Card, message, Table, InputNumber, Tooltip, Tabs } from 'antd';
import { connect } from 'umi';
import { BasicFormColumns, SingleTable, BasicTableColumns } from 'yayang-ui';
import { useIntl, Dispatch } from 'umi';
import { ErrorCode, CURR_USER_NAME } from '@/common/const';
import { configColumns } from '../columns';
import { getDefaultFiltersEngine } from "@/utils/utils";
import ContractScoreDetail from "@/pages/Engineering/Contractor/ContractorAnnualEval/ContractorModal/ContractScoreDetail"
const { CrudAddModal } = SingleTable;

interface EditBranchCompEvalProps {
  dispatch: Dispatch;
  selectedRows: any;
  onSuccess?: () => void;
  authority?: string;
  style?: React.CSSProperties;
  getInterfaceData?: any;
}

/**
 * 分公司考核信息组件
 * @constructor
 */
const FillBranchCompEval: React.FC<EditBranchCompEvalProps> = (props) => {
  const { dispatch, selectedRows, onSuccess, style = {}, getInterfaceData } = props;
  const { formatMessage } = useIntl();
  const [visible, setVisible] = useState(false);
  const [modalKey, setModalKey] = useState(0);
  const [tableData, setTableData] = useState<any>([]);
  const [errorMessage, setErrorMessage] = useState<any>(null);
  // 控制合同详情的状态
  const [isDetailVisible, setIsDetailVisible] = useState<boolean>(false);
  // 当前选中的数据
  const [currentRecord, setCurrentRecord] = useState<any>(null);
  // 合同表格数据
  const [contractTableData, setContractTableData] = useState<any>([]);
  const [scoreValue,setScoreValue] = useState<number | null>();
  /**
 * 获取每个项目的评分列表数据
 */
  const fetchEachProjectList = () => {
    // 发起获取部门评分数据的请求
    dispatch({
      type: 'appraiseInfo/getDepScore',
      payload: {
        sort: 'project_score',
        order: 'asc',
        id: selectedRows?.id,
        belong_year: selectedRows?.belong_year
      },
      callback: (res: any) => {
        // 处理接口返回数据，当请求成功时更新表格数据
        if (res.errCode === ErrorCode.ErrOk) {
          setTableData(res.rows || []);
        }
      }
    })
    dispatch({
      type: 'appraiseInfo/getScore',
      payload: {
        sort: 'id',
        order: 'asc',
        belong_year: selectedRows?.belong_year || null,
        contractor_name: selectedRows?.contractor_name || null,
        is_publish: 1, // 只获取到已发布的数据
        filter: JSON.stringify(getDefaultFiltersEngine())
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          setContractTableData(res.rows || []);
        }

      }
    })
  }

  useEffect(() => {
    if (visible && selectedRows) {
      fetchEachProjectList();
    }
  }, [visible])
  /**
   * 打开编辑弹框
   * 增加modalKey的值以触发模态框重新渲染
   */
  const handleOpen = () => {
    setModalKey((k) => k + 1);
    setVisible(true);
  };

  // 关闭编辑弹框
  const handleCancel = () => {
    setVisible(false);
  };
  // 点击确定后回退到上级页面
  const handleSuccess = () => {
    setVisible(false);
    if (onSuccess) {
      onSuccess();
    }
  };
  /**
   * 表单列配置引用columns文件
   * @returns 返回一个数组
   */
  const getFormColumns = () => {
    const cols = new BasicFormColumns(configColumns)
      .initFormColumns([
        'contractor_name',
        'contractor_manager',
        'belong_year',
        
        {
          title: "compinfo.contract_out_score",
          subTitle: "分公司考核得分",
          dataIndex: "contract_out_score",
          width: 160,
          align: "center",
          renderSelfForm: (form: any) => {
            const tableDataFalg = tableData.some((item: any) => item.project_score === null);
            // 获取最低项目得分
            const getMinProjectScore = () => {
              const validProjectScores = tableData
                .map((item: any) => item.project_score)
                .filter((score: any) => score !== null && score !== undefined);

              return validProjectScores.length > 0 ? Math.min(...validProjectScores) : null;
            };
            const onChange = (value: any) => {
              // 清除之前的错误信息
              setErrorMessage('');
              // 获取最低项目得分
              const minScore = getMinProjectScore() || 0;
              if (value > minScore) {
                setErrorMessage(`您输入的值不能大于最低项目得分 ${minScore}`);
                form.setFieldsValue({
                  contract_out_score: minScore
                });
                setScoreValue(minScore);
              } else {
                form.setFieldsValue({
                  contract_out_score: value
                });
                setScoreValue(value);

              }
            }
            return (
              <>
                <InputNumber
                  value={scoreValue || selectedRows?.contract_out_score}
                  placeholder='请输入分公司考核得分'
                  disabled={tableDataFalg}
                  style={{ width: '100%' }}
                  onChange={onChange}
                />
                {errorMessage && (
                  <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
                    {errorMessage}
                  </div>
                )}
              </>

            )
          }
        },
        'contract_out_principal', // 分公司考核负责人
        'contract_out_reason',
       
      ])
      .needToDisabled([
        'contract_out_principal',
        'contractor_name',
        'contractor_manager',
        'belong_year',
      ])
      .needToRules([
        'contract_out_score',
        'contract_out_principal', // 分公司考核负责人
      ])
      .getNeedColumns();
    cols.forEach(
      (item: any) => (item.title = formatMessage({ id: item.title }))
    );
    return cols;
  };

  /**
   * 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns)
      .initTableColumns([
        'belong_year',
        'dep_name',
        "project_score",
      ])
      .noNeedToSorterIcon([
        'belong_year',
        'dep_name',
        "project_score",
      ])
      .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  }

  /**
   * 支出合同的 表格列配置引用columns文件
   * @returns 返回一个数组
   */
  const getTableContractColumns = () => {
    const cols = new BasicTableColumns(configColumns)
      .initTableColumns([
        'branch_comp_name',
        'dep_name',
        'contract_out_name', // 合同名称
        "project_score",
        {
          title: "操作",
          subTitle: "操作",
          dataIndex: "action",
          width: 160,
          align: "center",
          render: (_text: any, record: any) => (
            <>
              <Button
                type="link"
                disabled={!record.id}
                onClick={() => {
                  setCurrentRecord(record);
                  setIsDetailVisible(true);
                }}
              >
                查看
              </Button>
            </>
          )
        }
      ])
      .noNeedToSorterIcon([
        'branch_comp_name',
        'dep_name',
        'contract_out_name', // 合同名称
        "project_score",
      ])
      .getNeedColumns();
    cols.forEach((item: any) => (item.title = formatMessage({ id: item.title })));
    return cols;
  }

  return (
    <>
      <Button
        type='link'
        onClick={handleOpen}
        style={style}
      >
        分公司考核评价
      </Button>
      <CrudAddModal
        title="填写分公司考核信息"
        visible={visible}
        onCancel={handleCancel}
        key={modalKey}
        initialValue={{
          ...selectedRows,
          contract_out_principal: CURR_USER_NAME,
          contractor_name: selectedRows?.contractor_name,
          contractor_manager: selectedRows?.contractor_manager,
          belong_year: selectedRows?.belong_year,
        }}
        columns={getFormColumns()}
        onCommit={(values: any) => {
          return new Promise((resolve) => {
            dispatch({
              type: 'appraiseInfo/branchCompEvaluate',
              payload: {
                ...selectedRows,
                ...values,
                id: selectedRows?.id,
                wbs_code: selectedRows?.wbs_code,
              },
              callback: (res: any) => {
                resolve(true);
                if (res.errCode === ErrorCode.ErrOk) {
                  message.success('编辑成功');
                  handleSuccess();
                } else {
                  message.error(res.errMsg || '编辑失败');
                }
              },
            });
          });
        }}
      >
        <Card>
          <Tabs>
            <Tabs.TabPane tab={selectedRows?.belong_year + '年各项目部最低得分情况'} key="1">
              <Alert
                type="warning"
                style={{ width: '100%', marginBottom: '16px' }}
                message={`分公司得分不得大于项目部最低分数，并且需要先为各个项目部评分!`}
              />

              <Table
                size='small'
                columns={getTableColumns()}
                dataSource={tableData}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab={selectedRows?.belong_year + '年各支出合同得分情况'} key="2">
              <Table
                size='small'
                columns={getTableContractColumns()}
                dataSource={contractTableData || []}
              />
            </Tabs.TabPane>
          </Tabs>
        </Card>

      </CrudAddModal>
      
      {isDetailVisible && (
        <ContractScoreDetail
          visible={isDetailVisible}
          currentRecord={currentRecord}
          getInterfaceData={getInterfaceData}
          onCancel={() => setIsDetailVisible(false)}
          callbackSuccess={() => {
            setIsDetailVisible(false);
          }}
        />
      )}
    </>
  );
};

export default connect()(FillBranchCompEval);

