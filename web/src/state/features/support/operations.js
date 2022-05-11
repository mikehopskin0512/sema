import * as actions from './actions';
import { fetchIntercomKnowledgeBase } from './api';

const fetchKnowledgeBase = async (token) => {
    const {data: {data}} = await fetchIntercomKnowledgeBase(token);
    return data;
  };
  
  export default { ...actions, fetchKnowledgeBase };