import { QuestionStrategy } from "./types";
import { judgeStrategy, singleStrategy, multiStrategy, shortAnswerStrategy } from "./strategies";

export const questionStrategyRegistry = new Map<string, QuestionStrategy>([
  [judgeStrategy.type, judgeStrategy],
  [singleStrategy.type, singleStrategy],
  [multiStrategy.type, multiStrategy],
  [shortAnswerStrategy.type, shortAnswerStrategy],
]);

export function getStrategy(type: string): QuestionStrategy | undefined {
  return questionStrategyRegistry.get(type);
}
