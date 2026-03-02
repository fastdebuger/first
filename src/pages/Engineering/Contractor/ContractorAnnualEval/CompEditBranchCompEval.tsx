import React, { useState, useEffect } from 'react';
import { Alert, Button, Card, message, Table, InputNumber,Tabs } from 'antd';
import { connect } from 'umi';
import { BasicFormColumns, SingleTable, BasicTableColumns } from 'yayang-ui';
import { useIntl, Dispatch } from 'umi';
import { ErrorCode, CURR_USER_NAME } from '@/common/const';
import { configColumns } from './columns';
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
 * 公司考核信息组件
 * @constructor
 */
const CompEditBranchCompEval: React.FC<EditBranchCompEvalProps> = (props) => {
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
  // 获取分公司及的数据，主要用于让用户查看
  const fetchEachProjectList = () => {
    dispatch({
      type: 'appraiseInfo/getBranchCompScore',
      payload: {
        sort: 'project_score',
        order: 'asc',
        id: selectedRows?.id,
        belong_year: selectedRows?.belong_year
      },
      callback: (res: any) => {
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
        is_publish: 1, // 只获取已发布的数据
        contractor_name: selectedRows?.contractor_name || null,
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
  * 处理打开模态框的操作
  */
  const handleOpen = () => {
    // 更新模态框的key值，确保每次打开都创建新的实例
    setModalKey((k) => k + 1);
    setVisible(true);
  };

  /**
 * 处理取消操作的回调函数
 */
  const handleCancel = () => {
    setVisible(false);
  };

  /**
  * 处理成功回调的函数
  */
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
          title: "scheduleManagement.comp_score",
          subTitle: "公司考核得分",
          dataIndex: "comp_score",
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
              const minScore = getMinProjectScore();

              if (minScore !== null && value > minScore) {
                setErrorMessage(`您输入的值不能大于最低分公司得分 ${minScore}`);
              } else {
                form.setFieldsValue({
                  comp_score: value
                });
              }
            }
            return (
              <>
                <InputNumber
                  value={selectedRows?.comp_score || undefined}
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
        'comp_principal',
        'comp_reason',
      ])
      .needToDisabled([
        'comp_principal',
        'contractor_name',
        'contractor_manager',
        'belong_year',
      ])
      .needToRules([
        'comp_score',
        'comp_principal',
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
        'branch_comp_name',
        "project_score",
      ])
      .noNeedToSorterIcon([
        'belong_year',
        'branch_comp_name',
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
        公司考核评价
      </Button>
      <CrudAddModal
        title="填写公司考核信息"
        visible={visible}
        onCancel={handleCancel}
        key={modalKey}
        initialValue={{
          ...selectedRows,
          comp_principal: CURR_USER_NAME,
          contractor_name: selectedRows?.contractor_name,
          contractor_manager: selectedRows?.contractor_manager,
          belong_year: selectedRows?.belong_year,
        }}
        columns={getFormColumns()}
        onCommit={(values: any) => {
          return new Promise((resolve) => {
            dispatch({
              type: 'appraiseInfo/compEvaluate',
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
            <Tabs.TabPane tab={selectedRows?.belong_year + '年各分公司最低得分情况'} key="1">
              <Alert
                type="warning"
                style={{ width: '100%', marginBottom: '16px' }}
                message={`公司得分不得大于分公司最低分数，并且需要先为各个分公司评分!`}
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

export default connect()(CompEditBranchCompEval);

