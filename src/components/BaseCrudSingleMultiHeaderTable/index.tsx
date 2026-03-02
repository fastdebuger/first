import React, { useState, useImperativeHandle, useRef } from 'react';
import type { ReactNode } from 'react';
import { SingleMultiHeaderTable } from 'yayang-ui';
import { connect } from 'umi';
import { useIntl } from 'umi';
import { message, Spin } from 'antd';
import { isDateFormatOrTimeStamp } from '@/utils/utils-date';

const { CrudQueryTable } = SingleMultiHeaderTable;

interface IBaseSingleMultiHeaderTable {
  cRef?: any,
  rowKey: string,
  type: string,
  tableColumns: any[],
  tableTitle?: string,
  tableSortOrder: { sort: string, order: string },
  buttonToolbar?: () => any[],
  selectedRowsToolbar?: any,
  importType?: string,
  exportType?: string,
  rowSelection?: any,
  tableDefaultField?: object,// 这个过滤是在noFilter上 不在下面的过滤中的字段
  tableDefaultFilter?: [{ Key: string, Val: string | undefined, Operator?: string }],// 这个过滤是filter:[{Key:'' Val:'' Operator:''}]
  renderSelfToolbar?: any
  noPage?: boolean; // 不需要分页查询
  height?: string | number; //组件高度
  scroll?: {
    x?: number | string;
    y?: number | string;
  }; //表格内的高度
  footer?: () => ReactNode;
  moduleCaption?: any //下载模版和导出名称
  renderDropMenuToolbar?: any
  AmountToSumFn?: (total: string) => void;
  exportColumns?: {
    DataIndex: string;
    Title: string;
  }[];//特殊导出列配置
  summary?: (record: any) => ReactNode;//总结栏

}

