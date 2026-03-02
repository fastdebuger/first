import React, {useEffect, useRef, useState} from 'react';
import {connect} from 'umi';

import {configColumns} from "./compColumns";
import ResourceOngoingProjectDetail from "./Detail";
import {Button, Col, DatePicker, Form, InputNumber, message, Modal, Row, Space, Table, Tabs, Typography } from 'antd';
import {
  queryResourceOngoingProjectB1Extra,
  queryResourceOngoingProjectStatictics,
  updateResourceOngoingProjectB1Extra
} from "@/services/finance/resourceOngoingProject";
import {ConnectState} from "@/models/connect";
import moment from 'moment';

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import { DownloadOutlined } from '@ant-design/icons';

const AddModal = (props: any) => {
  const { visible, year, onCancel, callbackSuccess, sysBasicDictList } = props;
  const [form] = Form.useForm();

  const fetchList = async () => {
    const res = await queryResourceOngoingProjectB1Extra({
      year: year,
    })
    if (res.result.length > 0) {
      const obj = {};
      res.result.forEach((row: any) => {
        const key = row.b1_type_code + '_yy_' + row.type_code;
        Object.assign(obj, {
          [key]: [row],
        })
      })
      form.setFieldsValue(obj);
    }
  }

  useEffect(() => {
    fetchList()
  }, [year]);

  const filterArr = sysBasicDictList.filter(item => {
    return ['begin_curr', 'next_end'].includes(item.value);
  })

  const finalTitleExtraList = [
    {value: 'operating_revenue', label: '营业收入'},
    {value: 'cost_price', label: '成本费用'},
    {value: 'finance_price', label: '财务费用'},
    {value: 'profit_total_price', label: '利润总额'},
    {value: 'income_tax', label: '所得税'},
    {value: 'net_profix', label: '净利润'},
    {value: 'net_profix_rate', label: '净利润率'}
  ]

  const formItemList = [
    {value: 'period_total_cost', label: '期间费用等'},
    {value: 'domestic_manage_price', label: '国内管理费用'},
    {value: 'finance_price', label: '财务费用'},
    {value: 'non_operating_price', label: '减值和营业外等'},
    {value: 'domestic_income_tax', label: '国内所得税'}
  ]

  return (
    <Modal
      title={(
        <Row justify='space-between'>
          <Col>
            <strong style={{fontSize: 18}}>完善期间费用等</strong>
          </Col>
          <Col style={{paddingRight: 16}}>
            <Button type={'primary'} onClick={async () => {
              const values = await form.validateFields();
              const arr = [];
              for(const [key, val] of Object.entries(values)) {
                if (Array.isArray(val) && val.length > 0) {
                  const split = key.split('_yy_');
                  arr.push({
                    b1_type_code: split[0],
                    type_code: split[1],
                    ...val[0],
                    year,
                  })
                }
              }
              const res = await updateResourceOngoingProjectB1Extra({
                year: year,
                options: JSON.stringify(arr),
              })
              if (res.errCode === 0) {
                message.success('更新成功');
                callbackSuccess()
              }
            }}>
              保存
            </Button>
          </Col>
        </Row>
      )}
      open={visible}
      visible={visible}
      onCancel={onCancel}
      width={'100vw'}
      footer={null}
      style={{
        top: 0,
        maxWidth: '100vw',
        paddingBottom: 0,
        maxHeight: '100vh',
        overflow: 'hidden',
      }}
      bodyStyle={{
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      <Form  layout={'vertical'} form={form} name="resource_b3">
        {filterArr.map((item, index) => {
          return (
            <div>
              <h3>{item.label}</h3>
              <Tabs>
                {finalTitleExtraList.map(item2 => {
                  return (
                    <Tabs.TabPane tab={item2.label} key={item2.label} forceRender={true}>
                      <Form.List
                        name={item.value + "_yy_" +item2.value}
                        initialValue={[{
                          period_total_cost: 0,
                          domestic_manage_price: 0,
                          finance_price: 0,
                          non_operating_price: 0,
                          domestic_income_tax: 0,
                        }]} // 关键：初始化1行
                      >
                        {(fields, { add, remove }) => (
                          <>
                            {fields.map(({ key, name, ...restField }) => (
                              <Row key={key} gutter={16} style={{ marginBottom: '10px' }}>
                                {formItemList.map(r => (
                                  <Col key={r.value} span={6}>
                                    <Form.Item
                                      {...restField}
                                      name={[name, r.value]}
                                      label={r.label}
                                      // rules={[{ required: true, message: `请输入${r.label}` }]}
                                    >
                                      <InputNumber style={{width: '100%'}} placeholder={r.label} />
                                    </Form.Item>
                                  </Col>
                                ))}
                              </Row>
                            ))}
                          </>
                        )}
                      </Form.List>
                    </Tabs.TabPane>
                  )
                })}
              </Tabs>
            </div>
          )
        })}
      </Form>
    </Modal>
  )
}

/**
 * 在建项目资源结转情况(大表）
 * @constructor
 */
const ResourceOngoingProjectStaticticsPage: React.FC<any> = (props) => {
  const { sysBasicDictList, route: { authority } } = props;
  const actionRef: any = useRef();

  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  const currYear = moment().year();
  const [year, setYear] = React.useState<any>(currYear);
  const [currDate, setCurrDate] = React.useState<any>(moment());

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [extraList, setExtraList] = useState<any[]>([]);
  const [exportLoading, setExportLoading] = useState(false);

  const finalTitleList = sysBasicDictList.filter(r => r.type === 'JUE_SUAN');
  const sanJinTitleList = sysBasicDictList.filter(r => r.type === 'SAN_JIN_JIAN_ZHI');

  const fetchList = async () => {
    const res = await queryResourceOngoingProjectStatictics({
      sort: 'id',
      order: 'asc',
      year: year,
    })
    const res2 = await queryResourceOngoingProjectB1Extra({
      year: year,
    })
    console.log('--------res.rows', JSON.stringify(res.rows));
    console.log('--------res2.result', JSON.stringify(res2.result));
    setDataSource(res.rows || [])
    setExtraList(res2.result || [])
  }

  const getColumns = () => {
    // 1. 处理 configColumns，使用 map 创建一个全新的数组，避免修改原数组
    const processedConfigColumns = configColumns.map(col => {
      // 使用扩展运算符创建一个新对象，而不是 Object.assign 修改原对象
      if(col.dataIndex === 'wbs_define_code') {
        Object.assign(col, {
          render: (text: any, record: any) => {
            return <a onClick={() => {
              setSelectedRecord(record);
              setOpen(true);
            }}>{text}</a>;
          },
        })
      }
      return {
        ...col,
        ellipsis: true,
      };
    });

    // 2. 为 finalTitleList 生成新的列定义
    const finalTitleColumns = finalTitleList.map(r => ({
      title: r.label,
      children: [
        { subTitle: "compinfo.operating_revenue", title: "营业收入", dataIndex: `operating_revenue_${r.value}`, width: 160, align: "center" },
        { subTitle: "compinfo.cost_price", title: "成本费用", dataIndex: `cost_price_${r.value}`, width: 160, align: "center" },
        { subTitle: "compinfo.finance_price", title: "财务费用", dataIndex: `finance_price_${r.value}`, width: 160, align: "center" },
        { subTitle: "compinfo.profit_total_price", title: "利润总额", dataIndex: `profit_total_price_${r.value}`, width: 160, align: "center" },
        { subTitle: "compinfo.income_tax", title: "所得税", dataIndex: `income_tax_${r.value}`, width: 160, align: "center" },
        { subTitle: "compinfo.net_profit", title: "净利润", dataIndex: `net_profit_${r.value}`, width: 160, align: "center" }, // 注意：原文是 net_profix，可能是笔误
        { subTitle: "compinfo.net_profit_rate", title: "净利润率", dataIndex: `net_profit_rate_${r.value}`, width: 160, align: "center" }, // 注意：原文是 net_profix_rate，可能是笔误
      ]
    }));

    // 3. 为 sanJinTitleList 生成新的列定义
    const sanJinTitleColumns = sanJinTitleList.map(r => ({
      title: r.label,
      children: [
        { subTitle: "compinfo.contract_price", title: "合同资产", dataIndex: `contract_price_${r.value}`, width: 160, align: "center" },
        { subTitle: "compinfo.actual_price", title: "应收款项", dataIndex: `actual_price_${r.value}`, width: 160, align: "center" },
        { subTitle: "compinfo.save_amount", title: "存货", dataIndex: `save_amount_${r.value}`, width: 160, align: "center" },
      ]
    }));

    // 4. 定义固定的、最后的列
    const fixedColumns = [
      { subTitle: "compinfo.curr_moment_provision", title: "预计负债-本期期末", dataIndex: "curr_moment_provision", width: 160, align: "center" },
      { subTitle: "compinfo.curr_year_provision", title: "预计负债-本年末", dataIndex: "curr_year_provision", width: 160, align: "center" },
      { subTitle: "compinfo.remark", title: "备注", dataIndex: "remark", width: 160, align: "center" },
    ];

    // 5. 使用扩展运算符将所有部分合并成一个最终的、全新的数组并返回
    return [
      ...processedConfigColumns,
      ...finalTitleColumns,
      ...sanJinTitleColumns,
      ...fixedColumns,
    ];
  };

  useEffect(() => {
    fetchList()
  }, [year])
  let emptyCount = 50;
  const getEmptyCols = () => {
    let arr = [];
    for(let i = 1; i <= emptyCount; i++) {
      arr.push(i);
    }
    return arr;
  }

  /**
   *
   * @param b1TypeCode 列头：比如：当年1月-当月
   * @param typeCode 横向：比如 期间费用啥的
   * @param dataIndex 显示的列
   */
  const getColData = (b1TypeCode: string, typeCode : string, dataIndex: string) => {
    const findObj = extraList.find(r => r.b1_type_code === b1TypeCode && r.type_code == typeCode && Number(r.year) === year);
    if (findObj) {
      return findObj[dataIndex] || 0;
    }
    return 0;
  }

  const finalTitleExtraList = [
    {value: 'operating_revenue', label: '营业收入'},
    {value: 'cost_price', label: '成本费用'},
    {value: 'finance_price', label: '财务费用'},
    {value: 'profit_total_price', label: '利润总额'},
    {value: 'income_tax', label: '所得税'},
    {value: 'net_profix', label: '净利润'},
    {value: 'net_profix_rate', label: '净利润率'}
  ]

  const formItemList = [
    {value: 'period_total_cost', label: '期间费用等'},
    {value: 'domestic_manage_price', label: '国内管理费用'},
    {value: 'finance_price', label: '财务费用'},
    {value: 'non_operating_price', label: '减值和营业外等'},
    {value: 'domestic_income_tax', label: '国内所得税'}
  ]



  const exportToExcel = async () => {
    setExportLoading(true);

    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("在建项目资源结转表（公司级）");

      const fullColumns = getColumns();

      /** ========= 工具方法 ========= */

        // 计算列树的叶子节点数量（用于合并单元格）
      const getLeafCount = (col) => {
          if (!col.children || col.children.length === 0) return 1;
          return col.children.reduce((sum, c) => sum + getLeafCount(c), 0);
        };

      // 扁平列（严格按 Table 展开顺序）
      const flatColumns: {
        title: string;
        dataIndex: string;
        width: number;
      }[] = [];

      /** ========= 解析表头 ========= */
      const parseColumns = (
        columns,
        rowIndex = 1,
        colIndex = 1
      ) => {
        let currentCol = colIndex;

        columns.forEach(col => {
          const leafCount = getLeafCount(col);

          // 写标题
          worksheet.getCell(rowIndex, currentCol).value = col.title || '';
          worksheet.getCell(rowIndex, currentCol).alignment = {
            horizontal: 'center',
            vertical: 'middle'
          };
          worksheet.getCell(rowIndex, currentCol).font = { bold: true };

          // 横向合并
          if (leafCount > 1) {
            worksheet.mergeCells(
              rowIndex,
              currentCol,
              rowIndex,
              currentCol + leafCount - 1
            );
          }

          if (col.children && col.children.length > 0) {
            // 递归子列
            currentCol = parseColumns(col.children, rowIndex + 1, currentCol);
          } else {
            // 叶子列
            flatColumns.push({
              title: col.title,
              dataIndex: col.dataIndex,
              width: col.width || 160
            });

            // 纵向合并（无子列）
            if (rowIndex < 2) {
              worksheet.mergeCells(rowIndex, currentCol, 2, currentCol);
            }

            currentCol++;
          }
        });

        return currentCol;
      };

      // 执行表头解析（两行表头）
      parseColumns(fullColumns);

      /** ========= 设置列宽 ========= */
      worksheet.columns = flatColumns.map(col => ({
        width: col.width / 8,
        alignment: { horizontal: 'center', vertical: 'middle' }
      }));

      // dataIndex → Excel 列号 映射
      const columnIndexMap: Record<string, number> = {};
      flatColumns.forEach((c, i) => {
        columnIndexMap[c.dataIndex] = i + 1;
      });

      /** ========= 写数据区 ========= */
      const dataStartRow = 3;

      dataSource.forEach((record, rowIdx) => {
        const rowNum = dataStartRow + rowIdx;

        flatColumns.forEach((col, colIdx) => {
          const value = record[col.dataIndex];
          worksheet.getCell(rowNum, colIdx + 1).value =
            value === 0 ? 0 : value || '--';
          worksheet.getCell(rowNum, colIdx + 1).alignment = {
            horizontal: 'center',
            vertical: 'middle'
          };
        });
      });

      /** ========= 写 Summary（第四部分） ========= */
      let summaryRow = dataStartRow + dataSource.length;

      // 合并“第四部分”
      worksheet.mergeCells(
        summaryRow,
        1,
        summaryRow + formItemList.length - 1,
        1
      );
      worksheet.getCell(summaryRow, 1).value = '第四部分';
      worksheet.getCell(summaryRow, 1).alignment = {
        horizontal: 'center',
        vertical: 'middle'
      };
      worksheet.getCell(summaryRow, 1).font = { bold: true };

      formItemList.forEach(formItem => {
        // 先填空列
        flatColumns.forEach((_, colIdx) => {
          // 跳过第 1 列（A 列，第四部分）
          if (colIdx === 0) return;
          worksheet.getCell(summaryRow, colIdx + 1).value = '--';
        });

        // 表格中显示 label 的位置（与你 Table 完全一致）6是 项目列 所在位置
        worksheet.getCell(summaryRow, 6).value = formItem.label;

        // begin_curr
        finalTitleExtraList.forEach(colItem => {
          const key = `${colItem.value}_begin_curr`;
          const colIndex = columnIndexMap[key];
          if (colIndex) {
            worksheet.getCell(summaryRow, colIndex).value =
              getColData('begin_curr', colItem.value, formItem.value);
          }
        });

        // next_end
        finalTitleExtraList.forEach(colItem => {
          const key = `${colItem.value}_next_end`;
          const colIndex = columnIndexMap[key];
          if (colIndex) {
            worksheet.getCell(summaryRow, colIndex).value =
              getColData('next_end', colItem.value, formItem.value);
          }
        });

        summaryRow++;
      });

      /** ========= 导出 ========= */
      const buffer = await workbook.xlsx.writeBuffer();
      saveAs(
        new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }),
        `在建项目资源结转表（公司级）_${year}.xlsx`
      );

    } catch (err) {
      console.error('Excel 导出失败', err);
    } finally {
      setExportLoading(false);
    }
  };


  return (
    <div>
      <Row justify={'space-between'}>
        <Col><strong style={{fontSize: 18}}>在建项目资源结转表（公司级）</strong></Col>
        <Col>
          <Space>
            <Button type={'primary'} onClick={() => {
              setVisible(true);
            }}>
              补充期间费用等
            </Button>
            <Button loading={exportLoading} type={'primary'} onClick={exportToExcel}>
              导出 Excel
            </Button>
          </Space>
        </Col>
      </Row>
      <div>
        <DatePicker picker={'year'} value={currDate} onChange={(date, dateString) => {
          setCurrDate(date);
          if(date) {
            setYear(date.format('YYYY'));
          }
        }}/>
      </div>
      {getColumns().length > 0 && (
        <Table
          style={{marginTop: 16}}
          bordered
          size={'small'}
          columns={getColumns()}
          scroll={{x: 3000, y: 800}}
          dataSource={dataSource}
          summary={pageData => {
            return (
              <>
                {formItemList.map((formItem, formIndex) => {
                  return (
                    <Table.Summary.Row>
                      {formIndex === 0 && (
                        <Table.Summary.Cell rowSpan={5} index={0} align="center">第四部分</Table.Summary.Cell>
                      )}
                      {getEmptyCols().map((item, index) => {
                        if (index === 4) {
                          return (
                            <Table.Summary.Cell index={emptyCount} align="center">{formItem.label}</Table.Summary.Cell>
                          )
                        }
                        return (
                          <Table.Summary.Cell index={index} align="center">--</Table.Summary.Cell>
                        )
                      })}
                      {finalTitleExtraList.map((colItem, colIndex) => {
                        return (
                          <Table.Summary.Cell index={emptyCount + colIndex + 1} align="center">
                            {getColData('begin_curr', colItem.value, formItem.value, )}
                          </Table.Summary.Cell>
                        )
                      })}
                      {finalTitleExtraList.map((colItem, colIndex) => {
                        return (
                          <Table.Summary.Cell index={emptyCount + colIndex + 1 + 7} align="center">
                            {getColData('next_end', colItem.value, formItem.value, )}
                          </Table.Summary.Cell>
                        )
                      })}
                    </Table.Summary.Row>
                  )
                })}
              </>
            );
          }}
        />
      )}
      {open && selectedRecord && (
        <ResourceOngoingProjectDetail
          open={open}
          actionRef={actionRef}
          selectedRecord={selectedRecord}
          authority={authority}
          onClose={() => setOpen(false)}
          callbackSuccess={() => {
            if(actionRef.current) {
              actionRef.current.reloadTable();
            }
          }}
        />
      )}
      {visible && (
        <AddModal
          year={year}
          visible={visible}
          onCancel={() => setVisible(false)}
          sysBasicDictList={sysBasicDictList}
          callbackSuccess={() => {
            setVisible(false);
            fetchList();
          }}
        />
      )}
    </div>
  )
}

export default connect(({common}: ConnectState) => ({
  sysBasicDictList: common.sysBasicDictList,
}))(ResourceOngoingProjectStaticticsPage);
