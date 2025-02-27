import { useState } from "react";
import {
  Anchor,
  Users,
  Truck,
  Building2,
  Calendar,
  ClipboardList,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader/PageHeader";
import useDataCount from "@/store/useDataCount";

const Dashboard = () => {
  const { dataCount, isLoading } = useDataCount();
  const [activeCard, setActiveCard] = useState(0);
  const dashboardData = [
    {
      title: "Paribahans",
      value: dataCount?.totalParibahansCompanyCount,
      icon: Building2,
    },
    {
      title: "Buses",
      value: dataCount?.totalParibahansCount,
      icon: Truck,
    },
    { title: "Drivers", value: dataCount?.totalDriverCount, icon: Users },
    { title: "Guides", value: dataCount?.totalGuideCount, icon: Users },
    {
      title: "Permissions",
      value: dataCount?.totalPermissionCount,
      icon: ClipboardList,
    },
    {
      title: "Schedule Log",
      value: dataCount?.totalSchedulesCount,
      icon: Calendar,
    },
    {
      title: "Regular Schedule",
      value: dataCount?.totalRegularSchedulesCount,
      icon: Calendar,
    },
    {
      title: "Today's Schedule",
      value: dataCount?.todaysSchedulesCount,
      icon: Calendar,
    },
  ];

  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {dashboardData.map((item, index) => (
          <Card
            key={index}
            className={`group transition-all duration-300 ease-in-out transform hover:scale-105 ${
              index === activeCard
                ? "bg-primary text-primary-foreground"
                : "hover:bg-primary/10"
            }`}
            onClick={() => setActiveCard(index)}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {item.title}
                {isLoading && (
                  <Loader2 className="animate-spin w-6 h-6 mt-3 text-primary" />
                )}
              </CardTitle>
              <item.icon
                className={`w-4 h-4 ${
                  index === activeCard
                    ? "text-primary-foreground"
                    : "text-muted-foreground group-hover:text-primary"
                }`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              {index === activeCard && (
                <Anchor className="absolute top-2 right-2 w-4 h-4 text-primary-foreground" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
