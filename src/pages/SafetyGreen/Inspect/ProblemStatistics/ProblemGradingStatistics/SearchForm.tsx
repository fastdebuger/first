import React from 'react';
import { Row, Col, Button, Space, DatePicker, Select } from 'antd';
import ObsCodeTreeSelect, { ObsCodeItem } from '@/components/ObsCodeTreeSelect';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface SearchFormProps {
  searchParams: {
    timePeriod: [moment.Moment, moment.Moment] | undefined;
    problemSource: string | undefined;
    examineUnit: string | undefined;
  };
  obsCodeAllData: ObsCodeItem[];
  wbsOptions: Array<{ value: string; label: string }>;
  onSearchParamsChange: (params: any) => void;
  onSearch: () => void;
  onReset: () => void;
}

/**
 * 搜索表单组件
 */
const SearchForm: React.FC<SearchFormProps> = ({
  searchParams,
  obsCodeAllData,
  wbsOptions,
  onSearchParamsChange,
  onSearch,
  onReset,
}) => {
  return (
    <Row gutter={16} style={{ marginBottom: 16 }}>
      <Col span={6}>
        <RangePicker
          value={searchParams.timePeriod}
          onChange={(dates) => onSearchParamsChange({ ...searchParams, timePeriod: dates as any })}
          style={{ width: '100%' }}
        />
      </Col>
      <Col span={4}>
        <ObsCodeTreeSelect
          data={obsCodeAllData}
          value={searchParams.problemSource}
          onChange={(val) => onSearchParamsChange({ ...searchParams, problemSource: val })}
          placeholder="请选择问题来源"
          style={{ width: '100%' }}
          showSearch
          allowClear
        />
      </Col>
      <Col span={4}>
        <Select
          placeholder="检查单位"
          allowClear
          showSearch
          value={searchParams.examineUnit}
          onChange={(value) => onSearchParamsChange({ ...searchParams, examineUnit: value })}
          style={{ width: '100%' }}
          filterOption={(input, option) =>
            (option?.children as string)?.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {wbsOptions.map(item => (
            <Option key={item.value} value={item.value}>{item.label}</Option>
          ))}
        </Select>
      </Col>
      <Col span={10}>
        <Space>
          <Button type="primary" onClick={onSearch}>
            查询
          </Button>
          <Button onClick={onReset}>重置</Button>
        </Space>
      </Col>
    </Row>
  );
};

export default SearchForm;

