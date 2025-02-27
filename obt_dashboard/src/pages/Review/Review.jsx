import DataTable from "react-data-table-component";
import PageHeader from "../../components/PageHeader/PageHeader";
import { useEffect, useState } from "react";
import { formatDateTime } from "../../utils/timeAgo";
import Loading from "../../components/Loading/Loading";
import useAuth from "@/store/useAuth";
import { useDeleteReview, useGetAllReview } from "@/services/review.service";
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
  Clock,
  Eye,
  MapPin,
  MessageSquare,
  Star,
  Trash2,
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

const Review = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowPage, setRowPage] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data, isLoading } = useGetAllReview({ page, limit: rowPage, search });
  const deleteReview = useDeleteReview();

  const { authUser } = useAuth();
  const [review, setReview] = useState(null);

  useEffect(() => {
    if (deleteReview.error) {
      toast("Error", {
        description: `${
          deleteReview?.error?.response?.data?.message ||
          deleteReview?.error?.message
        }`,
      });
    }
  }, [deleteReview.error]);

  const calculateItemIndex = (page, rowPage, index) => {
    return (page - 1) * rowPage + index + 1;
  };

  const columns = [
    {
      name: "#",
      selector: (data, index) => calculateItemIndex(page, rowPage, index),
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
      name: "Paribahan",
      selector: (data) => data.paribahanName,
      sortable: true,
    },
    {
      name: "Reg No",
      selector: (data) => data.regNo,
      sortable: true,
    },
    // {
    //   name: "Type",
    //   selector: (data) => data.type,
    // },
    {
      name: "Rating",
      selector: (data) => data.rating,
      sortable: true,
      cell: (row) => (
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < row.rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      ),
      width: "115px",
    },
    {
      name: "Name",
      selector: (data) => data.name,
    },
    {
      name: "Comment",
      selector: (data) => data.comment,
    },
    {
      name: "Phone number",
      selector: (data) => data.phoneNumber,
    },
    {
      name: "Destination",
      selector: (data) => data.destination,
    },
    {
      name: "Trip time",
      selector: (data) => formatDateTime(data.tripTime),
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
              <AlertDialogAction onClick={() => deleteReview.mutate(data.id)}>
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
      <PageHeader title="Reviews" />
      <Input
        type="text"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="my-3"
      />
      <DataTable
        columns={columns}
        data={data?.reviews}
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
            <DialogDescription>
              Detailed feedback from our valued passenger
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-3">
            <div>
              <h4 className="text-sm font-semibold">{review?.name}</h4>
              <p className="text-sm font-semibold text-primary">
                <a href={`tel:${review?.phoneNumber}`}>{review?.phoneNumber}</a>
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Rating</h4>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < review?.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm font-medium ml-2">
                  {review?.rating}/5
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Trip Details</h4>
              <div className="grid gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDateTime(review?.tripTime)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <MapPin className="h-3 w-3 mr-1" />
                    {review?.destination}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Bus className="h-4 w-4" /> Reg No: {review?.regNo}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-2">Passenger Feedback</h4>
              <p className="text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4 inline mr-2" />
                {review?.comment}
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Review ID: #R{Math.floor(Math.random() * 10000)}</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDateTime(review?.createdAt)}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Review;
