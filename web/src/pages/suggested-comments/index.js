import React from "react";
import clsx from "clsx";
import { useRouter } from 'next/router';
import styles from './suggestedComments.module.scss';
import SuggestedCommentCollection from "../../components/comment/suggestedCommentsList";
import CommentCollectionsList from "../../components/comment/commentCollectionsList";
import withLayout from '../../components/layout';

const CommentCollections = () => {
  const router = useRouter();
  const { query: { cid } } = router;

  return (
    <div className={clsx(styles.container, 'my-40')}>
      { cid ? (
        <SuggestedCommentCollection collectionId={cid} />
      ) : (
        <CommentCollectionsList />
      ) }
    </div>
  )
};

export default withLayout(CommentCollections);
