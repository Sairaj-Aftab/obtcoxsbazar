import { auth } from "@/auth";
import ProfileGuideInfo from "@/pages/ProfileGuideInfo/ProfileGuideInfo";

const GuideInfo = async () => {
  const session = await auth();
  return (
    <>
      <ProfileGuideInfo user={session?.user} />
    </>
  );
};

export default GuideInfo;
