// 考试系统类型定义

export interface ExamPaper {
  paper_id: string
  paper_name: string
  personal_type: string
  personal_type_name: string
  group_code?: string
  group_name?: string
  exam_duration: number
  total_score: number
  pass_score: number
  is_active: boolean
  exam_start_time?: Date
  exam_end_time?: Date
  registration_deadline_minutes: number
  question_count: number
  created_at?: string
  updated_at?: string
  module_name?: string;
  module_code?: string;
}

export interface Question {
  question_id: string
  paper_id: string
  question_type: "single" | "multiple" | "judge"
  question_content: string
  correct_answer: string
  score: number
  score_override: number;
  sort_order: number
  options?: QuestionOption[]
}

export interface QuestionItem {
  question_id: string
  module_code: string
  question_content: string
  question_type: 'single' | 'multiple' | 'judge'
  correct_answer: string
  is_correct: number
  score: number
  options?: QuestionOption[]
  created_at: string
}


export interface QuestionOption {
  option_id: string
  question_id: string
  option_label: string
  option_content: string
  sort_order: number
}

export interface ExamRecord {
  record_id: string
  user_code: string
  paper_id: string
  role_code?: string
  start_time: string
  end_time?: string
  total_score: number
  user_score: number
  status: "in_progress" | "completed"
  created_at?: string
  updated_at?: string
}

export interface ExamAnswer {
  answer_id: string
  record_id: string
  question_id: string
  user_answer?: string
  is_correct: boolean
  score: number
  created_at?: string
}

export interface User {
  user_code: string
  user_name: string
  other_count: string
  roles: UserRole[]
}

export interface UserRole {
  group_code: string
  group_name: string
}
