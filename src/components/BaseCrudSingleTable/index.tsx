import React, { useState, useImperativeHandle, useRef, useEffect, ReactNode } from 'react';
import { SingleTable } from 'yayang-ui';
import { useIntl, connect } from 'umi';
import { message, Spin } from "antd";
import { isDateFormatOrTimeStamp } from "@/utils/utils-date"
import { deepArr } from '@/utils/utils-array';
import { PRICE_ARRAY } from '@/common/const';

const { CrudQueryTable } = SingleTable;

interface IBaseCrudSingleTable {
  cRef?: any,
  rowKey: string,
  type: string,
  tableColumns: any[],
  tableTitle?: string,
  tableSortOrder: { sort: string, order: string },
  buttonToolbar?: (tableRef: any, selectedRows: any[]) => [];
  selectedRowsToolbar?: any,
  importType?: string,
  exportType?: string,
  rowSelection?: any,
  tableDefaultField?: object,// 这个过滤是在noFilter上 不在下面的过滤中的字段
  tableDefaultFilter?: any,// 这个过滤是filter:[{Key:'' Val:'' Operator:''}]
  renderSelfToolbar?: any
  noPage?: boolean; // 不需要分页查询
  funcCode?: string,
  height?: any,
  scroll?: any,
  defaultPageSize?: number,
  moduleCaption: any,
  /** 全部 右侧的下拉菜单 */
  renderDropMenuToolbar?: (reloadTable?: (filters?: {
    Key: string,
    Val: string,
    Operator?: string
  }[], noFilters?: any) => void) => ReactNode;
  footer?: any;
  sumCols?: string[];
  onDataSourceChange?: (dataSource: any) => void; // 监听DataSource变化
  rowClassName?: (record: any, index: number) => string;
  handleResponse?: (data: { rows: any[], total: number }) => void;
}

