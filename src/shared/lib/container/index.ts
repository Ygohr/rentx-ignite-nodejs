import { container } from "tsyringe";
import { DateUtils } from "../implementations/DateUtils";

container.registerSingleton<IDateUtils>("DateUtils", DateUtils);
