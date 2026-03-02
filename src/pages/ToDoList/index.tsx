import { useEffect, useState } from "react"
import { Badge, Typography, Segmented, Skeleton } from "antd"
import {
  FileTextOutlined,
} from "@ant-design/icons"
import TodoCard from "./TodoCard";
import { connect, useLocation } from "umi";
import { queryUserToDoInfo } from "@/services/approve";

const { Title, Text } = Typography;

const ToDoListManagement = (props: any) => {
  const { route: { authority } } = props
  const url = useLocation() as any;
  const type = url?.query?.type || ''
  
  const [loading, setLoading] = useState(false);
  const [todoList, setTodoList] = useState<any[]>([]);
  const [segmentedValue, setSegmentedValue] = useState<any>(type ? type : 'send');
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
  }, [segmentedValue])




  const renderSendContent = () => {
    return (
      <div style={{
        padding: "16px 16px",
        height: "calc(100vh - 320px)",
        overflowY: "auto"
      }}>
        <Skeleton loading={loading}>
          {todoList.map((item) => (
            <TodoCard key={item.id} item={item} />
          ))}
          {todoList.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <Text type="secondary">暂无数据</Text>
            </div>
          )}
        </Skeleton>
      </div>
    )
  }
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between"
        }}>
          <Title level={3} style={{ margin: 0 }}>
            待办管理
          </Title>
        </div>
        <div>
          <Text>
            管理您的待办事项，审批事项，包括待处理的消息和待处理的审批
          </Text>
        </div>
      </div>

      <Segmented
        // block
        value={segmentedValue}
        onChange={(val: string) => {
          console.log('---onChange---val', val);
          setSegmentedValue(val);
        }}
        // defaultValue={'pending'}
        options={[
          {
            label: (
              <div style={{ padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileTextOutlined />
                <span style={{ marginLeft: 8 }}>待我处理</span>
                <Badge style={{ marginLeft: 8 }} color="#999" count={todoTotal} />
              </div>
            ),
            value: 'send',
          }
        ]}
      />

      {segmentedValue === 'send' && (
        <div style={{
          marginTop: 16
        }}>
          <h2 className="text-lg font-semibold">待我处理的事项</h2>
          {/* 我发起的申请 待我审批的事项 已完成的审批 被驳回的申请 */}
          {renderSendContent()}
        </div>
      )}


      
    </div>
  )
}

export default connect()(ToDoListManagement);
