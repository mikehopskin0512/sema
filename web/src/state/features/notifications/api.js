import { get } from '../../utils/api';

export const getNotificationsToken = token =>
  get('/api/proxy/notification-token', '', token);
