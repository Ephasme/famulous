export default interface Logger {
  info: (message: string) => void;
  debug: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string, exception?: Error) => void;
}
