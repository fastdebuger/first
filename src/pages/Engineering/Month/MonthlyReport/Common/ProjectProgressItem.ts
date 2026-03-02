export default class ProjectProgressItem {
  phase: string;
  weight: number;
  weightDisable: boolean;
  last_month_plan?: number; // 上月计划
  last_month_reality?: number;// 上月实际
  curr_month_plan: number;// 本月计划累计（%）
  curr_month_reality: number;//  本月实际累计（%）
  last_cumulative_reality: number;
  cumulative_reality: number;
  curr_month_difference: number;//  本月差值（%）
  curr_month_plan_output: number;//  本月计划产值（万元）
  curr_month_reality_output: number;//  本月实际完成产值（万元）
  next_month_plan: number;//  下月计划（%）
  cumulative_plan: number;//  累计计划（%）
  next_month_output: number;//  下月计划产值（万元）
  hasNewField: boolean;

  constructor(phase: string, hasNewField: boolean = false) {
    this.phase = phase;             //工程阶段(设计/采购/施工/试运/其他)
    this.weight = 0;                // 权重（%）
    this.weightDisable = false;
    this.last_month_plan = 0;
    this.last_month_reality = 0;
    this.curr_month_plan = 0;        // 本月计划（%）
    this.curr_month_reality = 0;     // 本月实际
    this.last_cumulative_reality = 0;
    this.cumulative_reality = 0;
    this.curr_month_difference = 0;  // 差值（%）
    this.curr_month_plan_output = 0;        // 本月计划产值 万元
    this.curr_month_reality_output = 0;     // 本月实际完成产值 = （本月累计% - 上月累计%） * 合同额
    this.next_month_plan = 0;  // 下月计划（%）
    this.cumulative_plan = 0;  // 下月累计计划（%）
    this.next_month_output = 0;  // 下月计划产值（%）
    this.hasNewField = hasNewField;
    this.calculateDifference();
  }

  calculateDifference() {
    this.curr_month_difference = this.curr_month_reality - this.curr_month_plan;
  }

  calculateCurrMonthRealityOutput(contractSayPrice: number) {

    const rate = ((this.curr_month_reality - (this.last_month_reality || 0)) / 100);
    const _weight = this.weight / 100;
    this.curr_month_reality_output = Number((rate * contractSayPrice * _weight).toFixed(2));
  }

  calculateNextMonthOutput(contractSayPrice: number) {
    const _weight = this.weight / 100;
    this.next_month_output = Number((_weight * (this.next_month_plan / 100) * contractSayPrice).toFixed(2))
  }

  // 自开工累 = 上个月自开工累 + 本月实际
  calculateCumulativeReality(value: number | string) {
    this.cumulative_reality = this.last_cumulative_reality + Number(value);
  }
  // 下月累计 = 本月自开工累 + 下月计划
  calculateNextCumulativeReality(value: number | string) {
    this.cumulative_plan = this.cumulative_reality + Number(value);
  }

  updateField(dataIndex: string, value: string | number, contractSayPrice: number = 0) {
    // @ts-ignore
    this[dataIndex] = value;
    this.calculateDifference();
    if (dataIndex === 'curr_month_reality' || dataIndex === 'weight') {
      this.calculateCurrMonthRealityOutput(contractSayPrice);
    }

    if (dataIndex === 'next_month_plan' || dataIndex === 'weight') {
      this.calculateNextMonthOutput(contractSayPrice);
      this.calculateNextCumulativeReality(value);
    }

    if (dataIndex === 'curr_month_reality') {
      this.calculateCumulativeReality(value)
    }

  }

  getField(dataIndex: string) {
    // @ts-ignore
    return this[dataIndex];
  }

}
