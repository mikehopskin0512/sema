import animationReactions from './animationReactions.json';
import animationTags from './animationTags.json';
import animationComments from './animationComments.json';

export const content = [
  {
    title: 'Snippets',
    subtitle: [`Leave better reviews by inserting pre-written snippets based on the world’s top sources of coding knowledge + internal best practices.`],
    img: '/img/suggested-comments.png',
  },
  {
    title: 'Summaries',
    subtitle: ['Quickly summarize your review by choosing from a list of reactions.', 'E.g., Awesome, Looks good, Needs a fix, I have a question.'],
    img: '/img/onboarding/onboarding-reactions.png',
  },
  {
    title: 'Tags',
    subtitle: ['Automatically categorize your comments with clear, mutually exclusive tags.', 'E.g., Elegant, Secure, Readable'],
    img: '/img/tags.png',
  },
  {
    title: 'Add the Sema Extension!',
    subtitle: ['The Sema Chrome Extension makes code reviews more impactful. Please install it to continue.'],
    img: '/img/onboarding/install-extension.png'
  },
  {
    title: 'Sema is Better With Your Organization!',
    subtitle: ['Set up shared repos, insights and organization snippets to help your organization do more.'],
    img: '/img/onboarding/part-of-us.png'
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
