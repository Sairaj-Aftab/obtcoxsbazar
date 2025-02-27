import ComponentLoader from "@/components/Loader/ComponentLoader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getLostAndFoundEntry } from "@/services/lostAndFoundEntry.service";
import { formatDateTime } from "@/utils/formatDateTime";
import { useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { useState } from "react";
import DataTable from "react-data-table-component";

const LostAndFoundList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [reportType, setReportType] = useState("ALL");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["lostAndFound", { page, limit, reportType, search }],
    queryFn: () => getLostAndFoundEntry({ page, limit, reportType, search }),
  });

  const calculateItemIndex = (page, limit, index) => {
    return (page - 1) * limit + index + 1;
  };

  const columns = [
    {
      name: "#",
      selector: (_, index) => calculateItemIndex(page, limit, index),
      width: "60px",
    },
    {
      name: "View",
      cell: (data) => (
        <div>
          <Eye className="w-5 text-primary-color text-lg cursor-pointer" />
        </div>
      ),
      width: "60px",
    },
    {
      name: "Type",
      selector: (data) => data.reportType,
      cell: (data) => (
        <>
          <p
            className={`${data.reportType === "LOST" && "text-blue"} ${
              data.reportType === "FOUND" && "text-primary-color"
            } font-bold`}
          >
            {data.reportType}
          </p>
        </>
      ),
      width: "100px",
    },
    {
      name: "Item",
      cell: (data) => (
        <div>
          <p className="font-semibold">
            {data.goods.length > 20
              ? `${data.goods.slice(0, 20)}...`
              : data.goods}
          </p>
          <p className="text-sm text-muted-foreground">
            {data.description.length > 20
              ? `${data.description.slice(0, 20)}...`
              : data.description}
          </p>
        </div>
      ),
      sortable: true,
      width: "250px",
    },
    {
      name: "Location",
      selector: (data) => data.place,
      sortable: true,
    },
    {
      name: "Date",
      selector: (data) => formatDateTime(data.dateTime),
      sortable: true,
    },
    {
      name: "Status",
      selector: (data) => data.status,
      cell: (data) => (
        <p
          className={`${data.status === "pending" && "text-blue"} ${
            data.status === "resolved" && "text-primary-color"
          } font-bold text-sm`}
        >
          {data.status}
        </p>
      ),
      width: "100px",
    },
  ];
  return (
    <Card className="container mx-auto">
      <CardHeader className="p-3">
        <CardTitle className="text-primary-color">
          Lost and Found Items
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="flex flex-col sm:flex-row gap-2 mb-2">
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-[300px]"
          />
          <Select
            value={reportType}
            onValueChange={(value) => setReportType(value)}
          >
            <SelectTrigger className="sm:max-w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Items</SelectItem>
              <SelectItem value="LOST">Lost Items</SelectItem>
              <SelectItem value="FOUND">Found Items</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="container mx-auto bg-white rounded-lg">
          <DataTable
            columns={columns}
            data={data?.reports || []}
            responsive
            progressPending={isLoading}
            progressComponent={
              <div className="bg-white h-[70vh]">
                <ComponentLoader />
              </div>
            }
            pagination
            paginationServer
            paginationTotalRows={data?.count}
            onChangeRowsPerPage={(rowPerPage) => setLimit(rowPerPage)}
            onChangePage={(page) => setPage(page)}
            paginationRowsPerPageOptions={[10, 20, 50, 100]}
          />
          <h1 className="bg-primary-color p-2 text-white text-sm font-normal text-center sm:text-start">
            জরুরি প্রয়োজনে কল করুন : ‍
            <a
              href="tel:+8801320108710"
              className="text-yellow text-base font-semibold"
            >
              01320-108710
            </a>
          </h1>
        </div>
      </CardContent>
    </Card>
  );
};

export default LostAndFoundList;
