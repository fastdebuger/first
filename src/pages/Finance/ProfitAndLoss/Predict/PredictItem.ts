export default class PredictItem {
  year: string;
  item_key: string;
  item_name: string;
  sort_order: number;
  q1_month1: number; q1_month2: number; q1_month3: number; q1_subtotal: number;
  q2_month1: number; q2_month2: number; q2_month3: number; q2_subtotal: number;
  q3_month1: number; q3_month2: number; q3_month3: number; q3_subtotal: number;
  q4_month1: number; q4_month2: number; q4_month3: number; q4_subtotal: number;
  full_year_amount: number;
  indicator_amount: number;
  remark: string;

  constructor(year:string, itemKey: string, itemName: string, sortOrder: number) {
    this.year = year;
    this.item_key = itemKey;
    this.item_name = itemName;
    this.sort_order = sortOrder;
    this.q1_month1 = 0; this.q1_month2 = 0; this.q1_month3 = 0; this.q1_subtotal = 0;
    this.q2_month1 = 0; this.q2_month2 = 0; this.q2_month3 = 0; this.q2_subtotal = 0;
    this.q3_month1 = 0; this.q3_month2 = 0; this.q3_month3 = 0; this.q3_subtotal = 0;
    this.q4_month1 = 0; this.q4_month2 = 0; this.q4_month3 = 0; this.q4_subtotal = 0;
    this.full_year_amount = 0;
    this.indicator_amount  = 0;
    this.remark = '';

    this.calculateDifference();
  }

  calculateDifference() {
    this.q1_subtotal = Number(this.q1_month1 || 0) + Number(this.q1_month2 || 0) + Number(this.q1_month3 || 0);
    this.q2_subtotal = Number(this.q2_month1 || 0) + Number(this.q2_month2 || 0) + Number(this.q2_month3 || 0);
    this.q3_subtotal = Number(this.q3_month1 || 0) + Number(this.q3_month2 || 0) + Number(this.q3_month3 || 0);
    this.q4_subtotal = Number(this.q4_month1 || 0) + Number(this.q4_month2 || 0) + Number(this.q4_month3 || 0);

    this.full_year_amount = Number(this.q1_subtotal || 0) + Number(this.q2_subtotal || 0) + Number(this.q3_subtotal || 0) + Number(this.q4_subtotal || 0);
  }

  updateField(dataIndex: string, value: string | number) {
    // @ts-ignore
    this[dataIndex] = value;
    this.calculateDifference();
  }

  getField(dataIndex: string) {
    // @ts-ignore
    return this[dataIndex];
  }

}
