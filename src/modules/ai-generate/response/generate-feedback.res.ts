export interface GenerateFeedbackResponse {
  _id?: string;
  name: string;
  estimatedTime: number;
  priority: string;
  status: string;
  startDate: string;
  endDate: string;
  totalActualTime?: number;
}
