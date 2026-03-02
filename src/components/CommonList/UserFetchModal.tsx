import { useState, useEffect, useMemo } from "react"
import {Modal, Input, List, Avatar, Tag, Typography, Empty, Skeleton, Row, Col, Space, Button, message} from "antd"
import { SearchOutlined, BuildOutlined, BankOutlined, TeamOutlined } from "@ant-design/icons"
import { queryUserInfo } from '@/services/base/user/list';

const manPng = require("@/assets/man.png");
const womenPng = require("@/assets/women.png");
import studentPng from '@/assets/hr/student.png';
import {deepArr} from "@/utils/utils-array";

const { Text } = Typography

interface User {
  [key: string]: string;
}

interface UserSearchModalProps {
  defaultValue?: string | undefined;
  disabled?: boolean;
  value?: string;
  visible: boolean;
  onCancel: () => void;
  commitLoading: boolean;
  onSelect: (user: User[]) => void
}

const UserFetchModal = ({ commitLoading = false, visible, onCancel, defaultValue = undefined, value = '', onSelect, disabled = false }: UserSearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<any[]>([])
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const q = (searchQuery || '').trim();

    // 简单防抖：300ms 内连续输入只取最后一次
    const timer = setTimeout(async () => {
      if (q === '') {
        if (!cancelled) setFilteredUsers([]);
        return;
      }
      try {
        setLoading(true);
        const res = await queryUserInfo({
          random: Date.now(),
          sort: 'user_code',
          order: 'asc',
          limit: 100,
          offset: 1,
          prop_key: 'branchComp',
          filter: JSON.stringify([
            { Key: 'all_user_info', Val: q },
            // { Key: 'user_code', Val: userCode, Operator: '!='} // 用户不能选择自己
          ]),
        });
        const rows = Array.isArray(res?.rows) ? res.rows : [];
        if (!cancelled) setFilteredUsers(rows);
      } catch (e) {
        if (!cancelled) setFilteredUsers([]);
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 1000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Group users by level
  const groupedUsers = useMemo(() => {
    const arr = filteredUsers || [];
    const groups = {
      company: arr.filter((user) => user.prop_key === "branchComp"),
      branch: arr.filter((user) => user.prop_key === "subComp"),
      project: arr.filter((user) => user.prop_key === "dep"),
      other: arr.filter((user) => !user.prop_key),
    }
    return groups
  }, [filteredUsers])

  // Reset search when modal closes
  useEffect(() => {
    if (!visible) {
      setSearchQuery("")
    }
  }, [visible])

  const handleUserSelect = (user: User) => {
    const copyUsers = deepArr(selectedUser);
    const findObj = copyUsers.find((cpUser) => cpUser.user_code === user.user_code);
    if (!findObj) {
      copyUsers.push(user);
    }
    setSelectedUser(copyUsers)
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "company":
        return <BuildOutlined />
      case "branch":
        return <BankOutlined />
      case "project":
        return <TeamOutlined />
      default:
        return <TeamOutlined />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "company":
        return "blue"
      case "branch":
        return "green"
      case "project":
        return "purple"
      default:
        return "default"
    }
  }

  const getConcatName = (concatName: string) => {
    if (!concatName) {
      return "未知"
    }
    try {
      const arr= concatName.split(",");
      if (arr.length <= 3) {
        return concatName;
      }

      const len = arr.length;
      return (
        <div>
          <div>{arr.slice(0, 3).join(',')}</div>
          <div>{arr.slice(3, len).join(',')}</div>
        </div>
      )

    } catch (e) {
      return "未知"
    }
  }

  const renderUserGroup = (title: string, users: User[], level: string) => {
    if (users.length === 0) return null

    return (
      <div key={level} style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          {getLevelIcon(level)}
          <Text strong style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.5px", color: "#666" }}>
            {title}
          </Text>
          <Tag color="default" style={{ fontSize: 10 }}>
            {users.length}
          </Tag>
        </div>
        <List
          dataSource={users}
          renderItem={(user: any) => (
            <List.Item
              key={user.all_user_info}
              style={{
                padding: 12,
                border: "1px solid #d9d9d9",
                borderRadius: 8,
                marginBottom: 8,
                cursor: "pointer",
              }}
              onClick={() => handleUserSelect(user)}
            >
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={user.sex == '男' ? manPng : womenPng}
                    size={40}
                  />
                }
                title={
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Text strong>{user.all_user_info}</Text>
                    {user.sex || '无'}
                    <Tag color={getLevelColor(level)} size="small">
                      {getConcatName(user.concat_dep_name)}
                    </Tag>
                  </div>
                }
                description={
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {user.obs_name || '未知OBS'}
                    </Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 11 }}>
                      {user.group_name || '未知角色'}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </div>
    )
  }

  return (
    <>
      {visible && (
        <Modal
          title="选择用户"
          open={visible}
          onCancel={onCancel}
          width={'80%'}
          style={{ top: 20 }}
          footer={(
            <Space>
              <Button>取消</Button>
              <Button loading={commitLoading} type={'primary'} onClick={() => {
                if (selectedUser.length < 1) {
                  message.warning('从左侧选择新增的培训人员');
                  return;
                }
                onSelect(selectedUser)
              }}>确定</Button>
            </Space>
          )}
          bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <Input
                  placeholder="可输入用户名称、用户编码进行搜索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  prefix={<SearchOutlined />}
                  autoFocus
                  size="large"
                />
              </div>
              {/* Search Results */}
              <div style={{ height: 600, overflowY: "scroll" }}>
                <Skeleton loading={loading} >
                  {searchQuery.trim() === "" ? (
                    <Empty
                      image={<SearchOutlined style={{ fontSize: 48, color: "#d9d9d9" }} />}
                      description="输入用户名/编码开始搜索吧"
                      style={{ padding: "60px 0" }}
                    />
                  ) : filteredUsers.length === 0 ? (
                    <Empty description={`正在搜索 "${searchQuery}"`} style={{ padding: "60px 0" }} />
                  ) : (
                    <div>
                      {renderUserGroup("公司层级", groupedUsers.company, "company")}
                      {renderUserGroup("专业分公司层级", groupedUsers.branch, "branch")}
                      {renderUserGroup("项目部层级", groupedUsers.project, "project")}
                      {renderUserGroup("其他", groupedUsers.other, "other")}
                    </div>
                  )}
                </Skeleton>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ height: 600, overflowY: "scroll" }}>
                <List
                  itemLayout="horizontal"
                  dataSource={selectedUser}
                  renderItem={item => (
                    <List.Item
                      actions={[<a style={{color: '#f40'}} onClick={() => {
                        const filterArr = selectedUser.filter(user => user.user_code === item.user_code);
                        setSelectedUser(filterArr);
                      }}>删除</a>]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar src={studentPng} />}
                        title={<strong>{item.user_name}</strong>}
                        description={`编号：${item.user_code}`}
                      />
                    </List.Item>
                  )}
                />
              </div>
            </Col>
          </Row>
        </Modal>
      )}
    </>
  )
}

export default UserFetchModal;
