import nock from 'nock';
import github from './github';

export default function resetNocks() {
  nock.cleanAll();
  github();
}
