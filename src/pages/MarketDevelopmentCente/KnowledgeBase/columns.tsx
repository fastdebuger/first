import { KNOWLEDGE_BASE_DATA_TYPE } from "@/common/const";

export const configColumns = [
  {
    title: "knowledgeBase.data_type",
    subTitle: "类型",
    dataIndex: "data_type",
    width: 160,
    align: "center",
    render: (text: string) => {
      // @ts-ignore
      return text ? KNOWLEDGE_BASE_DATA_TYPE[text] : '-'
    }
  },
  {
    title: "knowledgeBase.data_type",
    subTitle: "类型",
    dataIndex: "data_name",
    width: 160,
    align: "center",
  },
  {
    title: "knowledgeBase.file_path",
    subTitle: "附件",
    dataIndex: "detailList",
    width: 160,
    align: "center",
  },
  {
    title: "knowledgeBase.file_path1",
    subTitle: "附件1",
    dataIndex: "file_path1",
    width: 160,
    align: "center",
  },
  {
    title: "knowledgeBase.file_path2",
    subTitle: "附件2",
    dataIndex: "file_path2",
    width: 160,
    align: "center",
  },
  {
    title: "knowledgeBase.file_path3",
    subTitle: "附件3",
    dataIndex: "file_path3",
    width: 160,
    align: "center",
  },
  {
    title: "knowledgeBase.file_path4",
    subTitle: "附件4",
    dataIndex: "file_path4",
    width: 160,
    align: "center",
  },
  {
    title: "knowledgeBase.file_path5",
    subTitle: "附件5",
    dataIndex: "file_path5",
    width: 160,
    align: "center",
  },
  {
    title: "knowledgeBase.remark",
    subTitle: "备注",
    dataIndex: "remark",
    width: 160,
    align: "center",
  },
  {
    title: "knowledgeBase.id",
    subTitle: "序号",
    dataIndex: "main_id",
    width: 160,
    align: "center",
    render: (_, __, index) => index + 1
  },
  {
    title: "knowledgeBase.RowNumber",
    subTitle: "序号",
    dataIndex: "RowNumber",
    width: 160,
    align: "center",
  },
];
