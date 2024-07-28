import { auth } from "@/auth";
import ProfileDriverInfo from "@/pages/ProfileDriverInfo/ProfileDriverInfo";

const DriverInfo = async () => {
  const session = await auth();
  return (
    <>
      <ProfileDriverInfo user={session?.user} />
    </>
  );
};

export default DriverInfo;
