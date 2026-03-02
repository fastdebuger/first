import React from 'react';
import {useIntl} from 'umi'
import {SingleTable} from "yayang-ui";
import {ICrudQueryDetailDrawerProps} from "yayang-ui/lib/components/table/SingleTable/CrudQueryDetailDrawer";

let {CrudQueryDetailDrawer,} = SingleTable;

const BaseCrudQueryDetailDrawer: React.FC<ICrudQueryDetailDrawerProps> = (props) => {
  let {formatMessage} = useIntl()

  let getTableColumns = () => {
    if (props.columns) {
      let cols: any[] = props.columns;
      cols.forEach((item) => {
        if (item.subTitle) {
          item.subTitle = formatMessage({id: item.subTitle})
        }
        if (item.title) {
          item.title = formatMessage({id: item.title})
        }
      })
      return cols;
    } else {
      return []
    }
  }

  return (
    <CrudQueryDetailDrawer {...props} columns={getTableColumns()}/>
  )
}

export default BaseCrudQueryDetailDrawer
