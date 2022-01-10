import SuggestedCommentCard from '../../../../components/comment/suggestedCommentCard';
import React from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import withLayout from '../../../../components/layout';
import { TeamDashboardHelmet } from '../../../../components/utils/Helmet';
import withSelectedTeam from '../../../../components/auth/withSelectedTeam';
import useAuthEffect from '../../../../hooks/useAuthEffect';
import { getCollectionById } from '../../../../state/features/comments/actions';

// TODO: that component needs to be refactored after final design
const Snippets = () => {
  const dispatch = useDispatch();
  const {
    query: { teamId },
  } = useRouter();
  const { auth, teams } = useSelector(
    (state) => ({
      auth: state.authState,
      teams: state.teamsState.teams,
    }),
  );
  const { collection } = useSelector((state) => (state.commentsState));
  const { token } = auth;
  const team = teams?.find((it) => it.team._id === teamId)?.team;
  const collectionId = team?.collections[0];

  useAuthEffect(() => {
    if (collectionId) {
      dispatch(getCollectionById(collectionId, token));
    }
  }, [collectionId]);

  if (!team) {
    return null
  }

  return (
    <>
      <Helmet title={TeamDashboardHelmet.title} />
      <div className='sema-wide-container'>
        {team.name}
      </div>
      <div>
        {collection.comments?.map((comment) => (
          <SuggestedCommentCard
            data={comment}
            key={comment._id || index}
            collectionId={collectionId}
            selected={false}
            onSelectChange={() => {}}
            isEditable={false}
          />
        ))}
      </div>
    </>
  )
}

export default withSelectedTeam(withLayout(Snippets))
