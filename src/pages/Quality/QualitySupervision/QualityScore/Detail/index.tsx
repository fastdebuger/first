import React from "react";
import { Button } from "antd";
import { connect } from "umi";
import { BasicTableColumns, SingleTable } from "yayang-ui";
import { WBS_CODE } from "@/common/const";
import BaseCurdSingleTable from "@/components/BaseCrudSingleTable";
import { configColumns } from "../../ScoringPersonnel/columns";
import { getUrlCrypto } from "@/components/HuaWeiOBSUploadSingleFile";

const { CrudQueryDetailDrawer } = SingleTable;

/**
 * 记分人员信息详情
 * @param props
 * @constructor
 */
const ScoringPersonnelDetail: React.FC<any> = (props) => {
  const { open, onClose, actionRef, authority } = props;

  const getTableColumns = () => {
    const cols = new BasicTableColumns(configColumns);
    cols.initTableColumns([
      "RowNumber",
      "branch_comp_name",
      'project_name',
      "dept_name",
      "person_name",
      "gender",
      // "birth_date",
      // "position_level_name",
      // "title_level_name",
      "person_code",
      "scoring_object_name",
      "scoring_score",
      "scoring_reason",
      "penalty_amount",
      "contractor_penalty_amount",
      "block_situation",
      "nature_problem",
      "problem_description",
      {
        title: 'scoringPersonnel.penalty_voucher',
        dataIndex: 'penalty_voucher',
        subTitle: '罚款凭证',
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
      .noNeedToFilterIcon(["RowNumber",])
      .noNeedToSorterIcon(["RowNumber",])
      .needToExport([
        "RowNumber",
        "branch_comp_name",
        'project_name',
        "dept_name",
        "person_name",
        "gender",
        "person_code",
        "scoring_object_name",
        "scoring_score",
        "scoring_reason",
        "penalty_amount",
        "contractor_penalty_amount",
        "block_situation",
        "nature_problem",
        "problem_description",
        'penalty_voucher',
      ])
    return cols.getNeedColumns();
  }


  return (
    <>
      <CrudQueryDetailDrawer
        rowKey="id"
        title="记分人员信息"
        columns={[]}
        open={open}
        onClose={onClose}
        selectedRecord={{}}
        buttonToolbar={undefined}
      >
        <BaseCurdSingleTable
          cRef={actionRef}
          rowKey="id"
          tableTitle='记分人员信息'
          type="scoringPersonnel/getInfo"
          exportType="scoringPersonnel/getInfo"
          tableColumns={getTableColumns()}
          funcCode={authority + "记分人员信息"}
          tableSortOrder={{ sort: 'id', order: 'desc' }}
          buttonToolbar={undefined}
          selectedRowsToolbar={undefined}
          moduleCaption={"记分人员信息"}
          rowSelection={null}
          tableDefaultFilter={[
            { Key: 'wbs_code', Val: WBS_CODE + "%", Operator: 'like' }
          ]}
        />
      </CrudQueryDetailDrawer>
    </>
  );
};

export default connect()(ScoringPersonnelDetail);
