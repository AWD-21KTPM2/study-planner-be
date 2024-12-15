export const AI_TASK_PLACEHOLDER = '__JSON_DATA__';

export const AI_GENERATE_CONST = {
  TASK_TEMPLATE: `
  Criteria:
    - 'Order to do' will base 'Start Date' first and then 'Priority'
  This is the template code for results:
  <table>
        <thead>
            <tr>
                <th>No.</th>
                <th>Task name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Priority</th>
                <th>Order to do</th>
                <th>Overlap with</th>
                <th>Overlapped period</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>Frontend Exercise</td>
                <td>18:00 13/01/2020</td>
                <td>20:00 24/01/2020</td>
                <td>High</td>
                <td>1</td>
                <td>Task 2</td>
            </tr>
        </tbody>
    </table>

  Tasks:
  ${AI_TASK_PLACEHOLDER}
  
  Only give me html code for the table to show. 
  `,
};
