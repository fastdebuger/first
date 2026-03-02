/**
 * 根据后台返回的标签进行解析
 * @param props 
 * @returns 
 */
const HtmlRenderer = (props: any) => {
  const { safeHtml } = props;
  // 处理空值
  if (safeHtml === null || safeHtml === undefined) {
    return ''
  }
  // 处理标签
  if (typeof safeHtml === "string" && safeHtml.startsWith('<') && safeHtml.endsWith('>')) {
    // 移除script标签
    const html = safeHtml?.replace(/<script.*?>.*?<\/script>/gi, '');
    return (
      <div dangerouslySetInnerHTML={{ __html: html }} />
    );
  }
  return safeHtml;
};

export default HtmlRenderer;