import sample from 'lodash/sample';

process.env.NODE_ENV = 'test';

jest.mock('lodash/sample');
sample.mockImplementation((array) => array[0]);
