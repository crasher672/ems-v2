import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
  const session = useSession();

  return session.data?.user;
};
export const useCurrentUserId = () => {
  const session = useSession();

  return session.data?.user.id;
};

