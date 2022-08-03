import nock from 'nock';
import github from './github';
import jaxon from './jaxon';

export default function resetNocks() {
  nock.cleanAll();
  setDefaultNocks();
}

export function setDefaultNocks() {
  github();
  jaxon();
}