function formatNumber(v: any): string {
  const num = Number(v);
  if (!Number.isFinite(num)) return v ?? "";
  return num.toLocaleString("zh-CN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const BaseCrudSingleTable: React.FC<IBaseCrudSingleTable> = (props: any) => {
  const {
    cRef,
    rowKey = 'key',
    type,
    dispatch,
    tableColumns,
    tableTitle,
    tableDefaultFields,
    tableSortOrder = { sort: 'form_no', order: 'asc' },
    buttonToolbar = () => [],
    selectedRowsToolbar = () => [],
    importType = '',
    exportType = '',
    rowSelection,
    tableDefaultField = {},// 这个过滤是在noFilter上 不在下面的过滤中的字段
    tableDefaultFilter = [],// 这个过滤是filter:[{Key:'' Val:'' Operator:''}]
    renderSelfToolbar = undefined,
    noPage = false,
    funcCode = '',
    height = 'calc(100vh - 350px)',
    scroll = { y: 'calc(100vh - 335px)' },
    defaultPageSize = 20,
    moduleCaption = '',
    renderDropMenuToolbar = () => <></>,
    renderSelfHeader = undefined,
    footer = undefined,
    sumCols = [],
    onDataSourceChange = undefined,
    rowClassName,
    handleResponse,
  } = props;

  const actionRef: any = useRef();
  const { formatMessage } = useIntl();
  const [exportField, setExportField] = useState({});
  const [spinLoading, setSpinLoading] = useState(false);
  const [spinTip, setSpinTip] = useState('Loading...');
  const [settingCols, setSettingCols] = useState<any>([]);
  const [settingConfig, setSettingConfig] = useState<any>({});
  const [totalNum, setTotalNum] = useState<any>(0);
  const [rowsData, setRowsData] = useState<any>({});
  const userCode = localStorage.getItem('auth-default-userCode')

  const getTableColumns = () => {
    tableColumns.forEach((item: any) => {
      item.title = formatMessage({ id: item.title })
      if (PRICE_ARRAY.includes(item.dataIndex)) {
        Object.assign(item, {
          render: (text: any) => {
            if (!text) {
              return <span>0</span>;
            }
            return <span>{formatNumber(text)}</span>;
          },
        });
      }
      if (item.valueType && item.valueType === 'dateTs') {
        Object.assign(item, {
          render: (text: any) => {
            if (!text) {
              return <span>--</span>;
            }
            return <span>{isDateFormatOrTimeStamp(text, item.format)}</span>;
          },
        });
      }
    });
    return tableColumns;
  }


  const fetchSettingCol = () => {
    dispatch({
      type: 'user/queryColViewConfig',
      payload: {
        sort: 'user_code',
        order: 'asc',
        filter: JSON.stringify([
          { Key: 'func_code', Val: funcCode, Operator: '=' },
          { Key: 'user_code', Val: userCode, Operator: '=' },
        ]),
      },
      callback: (res: any) => {
        if (res.rows && res.rows.length > 0) {
          setSettingConfig(res.rows[0]);
        } else {
          // 没查询出配置 赋值为空，激活useEffect的使用
          setSettingConfig({
            json_layout1: '[]',
            json_layout2: '[]',
            json_layout3: '[]'
          });
        }
      }
    })
  }

  useEffect(() => {
    if (settingConfig) {
      const columns = getTableColumns();
      let jsonStr = '';
      try {
        jsonStr = settingConfig.json_layout;
        if (jsonStr && jsonStr != '[]') { // 后台返回的数据有可能是空数组
          const jsonObj = JSON.parse(jsonStr);
          // console.log('------config 0 jsonObj', jsonObj);
          const deepColumns = deepArr(columns);
          const resCols: any[] = jsonObj.changeColumns;
          // console.log('-------resCols', resCols)
          // 第一步 存储最新的columns里的dataIndex 因为可能会出现后期多加列 或者 删除列的操作
          const originDataIndexCols = deepColumns.map(col => col.dataIndex);
          // console.log('-----------originDataIndexCols', originDataIndexCols);
          // 第二步 需要判断后台存储的配置列是否都在最新的columns里
          const filterExistCols = resCols.filter(col => originDataIndexCols.includes(col.key));
          // console.log('-----------filterExistCols', filterExistCols);
          // 第三步 过滤出 最新的columns不存在后台配置的列（比如 新增的列 要筛选出来）
          const filterExistColKeys = filterExistCols.map(col => col.key);
          const filterNoExistInResCols = deepColumns.filter(col => !filterExistColKeys.includes(col.dataIndex));
          // console.log('-----------filterNoExistInResCols', filterNoExistInResCols);
          // 第四部 将新增加的列 追加到 配置列中
          const deepCols = deepArr(filterExistCols);
          if (filterNoExistInResCols.length > 0) {
            filterNoExistInResCols.forEach(col => {
              const findIndex = filterExistCols.findIndex(fc => fc.key === col.upDataIndex);
              if (findIndex > -1) {
                deepCols.splice(findIndex + 1, 0, { ...col });
              }
            })
          }
          const result: any = [];
          deepCols.forEach(s => {
            const findObj = deepColumns.find(c => c.key === s.key);
            if (findObj) {
              Object.assign(findObj, s);
              result.push(findObj)
            }
          });
          console.log('------result', result);
          console.log('-----------columns', columns);
          setSettingCols(result);
        } else {
          // console.log('------no config 1', columns);
          setSettingCols(columns.sort((a, b) => a.serial_no - b.serial_no))
        }
      } catch (e) {
        // console.log('------no config 2', columns);
        setSettingCols(columns.sort((a, b) => a.serial_no - b.serial_no))
      }
    }
  }, [settingConfig]);

  const saveColViewConfig = (type: string, config: any) => {
    setSpinLoading(true)
    dispatch({
      type: 'user/saveColViewConfig',
      payload: {
        func_code: funcCode,
        user_code: userCode,
        json_layout: JSON.stringify(config || []),
      },
      callback: (res: any) => {
        if (res.errCode === 0) {
          message.success('配置列成功');
          fetchSettingCol();
          setSpinLoading(false);
        } else {
          message.warn('配置列失败');
          setSpinLoading(false);
        }

      }
    })
  }

  useEffect(() => {
    fetchSettingCol()
  }, [])

  /**
   * 通过此方法
   * 暴漏给父组件 可操作的函数
   */
  useImperativeHandle(cRef, () => {
    return {
      // reloadTable 是暴露给父组件的用于刷新Table表格的方法
      importFile: (file: any, funcCodes: string, callback: (v: any) => void, formData?: any,) => {
        return importFile(file, funcCodes, callback, formData);
      },
      exportFile: (exportPayload:any) => {
        exportFile(exportPayload);
      },
      downloadImportFile: (funcCodes: string) => {
        downloadImportFile(funcCodes);
      },
      reloadTable: (filters?: { Key: string, Val: string, Operator?: string }[], noFilters?: object) => {
        if (actionRef.current) {
          actionRef.current.reloadTable(filters, noFilters);
        }
      },
    };
  });

  const requestHeader = async (page: any, filters: any, sorter: any, noFilters: any) => {
    // 列表查询 加此字段
    setExportField({
      ...sorter,
      filter: JSON.stringify(filters),
      ...noFilters,
    });
    const payload = {
      ...sorter,
      filter: JSON.stringify(filters),
      ...noFilters,
      sumCols: JSON.stringify(sumCols),
      // identityCols: JSON.stringify(identityCols),
    }
    if (!noPage) {
      Object.assign(payload, {
        offset: page.offset,
        limit: page.limit,
      })
    }
    const response = await dispatch({
      type,
      payload
    });
    setTotalNum(response.total)
    setRowsData(response)
    // 通知父组件数据已更新
    if (onDataSourceChange) {
      onDataSourceChange(response);
    }

    if (handleResponse) {
      handleResponse(response)
    }
    return {
      data: response.rows || [],
      total: response.total || 0,
      status: 'success',
    };
  };

  const requestCellFilter = async (page: any, filters: any, sorter: any, col: any, noFilters: any) => {

    // if(callBackFilterDataFn) callBackFilterDataFn(col)
    // 列表查询 加此字段
    setExportField({
      ...sorter,
      filter: JSON.stringify(filters),
    });
    //filters没带过来为空
    const payload = {
      ...sorter,
      op: 'colVal',
      opColName: col.dataIndex,
      ...noFilters,
      filter: JSON.stringify(filters),
    }
    if (!noPage) {
      Object.assign(payload, {
        offset: page.offset,
        limit: page.limit,
      })
    }
    const response = await dispatch({
      type,
      payload
    });
    setTotalNum(response.total || 0)

    return {
      data: response.rows || [],
      total: response.total || 0,
      status: 'success',
    };
  };

  /**
   * 导出的列过滤 和 列配置
   * 因为导出需要的格式是：DataIndex, Title的格式 需要转换一下
   * @param columns
   */
  const getFilterExportColumns = (columns: any[]) => {
    const arr: any[] = [];
    columns.forEach((column) => {
      if (column.export) {
        const obj = {
          DataIndex: column.dataIndex,
          Title: formatMessage({ id: column.title }),
        };
        arr.push(obj);
      }
    });
    return arr;
  };

  /**
   * exType 1: 单据明细  0：单据平铺
   * 导出
   */
  const exportFile = (exportPayload={}) => {
    if (!exportType && !type) {
      message.warn('导出的请求URL未配置');
      return;
    }
    setSpinLoading(true);
    setSpinTip('导出中......');
    const exCols = getFilterExportColumns(tableColumns);
    dispatch({
      type: exportType || type,
      payload: {
        op: 'xlsx',
        exType: '1',
        moduleCaption: moduleCaption,
        exColBasis: JSON.stringify(exCols),
        ...exportField,
        ...exportPayload
      },
      callback: (response: any) => {
        setSpinLoading(false);
        if (response && response.result && response.result.fileUrl) {
          window.open(response.result.fileUrl, '_blank');
        } else if (response && response.fileUrl) {
          window.open(response.fileUrl, '_blank');
        } else {
          message.error('生成导出文件有误，请稍后再试');
        }
      },
    });
  };

  /**
   * 导入
   * @param file
   * @param funcCodes
   * @param funcCodes
   * @param callback
   * @param formData
   */
  const importFile = (file: any, funcCodes: string, callback: (v: any) => void, formData?: any,) => {
    if (!importType) {
      message.warn('导入的请求URL未配置');
      return;
    }
    const _formData = formData || new FormData();
    _formData.append('file', file);
    _formData.append('funcCode', funcCodes);
    return new Promise<boolean>(resolve => {
      dispatch({
        type: importType,
        payload: _formData,
        callback: (res: any) => {
          resolve(true);
          if (callback) {
            callback(res)
          }
          if (res && res.errCode === 0) {
            actionRef.current.reloadTable();
            message.success('上传成功');
          }
        }
      })
    })
  }

  /**
   * 下载导入模板
   * @funcCode
   */
  const downloadImportFile = (code: string) => {
    dispatch({
      type: 'qualitySafetyInspection/getTemplateZyyjIms',
      payload: {
        funcCode: code,
        moduleCaption: moduleCaption ? `${moduleCaption}模板` : '',
      },
      callback: (response: any) => {
        if (response && response.result && response.result.fileUrl) {
          window.open(response.result.fileUrl, '_self');
        } else if (response && response.fileUrl) {
          window.open(response.fileUrl, '_self');
        }
      },
    });
  };

  const findSumTitle = (val: any) => {
    return tableColumns.find((item: any) => item.dataIndex === val).title
  }

  const getFootRender = () => {
    if (rowsData.sum && rowsData.total) {
      return (
        <div>
          <span>总条数 : </span><span>{rowsData.total}</span>
          {sumCols.map((item: any) => (
            <>
              <span
                style={{ marginLeft: 10 }}>{formatMessage({ id: findSumTitle(item) })} : </span><span>{rowsData.sum[item]}</span>
            </>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Spin spinning={spinLoading} tip={spinTip}>
      <div id={'CrudQueryTable'}>
        {settingCols.length > 0 &&
          <CrudQueryTable
            rowClassName={rowClassName}
            cRef={actionRef}
            height={height}
            tableTitle={tableTitle}
            columns={settingCols}
            headerConfig={{
              ...tableSortOrder,
              rowKey: rowKey,
            }}
            renderSelfHeader={renderSelfHeader}
            requestHeader={requestHeader}
            requestCellFilter={requestCellFilter}
            buttonToolbar={buttonToolbar}
            selectedRowsToolbar={selectedRowsToolbar}
            onResizeStop={(types: string, config: any) => {
              saveColViewConfig(types, config)
            }}
            onSettingColumnsChange={(types: string, config: any) => {
              saveColViewConfig(types, config)
            }}
            onResetSettingColumnsChange={(type: any, config: any, getConfigCols: any) => {
              const columns = getTableColumns();
              const changeColumns = getConfigCols(columns);
              Object.assign(config, {
                changeColumns
              })
              saveColViewConfig(type, config);
            }}
            footer={rowsData && rowsData.sum ? getFootRender : footer}
            rowSelection={rowSelection}
            tableDefaultField={tableDefaultField}
            tableDefaultFilter={tableDefaultFilter}
            renderSelfToolbar={renderSelfToolbar}
            scroll={scroll}
            defaultPageSize={defaultPageSize}
            renderDropMenuToolbar={renderDropMenuToolbar}
          />
        }
      </div>
    </Spin>
  )
}

export default connect()(BaseCrudSingleTable);
