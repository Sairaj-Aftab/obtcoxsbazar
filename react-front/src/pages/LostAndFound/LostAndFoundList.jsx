import ComponentLoader from "@/components/Loader/ComponentLoader";
import avatar from "@/assets/image/no-image.jpg";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Calendar, Eye, User } from "lucide-react";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { Button } from "@/components/ui/button";

const LostAndFoundList = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [reportType, setReportType] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selectedData, setSelectedData] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["lostAndFound", { page, limit, reportType, search }],
    queryFn: () => getLostAndFoundEntry({ page, limit, reportType, search }),
  });

  // const calculateItemIndex = (page, limit, index) => {
  //   return (page - 1) * limit + index + 1;
  // };

  const columns = [
    {
      name: "App. No.",
      selector: (data) => data.applicationNo,
      width: "80px",
      style: {
        padding: "0 0 0 20px",
      },
    },
    {
      name: "View",
      cell: (data) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setSelectedData(data);
            setIsDialogOpen(true);
          }}
        >
          <Eye className="h-4 w-4 text-primary-color" />
        </Button>
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
      name: "Image",
      cell: (data) => (
        <img
          src={
            data.imageUrls && data.imageUrls.length > 0
              ? data.imageUrls[0]
              : avatar
          }
          alt={data.goods}
        />
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
    <div>
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
              অনুসন্ধানের জন্য কল করুন : ‍
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
      {selectedData && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-h-[95vh] sm:max-w-5xl overflow-y-auto">
            <DialogHeader className="p-0">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-bold">
                  Item Details
                </DialogTitle>
                <Badge
                  variant={
                    selectedData.reportType === "LOST"
                      ? "destructive"
                      : "default"
                  }
                  className="text-sm"
                >
                  {selectedData.reportType}
                </Badge>
              </div>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
              {/* Left column - Images */}
              <div className="space-y-2">
                <div className="rounded-lg h-[300px] w-full">
                  <img
                    src={
                      selectedData.imageUrls &&
                      selectedData.imageUrls.length > 0
                        ? selectedData.imageUrls[0]
                        : avatar
                    }
                    alt={selectedData.goods || "Item image"}
                    className="h-full w-auto object-contain mx-auto"
                  />
                </div>

                <Card>
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{selectedData.name}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right column - Details */}
              <div className="space-y-2">
                <div>
                  <h3 className="text-xl font-bold">{selectedData.goods}</h3>
                  <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDateTime(selectedData.dateTime)}</span>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">
                    {selectedData.description || "No description provided."}
                  </p>
                </div>

                {selectedData.place && (
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">
                      Location of{" "}
                      {selectedData.reportType === "LOST" ? "Lost" : "Found"}
                    </h4>
                    <p className="text-muted-foreground">
                      {selectedData.place}
                    </p>
                  </div>
                )}

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Application Number</h4>
                  <p className="text-muted-foreground">
                    #{selectedData.applicationNo}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default LostAndFoundList;
