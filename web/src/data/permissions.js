export const permissionsMap = {
  '/sema-admin/users': ['canEditUsers'],
  '/sema-admin/users/[userId]': ['canEditUsers'],
  '/sema-admin/reports': ['canViewAdmin'],
  '/sema-admin/invites': ['canViewAdmin'],
  '/teams/invite': ['canEditUsers'],
  '/labels-management': ['canEditUsers'],
};
