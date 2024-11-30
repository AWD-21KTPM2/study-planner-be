import dayjs from 'dayjs';

export const convertTimeFromSeconds = (time: number): string => {
  return dayjs.unix(time).toISOString();
};

export const convertTime = (time: Date): string => {
  return dayjs(time).toISOString();
};
