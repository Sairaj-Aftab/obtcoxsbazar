import { SessionProvider } from "next-auth/react";
const SessionProviders = ({ session, children }) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default SessionProviders;
