import { container } from "tsyringe";
import { DateUtils } from "../DateUtils/DateUtils";
import { IDateUtils } from "../DateUtils/IDateUtils";
import { IMailSender } from "../MailSender/IMailSender";
import { MailSender } from "../MailSender/MailSender";
import { IStorage } from "../Storage/IStorage";
import { LocalStorage } from "../Storage/LocalStorage";

container.registerSingleton<IDateUtils>("DateUtils", DateUtils);
container.registerInstance<IMailSender>("MailSender", new MailSender());
container.registerSingleton<IStorage>("Storage", LocalStorage);
