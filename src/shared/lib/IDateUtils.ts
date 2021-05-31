import dayjs from "dayjs";

interface IDateUtils {
  dateDiff(start_date: Date, interval: string, end_date?: Date): number;
  convertToUTC(date: Date): string;
  dateAdd(value: number, interval: dayjs.OpUnitType): Date;
}

export { IDateUtils };
