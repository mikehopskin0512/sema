import nock from 'nock';
import github from './github';
import jaxon from './jaxon';

export default function resetNocks() {
  nock.cleanAll();
  github();
  jaxon();
}
