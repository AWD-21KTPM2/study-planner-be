export const AI_TASK_PLACEHOLDER = '__JSON_DATA__';

export const AI_GENERATE_CONST = {
  GEMINI_MODEL: 'gemini-1.5-flash',
  TASK_TEMPLATE: `
  Criteria:
    - 'Order to do' will base 'Start Date' first and then 'Priority'
  This is the template code for results:
  [{
    "no": 1,
    "taskName": "Task 1",
    "startDate": "17:00:00 13/11/2024",
    "endDate": "17:00:00 15/11/2024",
    "priority": "High",
    "status": "In Progress",
    "orderToDo": 1,
    "overlapWith": "Task 2",
    "overlappedPeriod": "17:00:00 15/11/2024 - 17:00:00 16/11/2024 && 17:00:00 17/11/2024 - 17:00:00 18/11/2024"
}]

  Tasks:
  ${AI_TASK_PLACEHOLDER}

  Only give me json array, not anymore text.
  `,
};

export const AI_FEEDBACK_CONST = {
  GEMINI_MODEL: 'gemini-1.5-flash',
  FEEDBACK_TEMPLATE: `
    This is data based on to generate feedback:
    ${AI_TASK_PLACEHOLDER}

    Criteria:
      - 'Feedback' will base on 'Total Actual Time' and 'Estimated Time'
      - Give notice about conflict time, overlap tasks, etc.
      - Identifying areas where the user is excelling.
      - Suggesting subjects or tasks that may need more attention.
      - Offering motivational feedback to encourage consistency and improvement.
    Give me clearly feedback, very short and many critical points, with each points only have two line at most. Specifically, what task, what attention should i concern for improvement and better time management.
  `,
};
