import PageHeader from "../../components/PageHeader/PageHeader";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllData } from "../../features/user/userSlice";
import { schedulesData } from "../../features/schedules/schedulesSlice";
import { rgSchedulesData } from "../../features/regularSchedule/regularScheduleSlice";
import TodayScheduleTableList from "../../components/TodayScheduleTableList/TodayScheduleTableList";

const Dashboard = () => {
  const { totalScheduleCount, todayTotalCount } = useSelector(schedulesData);
  const { totalCount: totalParibahanCount } = useSelector(getAllData);
  const { totalCount } = useSelector(rgSchedulesData);

  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="row">
        <div className="col-xl-3 col-sm-6 col-12">
          <div className="card">
            <div className="card-body">
              <div className="dash-widget-header">
                <span className="dash-widget-icon text-primary border-primary">
                  <i className="fa fa-calendar" aria-hidden="true"></i>
                </span>
                <div className="dash-count">
                  <h3>{todayTotalCount}</h3>
                </div>
              </div>
              <div className="dash-widget-info">
                <h6 className="text-muted">Today&apos;s Bus Schedule</h6>
              </div>
            </div>
          </div>
        </div>
        <Link to="/regular-bus-schedule" className="col-xl-3 col-sm-6 col-12">
          <div className="card">
            <div className="card-body">
              <div className="dash-widget-header">
                <span className="dash-widget-icon text-primary border-primary">
                  <i className="fa fa-calendar" aria-hidden="true"></i>
                </span>
                <div className="dash-count">
                  <h3>{totalCount}</h3>
                </div>
              </div>
              <div className="dash-widget-info">
                <h6 className="text-muted">Regular Bus Schedule</h6>
              </div>
            </div>
          </div>
        </Link>
        <Link
          to="/total-bus-schedule-list"
          className="col-xl-3 col-sm-6 col-12"
        >
          <div className="card">
            <div className="card-body">
              <div className="dash-widget-header">
                <span className="dash-widget-icon text-primary border-primary">
                  <i className="fa fa-calendar" aria-hidden="true"></i>
                </span>
                <div className="dash-count">
                  <h3>{totalScheduleCount}</h3>
                </div>
              </div>
              <div className="dash-widget-info">
                <h6 className="text-muted">Schedule Log Book</h6>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/paribahan-users" className="col-xl-3 col-sm-6 col-12">
          <div className="card">
            <div className="card-body">
              <div className="dash-widget-header">
                <span className="dash-widget-icon text-success">
                  <i className="fa fa-bus" aria-hidden="true"></i>
                </span>
                <div className="dash-count">
                  <h3>{totalParibahanCount}</h3>
                </div>
              </div>
              <div className="dash-widget-info">
                <h6 className="text-muted">Total Bus Company</h6>
              </div>
            </div>
          </div>
        </Link>
      </div>
      <TodayScheduleTableList />
    </>
  );
};

export default Dashboard;
