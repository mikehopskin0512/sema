import React, { useCallback, useEffect, useState } from 'react';
import { ANIMATION_TIMEOUT, DELETE_OP } from '../../constants';
import { AnimationWrapper } from '../animationWrapper';
import { tagCardAnimationsVariants } from '../animationWrapper/animations';

const TAG_STATES = {
  MOUNT: 'mount',
  UNMOUNT: 'unmount',
  STABLE: 'stable'
}

const Tag = ({
  tag,
  updateSelectedTags,
}) => {
  const [tagState, setTagState] = useState(TAG_STATES.MOUNT);

  const isDeleting = tagState === TAG_STATES.UNMOUNT;
  const isStable = tagState === TAG_STATES.STABLE;

  const getAnimationVariant = useCallback(() => {
    if (isDeleting) return TAG_STATES.UNMOUNT;
    else if (isStable) return TAG_STATES.STABLE;
    return TAG_STATES.MOUNT;
  }, [isStable, isDeleting])

  useEffect(() => {
    setTagState(TAG_STATES.MOUNT);
  }, [])

  const onTagDelete = () => {
    setTagState(TAG_STATES.UNMOUNT);
    setTimeout(() => updateSelectedTags({
      tag,
      op: DELETE_OP,
    }), ANIMATION_TIMEOUT)
  }

  return (
    <AnimationWrapper
      animationVariants={tagCardAnimationsVariants}
      currentAnimation={getAnimationVariant()}
    >
      <span
        className='sema-tag sema-is-dark sema-is-rounded sema-mr-2'
        style={{ height: '2.5em' }}
      >
      {tag}
        <button
          aria-label={tag}
          type='button'
          className='sema-delete sema-is-small'
          onClick={onTagDelete}
        />
    </span>
    </AnimationWrapper>
  );
};

export default Tag;
