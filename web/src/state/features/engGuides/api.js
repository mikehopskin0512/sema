/* eslint-disable import/prefer-default-export */
import { getAll } from '../../utils/api';

export const getAllEngGuides = () => getAll('/api/proxy/comments/eng-guides', {});
