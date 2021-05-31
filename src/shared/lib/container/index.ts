import { container } from "tsyringe";
import { IDateUtils } from "../IDateUtils";
import { DateUtils } from "../implementations/DateUtils";

container.registerSingleton<IDateUtils>("DateUtils", DateUtils);
