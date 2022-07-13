import { create } from '../../utils/api';

export const connectOrganization = (token) => create('/api/proxy/identities/github/connect-orgs', {}, token);