const BaseCrudSingleMultiHeaderTable: React.FC<IBaseSingleMultiHeaderTable> = (props: any) => {
  const {
    cRef,
    rowKey = 'key',
    type,
    dispatch,
    tableColumns,
    tableTitle,
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
    height = 'calc(100vh - 159px)',
    scroll = { y: 'calc(100vh - 339px)' },
    footer,
    moduleCaption = '',
    renderDropMenuToolbar,
    AmountToSumFn,
    exportColumns = [],
    summary,
    sumCols = []
  } = props;

  const actionRef: any = useRef();
  const { formatMessage } = useIntl();
  const [exportField, setExportField] = useState({});
  const [spinLoading, setSpinLoading] = useState(false);
  const [spinTip, setSpinTip] = useState('Loading...');
  const [rowsData, setRowsData] = useState<any>({});

  const getTableColumns = (configColumns: any[]) => {
    configColumns.forEach((item: any) => {
      item.title = item.title ? formatMessage({ id: item.title }) : item.title;
      if (item.children) {
        getTableColumns(item.children);
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
    return configColumns;
  };

  /**
   * 通过此方法
   * 暴漏给父组件 可操作的函数
   */
  useImperativeHandle(cRef, () => {
    return {
      // reloadTable 是暴露给父组件的用于刷新Table表格的方法
      importFile: (file: any, funcCode: string, success: () => void) => {
        return importFile(file, funcCode, success);
      },
      exportFile: () => {
        exportFile();
      },
      downloadImportFile: (funcCode: string) => {
        downloadImportFile(funcCode);
      },
      reloadTable: (filters?: { Key: string, Val: string, Operator?: string }[], noFilters?: object) => {
        actionRef.current.reloadTable(filters, noFilters);
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
    };
    if (!noPage) {
      Object.assign(payload, {
        offset: page.offset,
        limit: page.limit,
      });
    }

    const response = await dispatch({
      type,
      payload,
    });
    if (AmountToSumFn) AmountToSumFn(response.sum)
    setRowsData(response)
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
          Title: column.title,
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
  const exportFile = () => {
    if (!exportType && !type) {
      message.warn('导出的请求URL未配置');
      return;
    }
    setSpinLoading(true);
    setSpinTip('导出中......');

    // 因为这个组件是多级表头组件 配置列存在多级表头 所以要转成一维数组
    function getExportColumns(arr: any) {
      let exportColumns: any[] = [];
      arr.forEach((item: any) => {
        if (!item.children || item.children.length === 0) {
          exportColumns.push(item);
        } else {
          const childArr = getExportColumns(item.children);
          exportColumns = [...exportColumns, ...childArr];
        }
      });
      return exportColumns;
    }
    const arr = getExportColumns(tableColumns);

    const exCols = exportColumns ? exportColumns : getFilterExportColumns(arr);
    dispatch({
      type: exportType || type,
      payload: {
        op: 'xlsx',
        exType: '1',
        exColBasis: JSON.stringify(exCols),
        moduleCaption: moduleCaption ? moduleCaption : 'xlsx',
        ...exportField,
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
   * @param funcCode
   * @param success
   */
  const importFile = (file: any, funcCode: string, success: () => void) => {
    if (!importType) {
      message.warn('导入的请求URL未配置');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('funcCode', funcCode);
    return new Promise<boolean>(resolve => {
      dispatch({
        type: importType,
        payload: formData,
        callback: (res: any) => {
          resolve(true);
          if (res && res.errCode === 0) {
            actionRef.current.reloadTable();
            message.success('上传成功');
            success();
          }
        },
      });
    });
  };

  /**
   * 下载导入模板
   * @funcCode
   */
  const downloadImportFile = (funcCode: string) => {
    dispatch({
      type: 'common/downloadImportFile',
      payload: {
        funcCode: funcCode,
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

  const requestCellFilter = async (page: any, filters: any, sorter: any, col: any, noFilter) => {

    // 列表查询 加此字段
    setExportField({
      ...sorter,
      ...noFilter,
      filter: JSON.stringify(filters),
    });
    const payload = {
      ...sorter,
      ...noFilter,
      op: 'colVal',
      opColName: col.dataIndex,
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
    return {
      data: response.rows || [],
      total: response.total || 0,
      status: 'success',
    };
  };

  const findSumTitle = (val: any) => {
    const search = (data: any[]): any => {
      for (const item of data) {
        if (item.dataIndex === val) {
          return item.title;
        }
        if (item.children && item.children.length > 0) {
          const result = search(item.children);
          if (result) return result;
        }
      }
      return null;
    };
    return search(tableColumns || []);
  };

  const getFootRender = () => {
    if (rowsData.sum && rowsData.total) {
      return (
        <div>
          <span>总条数 : </span><span>{rowsData.total}</span>
          {sumCols.map((item: any) => (
            <>
              <span
                style={{ marginLeft: 10 }}
              >
                {findSumTitle(item) ? formatMessage({ id: findSumTitle(item) }) : '-'} :
              </span>
              <span>{rowsData.sum[item]}</span>
            </>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <Spin spinning={spinLoading} tip={spinTip}>
      <CrudQueryTable
        cRef={actionRef}
        height={height}
        scroll={scroll}
        tableTitle={tableTitle}
        columns={getTableColumns(tableColumns)}
        headerConfig={{
          ...tableSortOrder,
          rowKey: rowKey,
        }}
        requestHeader={requestHeader}
        buttonToolbar={buttonToolbar}
        selectedRowsToolbar={selectedRowsToolbar}
        onResizeStop={(type, changeColumns) => {
          console.log('-------onResizeStop-----changeColumns', type, changeColumns);
        }}
        onSettingColumnsChange={(type, changeColumns) => {
          console.log('-------onSettingColumnsChange-----changeColumns', type, changeColumns);
        }}
        rowSelection={rowSelection}
        tableDefaultField={tableDefaultField}
        tableDefaultFilter={tableDefaultFilter}
        renderSelfToolbar={renderSelfToolbar}
        footer={rowsData && rowsData.sum ? getFootRender : footer}
        requestCellFilter={requestCellFilter}
        renderDropMenuToolbar={renderDropMenuToolbar}
        noSettingIcon={false}
        summary={summary}
      />
    </Spin>
  );
};

export default connect()(BaseCrudSingleMultiHeaderTable);
