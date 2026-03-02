import React from 'react';
import { Radio, Space, Checkbox, Input } from "antd";
import { decodeMultiAnswer } from "./answerCodec";
import {QuestionStrategy} from "./types";

// 判断题
export const judgeStrategy: QuestionStrategy = {
  type: "judge",
  render: (q, { answerStr, onAnswerChange }) => (
    <Radio.Group value={answerStr} onChange={(e) => onAnswerChange(e.target.value)} style={{ width: "100%" }}>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Radio value="对" style={optionItemStyle}>
          <span style={{ fontSize: 15 }}>对</span>
        </Radio>
        <Radio value="错" style={optionItemStyle}>
          <span style={{ fontSize: 15 }}>错</span>
        </Radio>
      </Space>
    </Radio.Group>
  ),
};

// 单选题
export const singleStrategy: QuestionStrategy = {
  type: "single",
  render: (q, { answerStr, onAnswerChange }) => (
    <Radio.Group value={answerStr} onChange={(e) => onAnswerChange(e.target.value)} style={{ width: "100%" }}>
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        {q.newOptions?.map((op) => (
          <Radio key={op.option_id} value={op.option_label} style={optionItemStyle}>
            <span style={{ fontSize: 15 }}>
              {op.option_label}. {op.option_content}
            </span>
          </Radio>
        ))}
      </Space>
    </Radio.Group>
  ),
};

// 多选题（这里假设你的 type 叫 multi；你可按实际 value 改）
export const multiStrategy: QuestionStrategy = {
  type: "multi",
  render: (q, { answerStr, onAnswerChange }) => (
    <Checkbox.Group
      value={decodeMultiAnswer(answerStr)}
      onChange={(values) => onAnswerChange(values as string[])}
      style={{ width: "100%" }}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        {q.newOptions?.map((op) => (
          <Checkbox key={op.option_id} value={op.option_label} style={optionItemStyle}>
            <span style={{ fontSize: 15 }}>
              {op.option_label}. {op.option_content}
            </span>
          </Checkbox>
        ))}
      </Space>
    </Checkbox.Group>
  ),
};

// 以后扩展：简答题（示例）
export const shortAnswerStrategy: QuestionStrategy = {
  type: "other",
  render: (q, { answerStr, onAnswerChange }) => {

    const [local, setLocal] = React.useState(answerStr);

    React.useEffect(() => {
      setLocal(answerStr); // 外部变更时同步（比如回显）
    }, [answerStr]);


    return (
      <Input.TextArea
        value={local}
        onChange={(e) => {
          const val = e.target.value;
          setLocal(val);                // 立即更新 UI
        }}
        onBlur={() =>  onAnswerChange(local) }
        placeholder="请输入答案"
        autoSize={{ minRows: 3, maxRows: 8 }}
      />
    )
  },
};

const optionItemStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  border: "1px solid #d9d9d9",
  borderRadius: 8,
  marginLeft: 0,
};
