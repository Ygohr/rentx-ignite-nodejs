import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { IDateUtils } from "../IDateUtils";

dayjs.extend(utc);

export enum DiffUnit {
  day = "day",
  week = "week",
  quarter = "quarter",
  month = "month",
  year = "year",
  hour = "hour",
  minute = "minute",
  second = "second",
  millisecond = "millisecond"
}

class DateUtils implements IDateUtils {
  dateDiff(start_date: Date, interval: DiffUnit, end_date?: Date): number {
    const currentDate = dayjs().toDate();
    const formatedStartDate = this.convertToUTC(start_date);
    const formatedEndDate = this.convertToUTC(end_date ?? currentDate);
    const diff = dayjs(formatedStartDate).diff(formatedEndDate, interval);

    return diff;
  }

  convertToUTC(date: Date): string {
    return dayjs(date).utc().local().format();
  }

  dateAdd(value: number, interval: dayjs.OpUnitType): Date {
    return dayjs().add(value, interval).toDate();
  }
}

export { DateUtils };
