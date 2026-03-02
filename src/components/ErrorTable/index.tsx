import React, {useEffect, useRef} from 'react';
import {connect, useIntl} from 'umi';
import {Button} from "antd";
import BaseFormSearchTable from "@/components/BaseFormSearchTable";

/**
 *  导入失败显示的表格
 * @param props
 * @constructor
 */
const ErrorTable: React.FC<any> = (props: any) => {
  const childRef: any = useRef();
  const {type, rowKey, tableColumns, tableSortOrder, tableDefaultField, operator} = props;
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const {formatMessage} = useIntl();
  // 定义按钮
  const toolBarRender = () => {
    return [
      <Button
        key={7}
        size="middle"
        type="primary"
        onClick={() => {
          // @ts-ignore
          childRef.current.exportFile(1, tableColumns);
        }}
      >
        {formatMessage({id: 'common.export'})}
      </Button>,
    ];
  };

  useEffect(() => {
    if (childRef) {
      childRef.current.reloadTable();
    }
  }, [tableDefaultField])
  return (
    <>
      <BaseFormSearchTable
        type={type}
        cRef={childRef}
        rowKey={rowKey}
        formColumns={[]}
        exportType={type}
        tableColumns={tableColumns}
        tableSortOrder={tableSortOrder}
        operator={operator}
        toolBarRender={toolBarRender}
        tableDefaultField={tableDefaultField}
      />
    </>
  );
};
export default connect()(ErrorTable);
