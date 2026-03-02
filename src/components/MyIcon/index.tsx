import { createFromIconfontCN } from '@ant-design/icons';
import defaultSettings from "../../../config/defaultSettings";

/**
 * 阿里图标库引用
 */
const AliIcon = createFromIconfontCN({
  scriptUrl: defaultSettings.iconfontUrl
});

export default AliIcon;
