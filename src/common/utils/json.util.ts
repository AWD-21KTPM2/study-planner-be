export const clearJsonFromAI = (json: string): string => {
  // Remove the ```json prefix and trailing ``` (backticks)
  return json
    .replace(/^```json\s*/, '')
    .replace(/\`\`\`/g, '')
    .trim();
};
