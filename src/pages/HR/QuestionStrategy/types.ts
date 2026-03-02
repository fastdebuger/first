import React from "react";

export type Question = {
  question_id: string;
  question_type: string; // single | judge | multi | other | ...
  question_content: string;
  max_score: number;
  newOptions?: { option_id: string; option_label: string; option_content: string }[];
  options?: { option_id: string; option_label: string; option_content: string }[];
};

export type RenderCtx = {
  answerStr: string;
  onAnswerChange: (val: string | string[]) => void;
};

export interface QuestionStrategy {
  type: string; // 对应 question.question_type
  render: (q: Question, ctx: RenderCtx) => React.ReactNode;
}
