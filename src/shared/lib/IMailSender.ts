interface IMailSender {
  sendMail(to: string, subject: string, body: string): Promise<void>;
}

export { IMailSender };
