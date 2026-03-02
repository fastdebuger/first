import React from 'react';
import { Row, Col, Button, Space, DatePicker, Select, Radio } from 'antd';
import ObsCodeTreeSelect, { ObsCodeItem } from '@/components/ObsCodeTreeSelect';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface SearchFormProps {
  searchParams: {
    timePeriod: [moment.Moment, moment.Moment] | undefined;
    problemSource: string | undefined;
    examineUnit: string | undefined;
    problemType: string | undefined;
    severityLevel: string | undefined;
    problemCategory: string | undefined;
    branchCompCode: string | undefined;
  };
  timeType: 'year' | 'quarter' | 'month';
  obsCodeAllData: ObsCodeItem[];
  wbsOptions: Array<{ value: string; label: string }>;
  branchCompOptions: Array<{ value: string; label: string }>;
  onSearchParamsChange: (params: any) => void;
  onTimeTypeChange: (type: 'year' | 'quarter' | 'month') => void;
  onSearch: () => void;
  onReset: () => void;
}

/**
 * 问题归属选项配置
 * 0:质量管理类, 1:质量实体类, 2:作业行为类, 3:安全管理类
 */
const PROBLEM_CATEGORY_OPTIONS = [
  { value: '0', label: '质量管理类' },
  { value: '1', label: '质量实体类' },
  { value: '2', label: '作业行为类' },
  { value: '3', label: '安全管理类' },
];

/**
 * 搜索表单组件
 */
const SearchForm: React.FC<SearchFormProps> = ({
  searchParams,
  timeType,
  obsCodeAllData,
  wbsOptions,
  branchCompOptions,
  onSearchParamsChange,
  onTimeTypeChange,
  onSearch,
  onReset,
}) => {

  return (
    <div>
      {/* 第一行：时间周期选择 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Space>
            <span>时间周期：</span>
            <Radio.Group value={timeType} onChange={(e) => onTimeTypeChange(e.target.value)}>
              <Radio.Button value="year">年度</Radio.Button>
              <Radio.Button value="quarter">季度</Radio.Button>
              <Radio.Button value="month">月度</Radio.Button>
            </Radio.Group>
          </Space>
        </Col>
      </Row>

      {/* 第二行：日期范围、问题来源、检查单位、问题归类、问题级别 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={5}>
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
            placeholder="问题来源"
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
            filterOption={(input, option) => {
              // 下拉框搜索过滤：不区分大小写匹配选项标签
              const label = option?.label || option?.children;
              return String(label || '').toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }}
          >
            {wbsOptions.map(item => (
              <Option key={item.value} value={item.value}>{item.label}</Option>
            ))}
          </Select>
        </Col>
        <Col span={4}>
          <Select
            placeholder="问题归类"
            allowClear
            value={searchParams.problemType}
            onChange={(value) => onSearchParamsChange({ ...searchParams, problemType: value })}
            style={{ width: '100%' }}
          >
            <Option value="0">质量</Option>
            <Option value="1">HSE</Option>
          </Select>
        </Col>
        <Col span={4}>
          <Select
            placeholder="问题级别"
            allowClear
            value={searchParams.severityLevel}
            onChange={(value) => onSearchParamsChange({ ...searchParams, severityLevel: value })}
            style={{ width: '100%' }}
          >
            <Option value="0">严重问题</Option>
            <Option value="1">较大问题</Option>
            <Option value="2">一般问题</Option>
            <Option value="3">轻微问题</Option>
          </Select>
        </Col>
      </Row>

      {/* 第三行：问题归属、分公司、查询按钮、重置按钮 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <Select
            placeholder="问题归属"
            allowClear
            showSearch
            value={searchParams.problemCategory}
            onChange={(value) => onSearchParamsChange({ ...searchParams, problemCategory: value })}
            style={{ width: '100%' }}
            filterOption={(input, option) => {
              // 下拉框搜索过滤：不区分大小写匹配选项标签
              const label = option?.label || option?.children || '';
              return String(label).toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }}
          >
            {PROBLEM_CATEGORY_OPTIONS.map((item) => (
              <Option key={item.value} value={item.value}>{item.label}</Option>
            ))}
          </Select>
        </Col>
        <Col span={4}>
          <Select
            placeholder="分公司"
            allowClear
            showSearch
            value={searchParams.branchCompCode}
            onChange={(value) => onSearchParamsChange({ ...searchParams, branchCompCode: value })}
            style={{ width: '100%' }}
            filterOption={(input, option) => {
              // 下拉框搜索过滤：不区分大小写匹配选项标签
              const label = option?.label || option?.children || '';
              return String(label).toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }}
          >
            {branchCompOptions.map((item) => (
              <Option key={item.value} value={item.value}>{item.label}</Option>
            ))}
          </Select>
        </Col>
        <Col span={16}>
          <Space>
            <Button type="primary" onClick={onSearch}>
              查询
            </Button>
            <Button onClick={onReset}>重置</Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default SearchForm;

