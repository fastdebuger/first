import React from 'react';
import { DatePicker, Select, Row, Col, Button, Space } from 'antd';
import ObsCodeTreeSelect, { ObsCodeItem } from '@/components/ObsCodeTreeSelect';
import { SearchParams } from './types';

const { RangePicker } = DatePicker;
const { Option } = Select;

/**
 * 选项数据类型
 */
interface OptionItem {
  value: string;
  label: string;
}

/**
 * 搜索表单组件的Props
 */
interface SearchFormProps {
  searchParams: SearchParams;
  obsCodeAllData: ObsCodeItem[];
  wbsOptions: OptionItem[];
  branchCompOptions: OptionItem[];
  projectWbsOptions: OptionItem[];
  onSearchParamsChange: (params: SearchParams) => void;
  onSearch: () => void;
  onReset: () => void;
}

/**
 * 搜索表单组件
 * 提供问题级别统计的筛选条件输入
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
  /**
   * 处理时间范围变化
   */
  const handleTimePeriodChange = (dates: any) => {
    onSearchParamsChange({ ...searchParams, timePeriod: dates });
  };

  /**
   * 处理问题来源变化
   */
  const handleProblemSourceChange = (val: string | string[]) => {
    onSearchParamsChange({
      ...searchParams,
      problemSource: Array.isArray(val) ? val[0] : val
    });
  };

  /**
   * 处理检查单位变化
   */
  const handleExamineUnitChange = (value: string) => {
    onSearchParamsChange({ ...searchParams, examineUnit: value });
  };

  /**
   * 处理问题类型变化
   */
  const handleProblemTypeChange = (value: string) => {
    onSearchParamsChange({ ...searchParams, problemType: value });
  };

  /**
   * 处理问题级别变化
   */
  const handleSeverityLevelChange = (value: string) => {
    onSearchParamsChange({ ...searchParams, severityLevel: value });
  };

  /**
   * 处理分公司变化
   */
  const handleBranchCompChange = (value: string) => {
    onSearchParamsChange({
      ...searchParams,
      branchCompCode: value,
      selectWbsCode: undefined, // 清空项目部
    });
  };

  /**
   * 处理项目部变化
   */
  const handleProjectWbsChange = (value: string) => {
    onSearchParamsChange({ ...searchParams, selectWbsCode: value });
  };

  /**
   * 过滤选项（用于Select组件的filterOption）
   */
  const filterOption = (input: string, option: any) => {
    const label = option?.label || option?.children;
    return String(label || '').toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  return (
    <>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <RangePicker
            value={searchParams.timePeriod}
            onChange={handleTimePeriodChange}
            style={{ width: '100%' }}
          />
        </Col>
        <Col span={3}>
          <ObsCodeTreeSelect
            data={obsCodeAllData}
            value={searchParams.problemSource}
            onChange={handleProblemSourceChange}
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
            onChange={handleExamineUnitChange}
            style={{ width: '100%' }}
            filterOption={filterOption}
          >
            {wbsOptions.map(item => (
              <Option key={item.value} value={item.value}>{item.label}</Option>
            ))}
          </Select>
        </Col>
        <Col span={3}>
          <Select
            placeholder="问题类型"
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
            placeholder="问题级别"
            allowClear
            value={searchParams.severityLevel}
            onChange={handleSeverityLevelChange}
            style={{ width: '100%' }}
          >
            <Option value="0">严重问题</Option>
            <Option value="1">较大问题</Option>
            <Option value="2">一般问题</Option>
            <Option value="3">轻微问题</Option>
          </Select>
        </Col>
        <Col span={8}>
          <Space>
            <Button type="primary" onClick={onSearch}>
              查询
            </Button>
            <Button onClick={onReset}>重置</Button>
          </Space>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={3}>
          <Select
            placeholder="分公司"
            allowClear={branchCompOptions.length > 1}
            showSearch
            value={searchParams.branchCompCode}
            onChange={handleBranchCompChange}
            style={{ width: '100%' }}
            disabled={branchCompOptions.length === 1}
            filterOption={filterOption}
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
            value={searchParams.selectWbsCode}
            onChange={handleProjectWbsChange}
            style={{ width: '100%' }}
            disabled={!searchParams.branchCompCode || projectWbsOptions.length === 1}
            filterOption={filterOption}
          >
            {projectWbsOptions.map(item => (
              <Option key={item.value} value={item.value}>{item.label}</Option>
            ))}
          </Select>
        </Col>
      </Row>
    </>
  );
};

export default SearchForm;

