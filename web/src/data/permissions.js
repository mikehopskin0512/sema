export const ViewAdmin = 'canViewAdmin';
export const EditUsers = 'canEditUsers';
export const EditComments = 'canEditComments';
export const EditGuides = 'canEditGuides';
export const ManageLinks = 'canManageLinks';

export const permissionsMap = {
  '/suggested-comments/add': [EditComments],
  '/suggested-comments/edit': [EditComments],
  '/sema-admin/users': [ViewAdmin],
  '/sema-admin/users/[userId]': [EditUsers],
  '/sema-admin/reports': [ViewAdmin],
  '/sema-admin/invites': [ViewAdmin],
};
