import React from "react";
import { useRouter } from 'next/router';
import SuggestedCommentCollection from "../../components/comment/suggestedCommentsList";
import CommentCollectionsList from "../../components/comment/commentCollectionsList";
import withLayout from '../../components/layout';

const CommentCollections = () => {
  const router = useRouter();
  const { query: { cid } } = router;

  if (cid) {
    return <SuggestedCommentCollection collectionId={cid} />
  }

  return <CommentCollectionsList />
};

export default withLayout(CommentCollections);
