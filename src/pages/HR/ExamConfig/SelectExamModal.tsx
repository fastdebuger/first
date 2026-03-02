import { useState, useEffect } from "react"
import {
  Table,
  Modal,
  Form,
  Input,
  Button, Row, Col, message, Space, Popconfirm, Alert,
} from 'antd';
import type { ColumnsType } from "antd/lib/table"
import {addExamSession, queryExamPaperList} from "@/services/hr/exam";

import {ExamPaper} from "../exam";
import FormItemIsDatePicker from "./FormItemIsDatePicker";
import {ErrorCode} from "@/common/const";
import { FileText, Trash2 } from 'lucide-react';
import { deepArr } from '@/utils/utils-array';
import { isPaperExists, mergePaperLists } from '@/utils/utils';
import SelectPaperDetailDrawer from './SelectPaperDetailDrawer';

const FormItemIsAddModulePaper = (props: any) => {

  const { onChange } = props;

  const [visible, setVisible] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [showPaperList, setShowPaperList] = useState<any[]>([]);
  const [paperList, setPaperList] = useState<any[]>([]);
  const [detailVisible, setDetailVisible] = useState<boolean>(false);
  const [selectedPaper, setSelectedPaper] = useState<any>(null);

  const fetchPaperList = async () => {
    const res = await queryExamPaperList({
      sort: 'created_at',
      order: 'desc',
      filter: JSON.stringify([
        {Key: 'is_active', Val: '1', Operator: '='}
      ])
    })
    setPaperList(res.rows || [])
  }

  useEffect(() => {
    if (visible) {
      fetchPaperList();
    }
  }, [visible])

  const columns: ColumnsType<ExamPaper> = [
    {
      title: '系统',
      dataIndex: 'module_name',
      key: 'module_name',
      width: 120,
      ellipsis: true,
    },
    {
      title: '考试名称',
      dataIndex: 'paper_name',
      key: 'paper_name',
      width: 250,
      ellipsis: true,
    },
    // {
    //   title: '题目数量',
    //   dataIndex: 'question_count',
    //   key: 'question_count',
    //   width: 100,
    // },
    {
      title: '考试时长',
      dataIndex: 'exam_duration',
      key: 'exam_duration',
      width: 100,
      render: (duration: number) => `${duration}分钟`,
    },
    {
      title: '总分/及格分',
      key: 'score',
      width: 120,
      render: (_, record) => `${record.total_score}/${record.pass_score}`,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<FileText size={16} />} onClick={() => {
            setSelectedPaper(record);
            setDetailVisible(true);
          }}>
            查看考题
          </Button>
          <Popconfirm
            title="确定删除此试卷吗？"
            onConfirm={() => {
              const copyArr = deepArr(showPaperList);
              const filterArr = copyArr.filter((item: ExamPaper) => {
                return item.paper_id !== record.paper_id && item.module_code !== record.module_code;
              })
              setShowPaperList(filterArr);
            }}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger size="small" icon={<Trash2 size={16} />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        size="small"
        bordered
        title={() => (
          <Row justify="space-between">
            <Col></Col>
            <Col>
              <Button
                onClick={() => {
                  setVisible(true);
                }}
              >
                新增题库
              </Button>
            </Col>
          </Row>
        )}
        columns={columns}
        dataSource={showPaperList}
        rowKey="paper_id"
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 道题目`,
        }}
      />
      {visible && (
        <Modal
          width={'65%'}
          title="备选题库"
          visible={visible}
          open={visible}
          onCancel={() => setVisible(false)}
          onOk={() => {
            const newPaperList: any[] = deepArr(showPaperList);
            const newSelectedRows: any[] = deepArr(selectedRows);
            const filterArr = newSelectedRows.filter(row => {
              return isPaperExists(newPaperList, row.module_code);
            })
            if (filterArr.length > 0) {
              Modal.warn({
                title: '已存在',
                content: `已选择如下系统的题库：${filterArr.map(r => r.module_name).join(',')}`,
              })
              return;
            }
            const newRows = mergePaperLists(newPaperList, newSelectedRows);
            setShowPaperList(newRows);
            if (onChange) onChange(newRows);
            setVisible(false)
          }}
        >
          <Alert type={"info"} message={"选择需要的题库(可多选)"}/>
          <Table
            size="small"
            bordered
            rowSelection={{
              type: 'checkbox',
              onChange: (keys, rows) => {
                setSelectedRows(rows);
              },
            }}
            columns={[
              ...columns.filter(col => col.key != 'action'),
              {
                title: '操作',
                key: 'action',
                width: 120,
                fixed: 'right',
                render: (_, record) => (
                  <Space size="small">
                    <Button type="link" size="small" icon={<FileText size={16} />} onClick={() => {
                      setSelectedPaper(record);
                      setDetailVisible(true);
                    }}>
                      查看考题
                    </Button>
                  </Space>
                ),
              }
            ]}
            dataSource={paperList}
            rowKey="paper_id"
            pagination={{
              showSizeChanger: true,
              showTotal: (total) => `共 ${total} 道题目`,
            }}
          />
        </Modal>
      )}
      {detailVisible && selectedPaper && (
        <SelectPaperDetailDrawer
          paperId={selectedPaper?.paper_id}
          paperName={selectedPaper?.paper_name}
          paperTotalScore={selectedPaper?.total_score}
          moduleName={selectedPaper?.module_name}
          selectQuestionsModalVisible={detailVisible}
          onCancel={() => {
            setDetailVisible(false);
          }}
        />
      )}
    </>
  );
}

const SelectExamModal = (props: any) => {
  const { visible, onCancel } = props;
  const [form] = Form.useForm();

  return (
    <Modal
      title={`新建考试场次`}
      open={visible}
      visible={visible}
      onCancel={onCancel}
      width={'80%'}
      footer={(
        <Button type="primary" onClick={async () => {
          const values = await form.validateFields();
          console.log("values", values);

          const res = await addExamSession({
            session_name: values.session_name,
            session_description: values.session_description,
            start_time: values.start_time,
            options: JSON.stringify(values.options),
          })
          if (res.errCode === ErrorCode.ErrOk) {
            message.success("添加成功");
            onCancel();
          }
        }}>
          提 交
        </Button>
      )}
    >
      <div>
        <div>
          <Form
            form={form}
            layout="vertical"
            initialValues={{}}
          >
            <Form.Item name="session_name" label="考试标题" rules={[{ required: true, message: "请输入考试标题" }]}>
              <Input style={{width: '50%'}} placeholder="请输入考试标题" />
            </Form.Item>

            <Form.Item name="session_description" label="考试描述" rules={[{ required: true, message: "请输入考试描述" }]}>
              <Input.TextArea style={{width: '50%'}} placeholder="请输入考试描述" />
            </Form.Item>

            <Form.Item name="start_time" label="考试开始时间" rules={[{ required: true, message: "请选择考试开始时间" }]}>
              <FormItemIsDatePicker/>
            </Form.Item>

            <Form.Item
              name="options"
              label="考试题库"
              rules={[{ required: true, message: "请选择考试需要的题库" }]}
            >
              <FormItemIsAddModulePaper/>
            </Form.Item>

          </Form>
        </div>
      </div>
    </Modal>
  )
}

export default SelectExamModal;
