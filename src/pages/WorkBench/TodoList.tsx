import { useEffect, useState } from "react"
import { Badge,  Table, Tag } from "antd"
import { connect } from "umi";
import {queryUserToDoInfo, updateUserToDoStatus} from "@/services/approve";
import styles from "./index.css";
import {baseModuleList} from "@/pages/ToDoList/columns";
import {showTS} from "@/utils/utils-date";


const ToDoList = (props: any) => {

  const [loading, setLoading] = useState(false);
  const [todoList, setTodoList] = useState<any[]>([]);
  const [todoTotal, setTodoTotal] = useState<any>(0);

  const userCode = localStorage.getItem('auth-default-userCode');
  const wbsCode = localStorage.getItem('auth-default-wbsCode');


  const fetchList = async () => {
    setLoading(true);
    const res = await queryUserToDoInfo({
      sort: 'is_looked asc,create_time',
      order: 'desc',
      filter: JSON.stringify([
        { "Key": "wbs_code", "Val": wbsCode, "Operator": "=" },
        { "Key": "user_code", "Val": userCode, "Operator": "=" },
        { "Key": "is_looked", "Val": "0", "Operator": "=" }
      ])
    });
    setLoading(false);
    res.rows.forEach((item: any, index: number) => {
      Object.assign(item, {
        no: index + 1,
      });
    });
    setTodoList(res.rows || []);
    setTodoTotal(res.rows.length || 0);
  }
  useEffect(() => {
    fetchList()
  }, [wbsCode, userCode])

  const getSysTag = (item: any) => {
    if (item.systemKey === 'WMMaterial') {
      return (
        <Badge color="green" text={<span style={{ color: 'green' }}>物资系统</span>} />
      )
    }
    return ''
  }

  const renderFuncPath = (code: string) => {
    const tar = baseModuleList.find(item => item.moduleCode === code)
    return tar ? window.location.origin + tar.modulePath : '/'
  }

  const columns: any[] = [
    { title: '序号', dataIndex: 'no', key: 'no', width: 60 },
    { title: '待办任务', dataIndex: 'content', key: 'content', ellipsis: true },
    { title: '来源', dataIndex: 'intro', key: 'intro', width: 120, render: (text: string, record: any) => {
      return (
        <span>{getSysTag(record)}</span>
      )
      } },
    { title: '创建人', dataIndex: 'initiatorName', key: 'initiatorName', width: 100 },
    { title: '创建时间', dataIndex: 'create_time', key: 'create_time', width: 160, render: (text: string, record: any) => {
      return (
        <span>
          {showTS(Number(text || 0), 'YYYY-MM-DD HH:mm')}
        </span>
      )
      } },
    // { title: '截止时间', dataIndex: 'deadline', key: 'deadline', width: 160 },
    // {
    //   title: '工作状态',
    //   dataIndex: 'status',
    //   key: 'status',
    //   width: 100,
    //   render: (status: string) => (
    //     <Tag className={status === 'pending' ? styles.statusPending : styles.statusDone}>
    //       {status === 'pending' ? '未执行' : '执行'}
    //     </Tag>
    //   ),
    // },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (text: string, record: any) => (
        <span className={styles.actionLink}>
          {/*<ExternalLink size={14} />*/}
          <a onClick={async () => {
            await updateUserToDoStatus({
              id: record.id,
              is_looked: '1'
            });
            window.location.href = `${renderFuncPath(record.FuncCode)}?type=todo`
          }}>去处理</a>
        </span>
      ),
    },
  ]

  return (
    <div className={styles.tasksSection}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}><Badge count={todoTotal}>待处理任务</Badge></span>
        {/*<span className={styles.viewMore}>查看更多</span>*/}
      </div>
      <Table
        loading={loading}
        columns={columns}
        dataSource={todoList}
        pagination={{
          pageSize: 5,
        }}
        size="small"
      />
    </div>
  )
}

export default connect()(ToDoList);
