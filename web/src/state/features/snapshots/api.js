import { create } from '../../utils/api';

export const postSnapshots = (params, token) => create('/api/proxy/snapshots', params, token);
