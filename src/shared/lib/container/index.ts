import { container } from "tsyringe";
import { IDateUtils } from "../IDateUtils";
import { IMailSender } from "../IMailSender";
import { DateUtils } from "../implementations/DateUtils";
import { EtherealMailSender } from "../implementations/EtherealMailSender";

container.registerSingleton<IDateUtils>("DateUtils", DateUtils);
container.registerInstance<IMailSender>("EtherealMailSender", new EtherealMailSender());
