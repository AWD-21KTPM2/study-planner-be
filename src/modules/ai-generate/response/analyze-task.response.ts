export interface AnalyzeTaskResponse {
  no: number;
  taskName: string;
  startDate: string;
  endDate: string;
  priority: string;
  status: string;
  orderToDo: number;
  overlapWith: string;
  overlappedPeriod: string;
}
