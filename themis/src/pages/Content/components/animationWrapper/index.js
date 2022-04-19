import React from 'react';
import { motion } from 'framer-motion';

export const AnimationWrapper = ({ animationVariants, currentAnimation, children }) => {
  return (
    <motion.div
      initial='initial'
      animate={currentAnimation}
      variants={animationVariants}
    >
      {children}
    </motion.div>
  );
};
