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
    problemType: string | undefined;
    problemCategory: string | undefined;
    branchCompCode: string | undefined;
    selectDepCode: string | undefined;
  };
  obsCodeAllData: ObsCodeItem[];
  wbsOptions: Array<{ value: string; label: string }>;
  branchCompOptions: Array<{ value: string; label: string }>;
  projectWbsOptions: Array<{ value: string; label: string }>;
  onSearchParamsChange: (params: any) => void;
  onSearch: () => void;
  onReset: () => void;
}

/**
 * 问题归类选项配置
 * 质量类型(0)对应的选项：0:质量管理类, 1:质量实体类
 * HSE类型(1)对应的选项：2:作业行为类, 3:安全管理类
 */
const PROBLEM_CATEGORY_OPTIONS = {
  '0': [
    { value: '0', label: '质量管理类' },
    { value: '1', label: '质量实体类' },
  ],
  '1': [
    { value: '2', label: '作业行为类' },
    { value: '3', label: '安全管理类' },
  ],
};

/**
 * 根据问题类型获取可用的问题归类选项
 * @param problemType 问题类型：0-质量, 1-HSE
 * @returns 问题归类选项数组
 */
const getProblemCategoryOptions = (problemType: string | undefined) => {
  // 如果没有选择问题类型，返回空数组
  if (!problemType) {
    return [];
  }
  // 根据问题类型返回对应的选项
  return PROBLEM_CATEGORY_OPTIONS[problemType as keyof typeof PROBLEM_CATEGORY_OPTIONS] || [];
};

/**
 * 搜索表单组件
 */
const SearchForm: React.FC<SearchFormProps> = ({
  searchParams,
  obsCodeAllData,
  wbsOptions,
  branchCompOptions,
  projectWbsOptions,
  onSearchParamsChange,
  onSearch,
  onReset,
}) => {
  // 根据问题类型获取可用的问题归类选项
  const problemCategoryOptions = getProblemCategoryOptions(searchParams.problemType);

  // 处理问题类型变化，清空问题归类
  const handleProblemTypeChange = (value: string | undefined) => {
    onSearchParamsChange({
      ...searchParams,
      problemType: value,
      problemCategory: undefined, // 清空问题归类
    });
  };

  // 处理分公司变化，清空项目部
  const handleBranchCompChange = (value: string | undefined) => {
    onSearchParamsChange({
      ...searchParams,
      branchCompCode: value,
      selectDepCode: undefined, // 清空项目部
    });
  };

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <RangePicker
            value={searchParams.timePeriod}
            onChange={(dates) => onSearchParamsChange({ ...searchParams, timePeriod: dates as any })}
            style={{ width: '100%' }}
          />
        </Col>
        <Col span={3}>
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
        <Col span={3}>
          <Select
            placeholder="检查单位"
            allowClear
            showSearch
            value={searchParams.examineUnit}
            onChange={(value) => onSearchParamsChange({ ...searchParams, examineUnit: value })}
            style={{ width: '100%' }}
            filterOption={(input, option) => {
              const label = option?.label || option?.children;
              return String(label || '').toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }}
          >
            {wbsOptions.map(item => (
              <Option key={item.value} value={item.value}>{item.label}</Option>
            ))}
          </Select>
        </Col>
        <Col span={3}>
          <Select
            placeholder="问题归类"
            allowClear
            value={searchParams.problemType}
            onChange={handleProblemTypeChange}
            style={{ width: '100%' }}
          >
            <Option value="0">质量</Option>
            <Option value="1">HSE</Option>
          </Select>
        </Col>
        <Col span={3}>
          <Select
            placeholder="问题归类"
            allowClear
            showSearch
            value={searchParams.problemCategory}
            onChange={(value) => onSearchParamsChange({ ...searchParams, problemCategory: value })}
            style={{ width: '100%' }}
            disabled={!searchParams.problemType}
            filterOption={(input, option) => {
              const label = option?.label || option?.children || '';
              return String(label).toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }}
          >
            {problemCategoryOptions.map((item) => (
              <Option key={item.value} value={item.value}>{item.label}</Option>
            ))}
          </Select>
        </Col>
        <Col span={3}>
          <Select
            placeholder="分公司"
            allowClear={branchCompOptions.length > 1}
            showSearch
            value={searchParams.branchCompCode}
            onChange={handleBranchCompChange}
            style={{ width: '100%' }}
            disabled={branchCompOptions.length === 1}
            filterOption={(input, option) => {
              const label = option?.label || option?.children;
              return String(label || '').toLowerCase().indexOf(input.toLowerCase()) >= 0;
            }}
          >
            {branchCompOptions.map(item => (
              <Option key={item.value} value={item.value}>{item.label}</Option>
            ))}
          </Select>
        </Col>
        <Col span={3}>
          <Select
            placeholder="项目部"
            allowClear={projectWbsOptions.length > 1}
            showSearch
            value={searchParams.selectDepCode}
            onChange={(value) => onSearchParamsChange({ ...searchParams, selectDepCode: value })}
            style={{ width: '100%' }}
            disabled={!searchParams.branchCompCode || projectWbsOptions.length === 1}
            filterOption={(input, option) => {
              const label = option?.label || option?.children;
              const labelStr = String(label || '');
              const inputLower = input.toLowerCase();
              return labelStr.toLowerCase().indexOf(inputLower) >= 0;
            }}
          >
            {projectWbsOptions.map(item => (
              <Option key={item.value} value={item.value}>{item.label}</Option>
            ))}
          </Select>
        </Col>
        <Col span={2}>
          <Space>
            <Button type="primary" onClick={onSearch}>
              查询
            </Button>
          </Space>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Space>
            <Button onClick={onReset}>重置</Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default SearchForm;
