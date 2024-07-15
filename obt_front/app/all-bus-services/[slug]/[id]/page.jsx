import BusInformation from "@/pages/BusInformation/BusInformation";

const BusInfo = async ({ params }) => {
  return (
    <>
      <BusInformation params={params} />
    </>
  );
};

export default BusInfo;
