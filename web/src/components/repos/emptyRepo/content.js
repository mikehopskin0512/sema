import animationReactions from '../../onboarding/animationReactions.json';
import animationTags from '../../onboarding/animationTags.json';
import animationComments from '../../onboarding/animationComments.json';

export const content = [
  {
    title: 'Smart Tags',
    subtitle: 'Quickly summarize your feedback with a carefully selected set of mutually exclusive tags. As you type, Sema will calculate the right tags for you or explore your own.',
    img: '/img/repo-smart-tags.png',
    animationData: animationTags,
    subtitleHtml: '<b>Quickly summarize your feedback</b> with a carefully selected set of mutually exclusive tags. As you type, Sema will calculate the right tags for you or explore your own.',
  },
  {
    title: 'Smart Reactions',
    subtitle: 'Provide more actionable feedback with Sema’s auto-suggested smart reactions. As you type, Sema will calculate the right reaction for you. Click to override at any time.',
    img: '/img/repo-smart-reactions.png',
    animationData: animationReactions,
    subtitleHtml: '<b>Provide more actionable feedback</b> with Sema’s auto-suggested smart reactions. As you type, Sema will calculate the right reaction for you. Click to override at any time.',
  },
  {
    title: 'Suggested Comments',
    subtitle: 'Write great comments faster by quickly searching for and inserting pre-written comments from some of the best knowledge bases in the world. And add your own!',
    img: '/img/repo-suggested-comments.png',
    animationData: animationComments,
    subtitleHtml: '<b>Write great comments faster</b> by quickly searching for and inserting pre-written comments from some of the best knowledge bases in the world. And add your own!',
  },
];