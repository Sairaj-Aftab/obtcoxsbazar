import { auth } from "@/auth";
import BusProfile from "@/pages/BusProfile/BusProfile";

const Profile = async () => {
  const session = await auth();
  return (
    <div>
      <BusProfile user={session?.user} />
    </div>
  );
};

export default Profile;
