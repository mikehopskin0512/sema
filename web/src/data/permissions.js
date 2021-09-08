export const ViewAdmin = 'canViewAdmin';
export const EditUsers = 'canEditUsers';
export const EditComments = 'canEditComments';
export const EditGuides = 'canEditGuides';
export const ManageLinks = 'canManageLinks';

export const permissionsMap = {
  '/collections/[collectionId]/add': [EditComments],
  '/collections/[collectionId]/edit': [EditComments],
  '/guides/[collectionId]/add': [EditGuides],
  '/guides/[collectionId]/edit': [EditGuides],
};
