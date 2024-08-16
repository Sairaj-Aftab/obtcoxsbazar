import { rgSchedulesData } from "../../features/regularBusSchedule/regularBusScheduleSlice";
import { useSelector } from "react-redux";
import RegularSchedule from "../../components/RegularSchedule/RegularSchedule";

const RegularBusSchedule = () => {
  const { rgSchedules, loader } = useSelector(rgSchedulesData);
  return (
    <RegularSchedule
      data={rgSchedules
        ?.slice()
        .sort((a, b) => new Date(a.time) - new Date(b.time))}
      loader={loader}
    />
  );
};

export default RegularBusSchedule;
