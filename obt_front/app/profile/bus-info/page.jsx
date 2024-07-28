import { auth } from "@/auth";
import ProfileBusInfo from "@/pages/ProfileBusInfo/ProfileBusInfo";

const BusInfo = async () => {
  const session = await auth();
  return <ProfileBusInfo user={session?.user} />;
};

export default BusInfo;
