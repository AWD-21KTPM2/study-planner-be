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
