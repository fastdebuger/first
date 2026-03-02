import HtmlRenderer from "../HtmlRenderer";
import { configColumns as configColumnsExpenditure  } from "@/pages/Contract/Income/columns"
export const configColumns = configColumnsExpenditure.map(item => ({
  ...item,
  render: (txt: string) => <HtmlRenderer safeHtml={txt} />
}))