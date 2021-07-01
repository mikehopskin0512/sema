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
    description: 'Bavarian bergkase emmental stinking bishop. Macaroni cheese roquefort airedale taleggio fondue port-salut everyone loves gouda.',
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
