import React, { useCallback, useRef, useState } from 'react';
import { Button } from "antd";
import { connect } from 'umi';
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { BasicTableColumns } from 'yayang-ui';
import { configColumns } from "./columns";
import ExperienceDetail from "./Detail";
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';
import { HeartTwoTone } from '@ant-design/icons';
import { ErrorCode } from '@yayang/constants';

/**
 * 经验分享
 * @constructor
 */
const ExperiencePage: React.FC<any> = (props) => {
  const { dispatch, route: { authority } } = props;
  const actionRef: any = useRef();
  const [open, setOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);


  /**
   * 处理文件交互
   * @param main_id 文件id
   * @param operation_type 操作类型 
   */
  type IOperationType = 'like' | 'unlike' | 'download' | 'view'
  const saveTouchViewsInfo = useCallback((main_id: string, operation_type: IOperationType) => {
    dispatch({
      type: 'experience/saveTouchViewsInfo',
      payload: {
        main_id,
        operation_type
      },
      callback: (res: any) => {
        if (res.errCode === ErrorCode.ErrOk) {
          if (actionRef.current) {
            actionRef.current.reloadTable();
          }
        }
      },
    });
  }, [])

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      {
        title: 'compinfo.title',
        subTitle: '标题',
        dataIndex: 'title',
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
      'dict_name',
      'publish_content',
      'scene',
      'keywords',
      {
        title: 'HSELegislation.file_path',
        dataIndex: 'file_path',
        subTitle: '文件',
        align: 'center',
        width: 160,
        render: (text: any, record: any) => {
          if (text) {
            return (
              <Button
                onClick={() => {
                  saveTouchViewsInfo(record.main_id, "download")
                  window.open(getUrlCrypto(text))
                }}
                size='small'
                type='link'
              >下载文件</Button>
            )
          }
          return ''
        }
      },
      "create_by_name",
      "update_by_name",
      "audit_date_str",
      "create_date_str",
      // "readCount",
      "downloadCount",
    ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
      .needToFixed([
        {
          value: "likeCount",
          fixed: "right"
        }
      ])
    return cols.getNeedColumns();
  }

  return (
    <div>
      <BaseCurdSingleTable
        cRef={actionRef}
        rowKey="main_id"
        tableTitle='经验分享'
        type="experience/getExpSharingPassAndStatsInfo"
        exportType="experience/getExpSharingPassAndStatsInfo"
        tableColumns={getTableColumns()}
        funcCode={authority + 'getApprovalList11'}
        rowSelection={null}
        tableSortOrder={{ sort: 'main_id', order: 'desc' }}
        buttonToolbar={undefined}
        selectedRowsToolbar={undefined}
      />
      {open && selectedRecord && (
        <ExperienceDetail
          open={open}
          actionRef={actionRef}
          selectedRecord={selectedRecord}
          authority={authority}
          onClose={() => setOpen(false)}
          saveTouchViewsInfo={saveTouchViewsInfo}
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
export default connect()(ExperiencePage);
