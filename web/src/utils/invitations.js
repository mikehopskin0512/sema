export const isInvitationPending = (redemptions, recipient) => !redemptions.some(r => r?.user?.username === recipient);
