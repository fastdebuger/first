import React from 'react';
import {Descriptions} from "antd";
import {showTS} from "@/utils/utils-date";
import {useIntl} from "umi";

/**
 * 表单详情页面 表头的信息展示
 * @param props
 * @constructor
 */
const BaseFormDetailShow: React.FC<any> = (props) => {
  const {columns, record} = props;
  const { formatMessage } = useIntl();
  return (
    <Descriptions bordered size="middle">
      {columns.map((col: any) => {
        if (record[col.dataIndex] === null || record[col.dataIndex] === undefined) {
          return (
            <Descriptions.Item key={col.dateIndex} label={formatMessage({ id: col.title })}>
              {'/'}
            </Descriptions.Item>
          )
        }
        if (col.valueType && col.valueType === 'dateTs') {
          return (
            <Descriptions.Item key={col.dateIndex} label={formatMessage({ id: col.title })}>
              {showTS(Number(record[col.dataIndex]), col.format || 'YYYY-MM-DD')}
            </Descriptions.Item>
          );
        }
        if (col.render) {
          return (
            <Descriptions.Item key={col.dateIndex} label={formatMessage({ id: col.title })}>
              {col.render(record[col.dataIndex])}
            </Descriptions.Item>
          )
        }
        return (
          <Descriptions.Item key={col.dateIndex} label={formatMessage({ id: col.title })}>
            {record[col.dataIndex] || '/'}
          </Descriptions.Item>
        )
      })}
    </Descriptions>
  )
}

export default BaseFormDetailShow;
