import Logger from "./interfaces/Logger";

export class ConsoleLogger implements Logger {
  info(message: string): void {
    console.log(message);
  }
  debug(message: string): void {
    console.log(message);
  }
  warn(message: string): void {
    console.warn(message);
  }
  error(message: string, exception?: Error): void {
    console.error(message + ` REASON: ${exception?.message}`);
  }
}
