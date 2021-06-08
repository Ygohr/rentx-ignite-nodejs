import { container } from "tsyringe";
import { IDateUtils } from "../IDateUtils";
import { IMailSender } from "../IMailSender";
import { DateUtils } from "../implementations/DateUtils";
import { MailSender } from "../implementations/MailSender";

container.registerSingleton<IDateUtils>("DateUtils", DateUtils);
container.registerInstance<IMailSender>("MailSender", new MailSender());
