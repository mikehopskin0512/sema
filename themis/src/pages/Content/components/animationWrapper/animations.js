import { ANIMATION_TIME } from '../../constants';

const tagCardAnimationsVariants = {
  initial: {
    opacity: 0,
  },
  mount: {
    y: [-100, 0],
    opacity: 1,
    transition: {
      y: {
        duration: ANIMATION_TIME,
        ease: 'easeInOut',
      },
    },
  },
  unmount: {
    opacity: [0, 1],
    y: 0,
    transition: {
      opacity: {
        duration: ANIMATION_TIME,
        from: 1,
        to: 0,
        repeat: 0
      },
    },
  },
  stable: {
    y: 0,
    opacity: 1,
  },
};

export { tagCardAnimationsVariants }
