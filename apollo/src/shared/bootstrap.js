import { indexComments } from '../comments/commentService';

const bootstrap = () => {
  // call non-blocking operations
  indexComments();
};

export default bootstrap;
