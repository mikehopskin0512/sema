/* eslint-disable import/prefer-default-export */
const users = [
  {
    imgUrl: 'https://randomuser.me/api/portraits/men/34.jpg',
  },
  {
    imgUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    imgUrl: 'https://randomuser.me/api/portraits/women/29.jpg',
  },
  {
    imgUrl: 'https://randomuser.me/api/portraits/men/90.jpg',
  },
  {
    imgUrl: 'https://randomuser.me/api/portraits/men/90.jpg',
  },
  {
    imgUrl: 'https://randomuser.me/api/portraits/men/90.jpg',
  },
  {
    imgUrl: 'https://randomuser.me/api/portraits/men/90.jpg',
  },
];

export const favorites = [
  {
    id: '1234',
    name: 'Repo 1',
    language: 'Java',
    description: 'Bavarian bergkase emmental stinking bishop. Macaroni cheese roquefort airedale taleggio fondue port-salut everyone loves gouda. Bavarian bergkase emmental stinking bishop. Macaroni cheese roquefort airedale taleggio fondue port-salut everyone loves gouda.',
    stats: {
      codeReview: 4,
      comments: 29,
      commenters: 3,
      semaUsers: 3,
    },
    users,
  },
  {
    id: '1235',
    name: 'Repo 2',
    language: 'Javascript',
    description: 'Cheese slices cheesy feet taleggio cheese and wine cheese on toast swiss cheese and biscuits cut the cheese.',
    stats: {
      codeReview: 60,
      comments: 420,
      commenters: 7,
      semaUsers: 7,
    },
    users,
  },
  {
    id: '1236',
    name: 'Repo 3',
    language: 'Typescript',
    description: 'Cheese and biscuits feta camembert de normandie.',
    stats: {
      codeReview: 20,
      comments: 132,
      commenters: 4,
      semaUsers: 5,
    },
    users,
  },
];

export const repos = [
  ...favorites,
  ...favorites,
];

export const repositories = [
  {
    externalId: '265159550',
    __v: 0,
    cloneUrl: 'https://github.com/xandyreyes/e-learning-koa.git',
    createdAt: {
      $date: '2021-07-08T13:25:24.698Z',
    },
    description: 'Bavarian bergkase emmental stinking bishop. Macaroni cheese roquefort airedale taleggio fondue port-salut everyone loves gouda. Bavarian bergkase emmental stinking bishop. Macaroni cheese roquefort airedale taleggio fondue port-salut everyone loves gouda.',
    language: '',
    name: 'e-learning-koa',
    repositoryCreatedAt: null,
    repositoryUpdatedAt: null,
    type: 'github',
    updatedAt: {
      $date: '2021-07-08T13:25:24.698Z',
    },
  },
  {
    externalId: '293553582',
    __v: 0,
    cloneUrl: null,
    createdAt: {
      $date: '2021-07-08T12:59:09.110Z',
    },
    description: '',
    language: '',
    name: 'snugg-mobile',
    repositoryCreatedAt: null,
    repositoryUpdatedAt: null,
    type: 'github',
    updatedAt: {
      $date: '2021-07-08T12:59:09.110Z',
    },
  },
];