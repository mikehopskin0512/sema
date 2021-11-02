import animationReactions from './animationReactions.json';
import animationTags from './animationTags.json';
import animationComments from './animationComments.json';

export const content = [
  {
    title: 'Smart Reactions',
    subtitle: 'Provide more actionable feedback with Sema’s auto-suggested smart reactions. As you type, Sema will calculate the right reaction for you. Click to override at any time.',
    img: '/img/onboarding-reactions.png',
    animationData: animationReactions,
  },
  {
    title: 'Smart Tags',
    subtitle: 'Quickly summarize your feedback with a carefully selected set of mutually exclusive tags. As you type, Sema will calculate the right tags for you or explore your own.',
    img: '/img/tags.png',
    animationData: animationTags,
  },
  {
    title: 'Suggested Snippets',
    subtitle: 'Write great comments faster by quickly searching for and inserting pre-written comments from some of the best knowledge bases in the world, and add your own!',
    img: '/img/suggested-comments.png',
    animationData: animationComments,
  },
];

export const commentCollection = [
  {
    title: 'Common Comments',
    subtitle: 'Frequently used statements and questions when conducting code reviews',
    field: 'commonComments',
  },
  {
    title: 'Philosophies',
    subtitle: 'General statements about coding best practices.',
    field: 'philosophies',
  },
  {
    title: 'Security',
    subtitle: 'Mitre’s Common Weakness Enumeration (CWE): a community-developed list of software and hardware weakness types.',
    field: 'security',
  },
  {
    title: 'Functional review',
    subtitle: 'Formal categorization of where the code as written does or does not meet the provided product requirements',
    field: 'functionalReview',
  },
  {
    title: 'AirBnB Style Guide for JavaScript',
    subtitle: 'Frequently used statements and questions when conducting code reviews',
    field: 'airbnbJs',
  },
  {
    title: 'AirBnB Style Guide for React / JSX',
    subtitle: 'Add on style guide from AirBnB for React and JSX. ',
    field: 'airbnbReact',
  },
  {
    title: 'Famous quotes',
    subtitle: 'Quotes from famous people, real or pretend, that we think have something to say about code reviews ;0',
    field: 'famousQuotes',
  },
  {
    title: 'My Snippets',
    subtitle: 'Have a code review comment you frequently reuse? Add it here and it will be ready for your next review.',
    field: 'personalComments',
  },
];
