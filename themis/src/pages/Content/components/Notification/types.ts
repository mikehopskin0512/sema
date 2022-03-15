export interface INotification {
  title?: string;
  text?: string;
  delay?: number;
  type: 'success' | 'error';
  isClosedBtn: boolean;
}
