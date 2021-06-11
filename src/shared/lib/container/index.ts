import { container } from "tsyringe";
import { DateUtils } from "../DateUtils/DateUtils";
import { IDateUtils } from "../DateUtils/IDateUtils";
import { IMailSender } from "../MailSender/IMailSender";
import { MailSender } from "../MailSender/MailSender";
import { IStorage } from "../Storage/IStorage";
import { LocalStorage } from "../Storage/LocalStorage";
import { S3Storage } from "../Storage/S3Storage";

container.registerSingleton<IDateUtils>("DateUtils", DateUtils);
container.registerInstance<IMailSender>("MailSender", new MailSender());

const diskStorage = {
  local: LocalStorage,
  s3: S3Storage
};

container.registerSingleton<IStorage>("Storage", diskStorage[process.env.DISK]);
