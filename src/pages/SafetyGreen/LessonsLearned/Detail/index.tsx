import React from "react";
import { Button } from "antd";
import { connect } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { configColumns } from "../columns";
import { getUrlCrypto } from "@/components/HuaWeiOBSUploadSingleFile";
const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 经验分享详情
 * @param props
 * @constructor
 */
const ExperienceDetail: React.FC<any> = (props) => {
  const { open, onClose, selectedRecord, saveTouchViewsInfo } = props;

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      'title',
      'dict_name',
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
      "audit_status_name",
    ])
      .needToFixed([
        {
          value: "audit_status_name",
          fixed: "right"
        }
      ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
    return cols.getNeedColumns();
  }


  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="main_id"
        title="经验分享"
        columns={getTableColumns()}
        open={open}
        onClose={onClose}
        selectedRecord={selectedRecord}
        buttonToolbar={undefined}
      >
        <div>
          发布内容：{selectedRecord['publish_content']}
        </div>
      </CrudQueryDetailDrawer>
    </>
  );
};

export default connect()(ExperienceDetail);
