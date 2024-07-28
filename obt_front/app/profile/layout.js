import { auth } from "@/auth";
import ProfileHeader from "@/components/ProfileHeader/ProfileHeader";

export default async function ProfileLayout({ children }) {
  const session = await auth();
  return (
    <section>
      <ProfileHeader user={session?.user} />
      {children}
    </section>
  );
}
