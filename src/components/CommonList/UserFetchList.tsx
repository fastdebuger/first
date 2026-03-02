import { useState, useEffect, useMemo } from "react"
import {Modal, Input, List, Avatar, Tag, Typography, Empty, Skeleton} from "antd"
import { SearchOutlined, BuildOutlined, BankOutlined, TeamOutlined } from "@ant-design/icons"
import { queryUserInfo } from '@/services/base/user/list';

const manPng = require("@/assets/man.png");
const womenPng = require("@/assets/women.png");

const { Text } = Typography

interface User {
  [key: string]: string;
}

interface UserSearchModalProps {
  defaultValue?: string | undefined;
  disabled?: boolean;
  value?: string;
  onChange?: (userCode: string, userName: string, user: User) => void
}

const UserFetchList = ({ defaultValue = undefined, value = '', onChange, disabled = false }: UserSearchModalProps) => {
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(defaultValue);
  // const userCode = localStorage.getItem('auth-default-userCode')

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
        const finObj = rows.find((r: any) => r.user_code === value);
        if (finObj) {
          setSelectedUser(finObj);
        }
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
    console.log(arr)
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
      setSelectedUser(null)
    }
  }, [visible])

  const handleUserSelect = (user: User) => {
    setSelectedUser(user)
    onChange?.(user.user_code, user.user_name, user);
    const showValue = `${user.all_user_info}【${user.concat_dep_name}】`
    setInputValue(showValue);
    setTimeout(() => {
      setVisible(false);
    }, 800)
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
                backgroundColor: selectedUser?.all_user_info === user.all_user_info ? "#f0f0f0" : "white",
                borderColor: selectedUser?.all_user_info === user.all_user_info ? "#1890ff" : "#d9d9d9",
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
      <Input.Search
        disabled={disabled}
        value={inputValue}
        enterButton readOnly placeholder="点击右侧搜索按钮选择用户" onSearch={() => {
        setVisible(true)
      }} />
      {visible && (
        <Modal
          title="选择用户"
          open={visible}
          onCancel={() => {
            setVisible(false);
          }}
          footer={null}
          width={800}
          style={{ top: 20 }}
          bodyStyle={{ maxHeight: "70vh", overflowY: "auto" }}
        >
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
          <div style={{ minHeight: 400 }}>
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
        </Modal>
      )}
    </>
  )
}

export default UserFetchList;