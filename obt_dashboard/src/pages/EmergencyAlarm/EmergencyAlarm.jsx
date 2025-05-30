import DataTable from "react-data-table-component";
import avatar from "../../assets/img/no-image.jpg";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useEffect, useState } from "react";
import { formatDateTime } from "../../utils/timeAgo";
import Loading from "../../components/Loading/Loading";
import useAuth from "@/store/useAuth";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Bus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Eye,
  MapPin,
  MessageSquare,
  Trash2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  useDeleteAlarm,
  useGetAllAlarm,
} from "@/services/emergencyAlarm.service";

const EmergencyAlarm = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowPage, setRowPage] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data, isLoading } = useGetAllAlarm({ page, limit: rowPage, search });
  const deleteAlarm = useDeleteAlarm();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  const { authUser } = useAuth();
  const [review, setReview] = useState(null);

  useEffect(() => {
    if (deleteAlarm.error) {
      toast("Error", {
        description: `${
          deleteAlarm?.error?.response?.data?.message ||
          deleteAlarm?.error?.message
        }`,
      });
    }
  }, [deleteAlarm.error]);

  const columns = [
    {
      name: "ID",
      selector: (data) => data.alarmId,
      width: "60px",
    },
    {
      name: "View",
      cell: (data) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setReview(data);
            setIsDialogOpen(true);
          }}
        >
          <Eye className="h-4 w-4 text-primary" />
        </Button>
      ),
      width: "60px",
    },
    {
      name: "Photo",
      cell: (data) => (
        <div
          className="relative w-[100px] h-[100px] cursor-pointer"
          onClick={() => {
            if (data.imageUrls.length > 0) {
              setReview(data);
              setSelectedImageIndex(0);
              setIsFullscreenOpen(true);
            }
          }}
        >
          <img
            src={data.imageUrls.length > 0 ? data.imageUrls[0] : avatar}
            alt=""
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
          {data.imageUrls.length > 1 && (
            <Badge className="absolute bottom-1 right-1 bg-black/70">
              +{data.imageUrls.length - 1}
            </Badge>
          )}
        </div>
      ),
    },
    {
      name: "Paribahan",
      selector: (data) => data.paribahanName,
      sortable: true,
    },
    {
      name: "Reg No",
      selector: (data) => data.regNo,
      sortable: true,
    },
    {
      name: "location",
      selector: (data) => data.locationName,
      cell: (data) => (
        <div className="flex items-center gap-2">
          {data?.location?.coordinates[0] && data?.location?.coordinates[1] && (
            <MapPin
              className="h-5 w-5 text-primary cursor-pointer"
              onClick={() => {
                window.open(
                  `https://www.google.com/maps?q=${data.location.coordinates[1]},${data.location.coordinates[0]}`,
                  "_blank"
                );
              }}
            />
          )}
          <span>{data.locationName}</span>
        </div>
      ),
    },

    {
      name: "Name",
      selector: (data) => data.name,
    },
    {
      name: "description",
      selector: (data) => data.description,
    },
    {
      name: "Phone number",
      selector: (data) => data.phoneNumber,
    },

    {
      name: "IP Address",
      selector: (data) => data.ipAddress,
    },
    {
      name: "Entry Date",
      selector: (data) => formatDateTime(data.createdAt),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (data) => (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              disabled={authUser?.role?.name === "VIEWER"}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                review and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteAlarm.mutate(data.id)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
      right: true, // Align the column to the right
    },
  ];
  return (
    <div>
      <PageHeader title="Emergency Alarm" />
      <Input
        type="text"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="my-3"
      />
      <DataTable
        columns={columns}
        data={data?.alarms}
        responsive
        progressPending={isLoading}
        progressComponent={
          <div className="h-96 flex justify-center items-center">
            <Loading />
          </div>
        }
        pagination
        paginationServer
        paginationTotalRows={
          data?.searchCount ? data?.searchCount : data?.totalCount
        }
        onChangeRowsPerPage={(value) => setRowPage(value)}
        onChangePage={(page) => setPage(page)}
        paginationRowsPerPageOptions={[10, 20, 50, 100]}
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[95vh] sm:max-w-[425px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Bus className="h-5 w-5 text-primary" />
              {review?.paribahanName}
            </DialogTitle>
            <DialogDescription>Detailed alarm</DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-3">
            <div>
              <h4 className="text-sm font-semibold">{review?.name}</h4>
              <p className="text-sm font-semibold text-primary">
                <a href={`tel:${review?.phoneNumber}`}>{review?.phoneNumber}</a>
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Trip Details</h4>
              <div className="grid gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-xs">
                    <MapPin
                      className="h-3 w-3 mr-1"
                      onClick={() => {
                        window.open(
                          `https://www.google.com/maps?q=${review.location.coordinates[1]},${review.location.coordinates[0]}`,
                          "_blank"
                        );
                      }}
                    />
                    {review?.locationName}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Bus className="h-4 w-4" /> Reg No: {review?.regNo}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4 inline mr-2" />
                {review?.description}
              </p>
            </div>

            {review?.imageUrls?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2">Images</h4>
                <div className="grid grid-cols-3 gap-2">
                  {review.imageUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative h-20 w-full cursor-pointer rounded overflow-hidden"
                      onClick={() => {
                        setSelectedImageIndex(index);
                        setIsFullscreenOpen(true);
                      }}
                    >
                      <img
                        src={url || "/placeholder.svg"}
                        alt={`Alarm image ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Review ID: #{review?.alarmId}</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDateTime(review?.createdAt)}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Fullscreen Image Viewer */}
      {isFullscreenOpen && review?.imageUrls?.length > 0 && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/95">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-50 rounded-full bg-black/50 hover:bg-black/70 text-white"
            onClick={() => setIsFullscreenOpen(false)}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close fullscreen view</span>
          </Button>

          <div className="relative h-[80vh] w-[90vw] md:w-[80vw]">
            <img
              src={review.imageUrls[selectedImageIndex] || "/placeholder.svg"}
              alt={`Review image ${selectedImageIndex + 1}`}
              className="h-full w-full object-contain"
            />
          </div>

          {review.imageUrls.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/70 text-white border-gray-600"
                onClick={() =>
                  setSelectedImageIndex((prev) =>
                    prev === 0 ? review.imageUrls.length - 1 : prev - 1
                  )
                }
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Previous image</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/70 text-white border-gray-600"
                onClick={() =>
                  setSelectedImageIndex((prev) =>
                    prev === review.imageUrls.length - 1 ? 0 : prev + 1
                  )
                }
              >
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">Next image</span>
              </Button>

              <div className="absolute bottom-8 left-1/2 z-50 flex -translate-x-1/2 space-x-2">
                {review.imageUrls.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      index === selectedImageIndex
                        ? "bg-white w-4"
                        : "bg-white/50 w-2"
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <span className="sr-only">Go to image {index + 1}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default EmergencyAlarm;
