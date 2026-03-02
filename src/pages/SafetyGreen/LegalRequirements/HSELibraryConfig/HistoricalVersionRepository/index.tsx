import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import BaseCurdSingleTable from '@/components/BaseCrudSingleTable';
import { BasicTableColumns } from 'yayang-ui';
import { configColumns } from '../columns';
import { getUrlCrypto } from '@/components/HuaWeiOBSUploadSingleFile';

/**
 * 历史版本库
 * @param props
 * @constructor
 */
const HistoricalVersionRepositoryModal: React.FC<any> = (props: any) => {
  const { selectedRows } = props;
  const [visible, setVisible] = useState(false)

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols
      .initTableColumns([
        "RowNumber",
        "wbs_name",
        'law_name',
        "element",
        "law_level_name",
        "keywords",
        "version_no",
        "publish_content",
        "publish_date_str",
        "effective_date_str",
        "create_by_name",
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
        // 'audit_by_name',
      ])
      .noNeedToFilterIcon(["RowNumber"])
      .noNeedToSorterIcon(["RowNumber"])
      .needToExport([
        "RowNumber",
        "wbs_name",
        'law_name',
        "element",
        "law_level_name",
        "keywords",
        "version_no",
        "publish_content",
        "publish_date_str",
        "effective_date_str",
        "create_by_name",
        "create_date_str",
        'file_path',
        // "audit_status_name",
      ]);
    return cols.getNeedColumns();
  };


  return (
    <>
      <Button
        type="default"
        onClick={() => setVisible(true)}
      >
        版本记录
      </Button>
      {
        visible && (
          <Modal
            title={'查看'}
            visible={visible}
            onCancel={() => setVisible(false)}
            width={'100vw'}
            footer={null}
            style={{
              top: 0,
              maxWidth: '100vw',
              paddingBottom: 0,
              maxHeight: '100vh',
              overflow: 'hidden',
            }}
            bodyStyle={{
              height: 'calc(100vh - 56px)',
              overflow: 'hidden'
            }}
          >
            <BaseCurdSingleTable
              rowKey="RowNumber"
              tableTitle="操作记录台账"
              funcCode={'queryAllLawList1'}
              type="LegalRequirements/queryAllLawList"
              importType="LegalRequirements/queryAllLawList"
              tableColumns={getTableColumns()}
              tableSortOrder={{ sort: 'id', order: 'desc' }}
              tableDefaultField={{ main_id: selectedRows.main_id }}
              buttonToolbar={undefined}
              selectedRowsToolbar={undefined}
              rowSelection={null}
              tableScroll={{ y: 600 }}
              // tableDefaultFilter={
              //   [
              //     {
              //       Key: 'main_id',
              //       Val: selectedRows.main_id,
              //       Operator: '='
              //     }
              //   ]
              // }
            />
          </Modal>
        )
      }
    </>
  );
};

export default HistoricalVersionRepositoryModal;

