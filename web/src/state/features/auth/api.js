import { create as createSMP } from '../../utils/api';
import { get, getAll, create } from '../../utils/apiApollo';

export const auth = (params) => createSMP('/login', params);
export const createUser = (params) => create('/v1/users', params);
