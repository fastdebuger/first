import { CheckCircleTwoTone, ClockCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons"

/**
 * 标题栏组件
 * 用于展示一个模块的标题、总金额和条目数量
 * @param {string} title - 标题名称，默认为 '进度款'
 * @param {number} total - 总金额，默认为 0
 * @param {number} num - 条目数量，默认为 0
 */
const TitleBar = ({
  title = '进度款',
  total = 0,
  num = 0,
}) => {
  // 定义颜色常量
  const colors = {
    headerBg: '#E6F7FF', // 头部背景色
  }

  return (
    // 最外层容器，设置背景色、内边距和圆角（顶部）
    <div style={{
      backgroundColor: colors.headerBg,
      padding: '10px 20px 0',
    }}
      className="rounded-t-md" // 使用 Tailwind CSS 类设置顶部圆角
    >
      {/* 内部容器，使用 flex 布局，垂直居中对齐，两端对齐 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: "space-between"
      }}>
        {/* 左侧：标题和数量 */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline', // 标题和数量基于基线对齐
          gap: '8px', // 元素间距
        }}>
          {/* 标题文本 */}
          <p style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: 0,
          }}>
            {title}
          </p>
          {/* 条目数量 */}
          <p style={{
            fontSize: '12px',
            color: '#4b5563',
          }}>
            共 {num} 笔
          </p>
        </div>
        {/* 右侧：总金额 */}
        <div
          style={{
            alignItems: 'baseline', // 确保内容对齐（虽然这里只有一个元素）
          }}
        >
          {/* 总金额文本 */}
          <p style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1f2937',
          }}>
            ¥{total}
          </p>
        </div>
      </div>
    </div>
  )
}


/**
 * 审批进度状态图标组件
 * 根据 item.approval_schedule_str 的值显示不同的 Ant Design Icon
 * @param {object} props - 包含 item 对象的 props
 * @param {object} props.item - 包含审批进度字符串的对象
 */
export const ApprovalScheduleStr = (props: any) => {
  const { item } = props;
  let itemChild = <></> // 初始化为一个空的 React Fragment

  // 根据审批进度字符串 (item.approval_schedule_str) 决定显示哪个图标
  switch (item.approval_schedule_str) {
    case "已完成":
    case "已审批完成":
    case "审批完成":
      // 已完成/审批通过状态，使用绿色对勾图标
      itemChild = <CheckCircleTwoTone twoToneColor="#52c41a" />
      break;
    case "审批中":
      // 审批中状态，使用橙色时钟图标
      itemChild = <ClockCircleTwoTone twoToneColor="#ff711f" />
      break;
    case "未审批":
      // 未审批/拒绝/失败状态（根据图标颜色推测），使用红色叉号图标
      itemChild = <CloseCircleTwoTone twoToneColor="#ff0000ff" />
      break;
    default:
      // 其他或未匹配状态，保持为空 Fragment
      break;
  }
  
  // 返回包含图标的 span，并设置左侧内边距
  return (
    <span style={{ paddingLeft: 5 }}>
      {itemChild}
    </span>
  )
}


export default TitleBar;