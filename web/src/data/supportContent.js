/* eslint-disable import/prefer-default-export */
import animationReactions from '../../components/onboarding/animationReactions.json';
import animationTags from '../../components/onboarding/animationTags.json';
import animationComments from '../../components/onboarding/animationComments.json';

export const content = [
  {
    title: 'Suggested Comments',
    subtitle: 'Leave better reviews by inserting pre-written snippets based on the world\'s top sources of coding knowledge + intenal best practices.',
    img: '/img/repo-suggested-comments.png',
    animationData: animationComments,
  },
  {
    title: 'Code Reactions',
    subtitle: 'Quickly summarize your review by choosing from a list of reactions. E.g. Awesome, Looks good, needs a fix, I have a question.',
    img: '/img/repo-smart-reactions.png',
    animationData: animationReactions,
  },
  {
    title: 'Auto-tagging',
    subtitle: 'Automatically categorize your comments with clear, mutually exclusive tags. E.g. Elegant, Secure, Readable',
    img: '/img/repo-smart-tags.png',
    animationData: animationTags,
  },
];