import {create} from '../../utils/api';

export const auth = (params) => create('/login', params);
