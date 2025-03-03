import Loading from "@/components/Loading/Loading";
import avatar from "@/assets/img/no-image.jpg";
import PageHeader from "@/components/PageHeader/PageHeader";
import { useAllLostFound } from "@/services/lostFound.service";
import { formatDateTime } from "@/utils/timeAgo";
import { Calendar, Eye, MapPin, Phone, Tag, User } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toPng } from "html-to-image";

const LostFound = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [page, setPage] = useState(1);
  const [rowPage, setRowPage] = useState(10);
  const [filters, setFilters] = useState({});
  const { data, isLoading } = useAllLostFound({
    page,
    limit: rowPage,
    filters,
  });
  const ref = useRef(null);

  const handleDownload = useCallback(() => {
    if (!ref.current) {
      console.log("ref is null");
      return;
    }

    toPng(ref.current, { cacheBust: true, backgroundColor: "#ffffff" })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `lost-found-item-${
          selectedData?.applicationNo || "details"
        }.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectedData?.applicationNo]);

  const calculateItemIndex = (page, limit, index) => {
    return (page - 1) * limit + index + 1;
  };

  const columns = [
    {
      name: "#",
      selector: (_, index) => calculateItemIndex(page, rowPage, index),
      width: "60px",
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
          <Eye className="h-4 w-4 text-primary" />
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
            className={`${data.reportType === "LOST" && "text-red-500"} ${
              data.reportType === "FOUND" && "text-primary"
            } font-bold`}
          >
            {data.reportType}
          </p>
        </>
      ),
      width: "100px",
    },
    {
      name: "Photo",
      cell: (data) => (
        <img
          src={data.imageUrls ? data.imageUrls[0] : avatar}
          alt=""
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
        />
      ),
    },
    {
      name: "Category",
      selector: (data) => data.statusType,
      sortable: true,
    },
    {
      name: "Name",
      selector: (data) => data.name,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (data) => data.phone,
      sortable: true,
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
      <PageHeader title={"Lost & Found"} />
      <DataTable
        columns={columns}
        data={data?.reports}
        responsive
        progressPending={isLoading}
        progressComponent={
          <div className="h-96 flex justify-center items-center">
            <Loading />
          </div>
        }
        pagination
        paginationServer
        paginationTotalRows={data?.count}
        onChangeRowsPerPage={(value) => setRowPage(value)}
        onChangePage={(page) => setPage(page)}
        paginationRowsPerPageOptions={[10, 20, 50, 100]}
      />
      {selectedData && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent
            ref={ref}
            className="max-h-[95vh] sm:max-w-5xl overflow-y-auto"
          >
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {/* Left column - Images */}
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden bg-muted h-[300px] w-full">
                  <img
                    src={
                      selectedData.imageUrls &&
                      selectedData.imageUrls.length > 0
                        ? selectedData.imageUrls[activeImage]
                        : avatar
                    }
                    onError={(e) => {
                      e.target.src = "/fallback-image.jpg"; // Set a default image
                      e.target.onerror = null; // Prevent infinite loops
                    }}
                    alt={selectedData.goods || "Item image"}
                    className="w-full h-full object-cover"
                  />
                </div>

                {selectedData.imageUrls &&
                  selectedData.imageUrls.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {selectedData.imageUrls.map((url, index) => (
                        <div
                          key={index}
                          className={`relative h-16 w-16 rounded-md overflow-hidden cursor-pointer border-2 ${
                            activeImage === index
                              ? "border-primary"
                              : "border-transparent"
                          }`}
                          onClick={() => setActiveImage(index)}
                        >
                          <img
                            src={url || "/placeholder.svg"}
                            alt={`Thumbnail ${index + 1}`}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">
                      Item Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Category:</span>
                        <span>{selectedData.statusType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            selectedData.status === "RESOLVED"
                              ? "outline"
                              : "secondary"
                          }
                          className="capitalize"
                        >
                          {selectedData.status?.toLowerCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Date:</span>
                        <span>{formatDateTime(selectedData.dateTime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Location:</span>
                        <span>{selectedData.place}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right column - Details */}
              <div className="space-y-3">
                {/* Item Details */}
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

                  {selectedData.policeReport && (
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Police Report</h4>
                      <p className="text-muted-foreground">
                        {selectedData.policeReport}
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

                {/* Contact Information */}
                <Card>
                  <CardContent className="p-4 space-y-4">
                    <h3 className="font-semibold text-lg mb-2">
                      Contact Information
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{selectedData.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{selectedData.phone}</p>
                      </div>
                    </div>

                    {selectedData.address && (
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <MapPin className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Address
                          </p>
                          <p className="font-medium">{selectedData.address}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
            {/* <Button onClick={handleDownload}>Download Image</Button> */}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default LostFound;
