import dayjs from "dayjs";

interface IDateUtils {
  dateDiff(start_date: Date, interval: string, end_date?: Date): number;
  convertToUTC(date: Date): string;
  dateAdd(value: number, interval: dayjs.OpUnitType): Date;
  dateIsBefore(start_date: Date, end_date: Date): boolean;
}

export { IDateUtils };
