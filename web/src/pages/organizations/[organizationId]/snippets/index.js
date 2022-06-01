import SuggestedCommentCard from '../../../../components/comment/suggestedCommentCard';
import React from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import withLayout from '../../../../components/layout';
import { OrganizationDashboardHelmet } from '../../../../components/utils/Helmet';
import withSelectedOrganization from '../../../../components/auth/withSelectedOrganization';
import useAuthEffect from '../../../../hooks/useAuthEffect';
import { getCollectionById } from '../../../../state/features/comments/actions';

// TODO: that component needs to be refactored after final design
const Snippets = () => {
  const dispatch = useDispatch();
  const {
    query: { organizationId },
  } = useRouter();
  const { auth, organizations } = useSelector(
    (state) => ({
      auth: state.authState,
      organizations: state.organizationsNewState.organizations,
    }),
  );
  const { collection } = useSelector((state) => (state.commentsState));
  const { token } = auth;
  const organization = organizations?.find((it) => it.organization._id === organizationId)?.organization;
  const collectionId = organization?.collections[0];

  useAuthEffect(() => {
    if (collectionId) {
      dispatch(getCollectionById(collectionId, token));
    }
  }, [collectionId]);

  if (!organization) {
    return null
  }

  return (
    <>
      <Helmet title={OrganizationDashboardHelmet.title} />
      <div className='sema-wide-container'>
        {organization.name}
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

export default withSelectedOrganization(withLayout(Snippets))
