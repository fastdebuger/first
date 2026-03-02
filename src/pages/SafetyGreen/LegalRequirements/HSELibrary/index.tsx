import React, { useRef, useState } from 'react';
import { Button } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { configColumns } from "./columns";
import SupplierInfoDetail from "./Detail";
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import { hasPermission } from '@/utils/authority';
import BetchDownLoadButton from '@/components/BetchDownLoadButton';
import { PROP_KEY, WBS_CODE } from '@/common/const';

/**
 * HSE法律法规库
 * @constructor
 */
const SupplierInfoPage: React.FC<any> = (props) => {
  const { route: { authority } } = props;
  const actionRef: any = useRef();
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [needToExport, setNeedToExport] = useState<string[]>([]);

  const tableDefaultFieldRef = useRef<any>({});

  if (PROP_KEY === "subComp") {
    tableDefaultFieldRef.current.up_wbs_code = WBS_CODE;
  }
  
  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      "wbs_name",
      {
        title: 'HSELegislation.law_name',
        subTitle: '法律法规名称',
        dataIndex: 'law_name',
        align: 'center',
        width: 160,
        render: (text: any, record: any) => {
          return (
            <a
              onClick={() => {
                setSelectedRecord(record)
                setOpen(true)
              }}
            >
              {text}
            </a>
          );
        },
      },
      "element",
      "law_level_name",
      "keywords",
      "version_no",
      // "publish_content",
      "publish_date_str",
      "effective_date_str",
      // "create_by_name",
      "create_date_str",
      {
        title: 'HSELegislation.file_path',
        dataIndex: 'file_path',
        subTitle: '文件',
        align: 'center',
        width: 160,
        render: (text: any) => {
          if (text) {
            return (
              <Button
                onClick={() => window.open(getUrlCrypto(text))}
                size='small'
                type='link'
              >下载文件</Button>
            )
          }
          return ''
        }
      },
    ])
      .needToExport(needToExport)
      .noNeedToFilterIcon(['RowNumber'])
      .noNeedToSorterIcon(['RowNumber'])
    return cols.getNeedColumns();
  }


  /**
   * 功能按钮组
   * @param reloadTable
   */
  const renderButtonToolbar = () => {
    return [
      <Button
        key={authority + 'export'}
        style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
        onClick={() => {
          setNeedToExport([
            "RowNumber",
            "wbs_name",
            'law_name',
            "element",
            "law_level_name",
            "keywords",
            "version_no",
            // "publish_content",
            "publish_date_str",
            "effective_date_str",
            "audit_status",
            "audit_by",
            "audit_comment",
            // "create_by_name",
            "create_date_str",
            "audit_date_str",
            'file_path'
          ])
          setTimeout(() => {
            actionRef.current.exportFile({
              filter: JSON.stringify([])
            });
          }, 100)
        }}
      >
        全部导出
      </Button>
    ];
  };

  /**
   * 列操作按钮
   * @param selectedRows
   * @param reloadTable
   */
  const renderSelectedRowsToolbar = (selectedRows: any[]) => {
    if (selectedRows.length > 0) {
      const file_path = selectedRows
        .map(item => item.file_path ? getUrlCrypto(item.file_path) : "")
        .filter(url => url)
        .join(",");
      return [
        <BetchDownLoadButton
          text='附件批量下载'
          file_path={file_path}
        />,
        <Button
          key={authority + 'mulu'}
          style={{ display: hasPermission(authority, '导出') ? 'inline' : 'none' }}
          onClick={() => {
            setNeedToExport(["law_name"])
            if (actionRef.current) {
              setTimeout(() => {
                actionRef.current.exportFile({
                  filter: JSON.stringify([
                    {
                      Key: 'id',
                      Val: `'${selectedRows.map((item) => item.id).join("','")}'`,
                      Operator: 'in'
                    }
                  ])
                });
              }, 100)
            }
          }}
        >
          导出目录
        </Button>

      ]
    }
    return [];
  };

  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="id"
        tableTitle='HSE法律法规库'
        moduleCaption="HSE法律法规库"
        type="LegalRequirements/getNewLawInfo"
        exportType="LegalRequirements/getNewLawInfo"
        tableColumns={getTableColumns()}
        funcCode={authority + "getNewLawInfo112"}
        tableSortOrder={{ sort: 'id', order: 'desc' }}
        // rowSelection={null}
        buttonToolbar={renderButtonToolbar}
        selectedRowsToolbar={renderSelectedRowsToolbar}
        tableDefaultField={tableDefaultFieldRef.current}
        tableDefaultFilter={
          [
            // { Key: 'wbs_code', Val: WBS_CODE + "%", Operator: 'like' },
          ]
        }
      />
      {/* 详情组件 */}
      {open && selectedRecord && (
        <SupplierInfoDetail
          open={open}
          actionRef={actionRef}
          selectedRecord={selectedRecord}
          authority={authority}
          onClose={() => setOpen(false)}
          callbackSuccess={() => {
            if (actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
    </div>
  )
}
export default connect()(SupplierInfoPage);
