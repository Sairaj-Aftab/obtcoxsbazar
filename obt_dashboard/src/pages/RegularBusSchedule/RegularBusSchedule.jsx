import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import { formatDateTime } from "../../utils/timeAgo";
import DataTable from "react-data-table-component";
import Loading from "../../components/Loading/Loading";
import useAuth from "@/store/useAuth";
import {
  useCreateSchedule,
  useDeleteSchedule,
  useGetAllRgSchedules,
  useUpdateSchedule,
} from "@/services/regularSchedule.service";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { rgScheduleFormSchema } from "@/lib/schemas";
import { Edit, Loader2, Trash } from "lucide-react";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParibahanUsers } from "@/services/paribahan.service";
import {
  useGetDestinationPlaces,
  useGetLeavingPlaces,
} from "@/services/place.service";
import { toast } from "sonner";
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

const RegularBusSchedule = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowPage, setRowPage] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const { authUser } = useAuth();
  const { data: paribahan, isLoading: paribahanLoading } = useParibahanUsers(
    {}
  );

  const { data: schedules, isLoading } = useGetAllRgSchedules({
    search,
  });
  const { data: leavingPlace, isLoading: isLeavingPlaceLoading } =
    useGetLeavingPlaces();
  const { data: destinationPlace, isLoading: isDestinationPlaceLoading } =
    useGetDestinationPlaces();

  const createSchedule = useCreateSchedule();
  const updateSchedule = useUpdateSchedule();
  const deleteSchedule = useDeleteSchedule();

  const form = useForm({
    resolver: zodResolver(rgScheduleFormSchema),
    defaultValues: {
      busName: "",
      time: "",
      type: "",
      leavingPlace: "",
      destinationPlace: "",
    },
  });

  async function onSubmit(data) {
    const selectedParibahan = paribahan?.paribahanUsers?.find(
      (p) => p.paribahanName === data.busName
    );
    if (selectedParibahan) {
      const paribahanId = selectedParibahan.id;
      if (isEditing) {
        updateSchedule.mutate({
          id: currentData.id,
          paribahanId,
          data,
        });
      } else {
        createSchedule.mutate({
          id: paribahanId,
          data,
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Selected Paribahan not found",
      });
    }
  }

  const handleEdit = (schedule) => {
    setIsEditing(true);
    setCurrentData(schedule);
    form.setValue("busName", schedule.busName);
    form.setValue("time", schedule.time);
    form.setValue("type", schedule.type);
    form.setValue("leavingPlace", schedule.leavingPlace);
    form.setValue("destinationPlace", schedule.destinationPlace);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    if (createSchedule.isSuccess || updateSchedule.isSuccess) {
      toast("Success", {
        description: `${
          createSchedule?.data?.message || updateSchedule?.data?.message
        }`,
      });
      setIsDialogOpen(false);
      form.reset();
    }
    if (createSchedule.error || updateSchedule.error) {
      toast("Error", {
        description: `${
          createSchedule?.error?.response?.data?.message ||
          updateSchedule?.error?.response?.data?.message ||
          createSchedule?.error?.message ||
          updateSchedule?.error?.message
        }`,
      });
    }
  }, [
    createSchedule?.data?.message,
    createSchedule.error,
    createSchedule.isSuccess,
    form,
    updateSchedule?.data?.message,
    updateSchedule.error,
    updateSchedule.isSuccess,
  ]);

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
      name: "Time",
      selector: (data) => data.time,
      sortable: true,
    },
    {
      name: "Paribahan",
      selector: (data) => data.busName,
      sortable: true,
    },
    {
      name: "Type",
      selector: (data) => data.type,
    },
    {
      name: "Departure Place",
      selector: (data) => data.leavingPlace,
      sortable: true,
    },
    {
      name: "Destination",
      selector: (data) => data.destinationPlace,
      sortable: true,
    },
    {
      name: "Entry Date",
      selector: (data) => formatDateTime(data.createdAt),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (data) => (
        <div>
          <Button
            variant="ghost"
            size="icon"
            disabled={authUser?.role?.name === "VIEWER"}
            onClick={() => handleEdit(data)}
          >
            <Edit className="h-4 w-4 text-primary" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  schedule and remove it from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteSchedule.mutate(data.id)}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
      right: true, // Align the column to the right
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center">
        <PageHeader title="Regular Bus Schedule" />
        <Button
          onClick={() => {
            setIsEditing(false); // Reset editing mode
            form.reset(); // Reset form
            setIsDialogOpen(true);
          }}
        >
          Add regular schedule
        </Button>
      </div>
      <Input
        type="text"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="my-3"
      />
      <DataTable
        columns={columns}
        data={schedules?.schedules || []}
        responsive
        progressPending={isLoading}
        progressComponent={
          <div className="h-96 flex justify-center items-center">
            <Loading />
          </div>
        }
        pagination
        // paginationServer
        // paginationTotalRows={
        //   schedules?.searchCount
        //     ? schedules?.searchCount
        //     : schedules?.totalCount
        // }
        onChangeRowsPerPage={(value) => setRowPage(value)}
        onChangePage={(page) => setPage(page)}
        paginationRowsPerPageOptions={[10, 20, 50, 100]}
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="max-h-[95vh] sm:max-w-[625px] overflow-y-auto"
          // onClick={(e) => e.stopPropagation()}
          onPointerDownOutside={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Update driver" : "Create driver"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="busName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paribahan</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Paribahan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {paribahanLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {paribahan?.paribahanUsers?.map((data) => (
                          <SelectItem key={data.id} value={data.paribahanName}>
                            {data.paribahanName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Time */}
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Starting Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bus Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select bus type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="AC">AC</SelectItem>
                        <SelectItem value="Non-AC">Non-AC</SelectItem>
                        <SelectItem value="Sleeper Coach">
                          Sleeper Coach
                        </SelectItem>
                        <SelectItem value="Double Decker">
                          Double Decker
                        </SelectItem>
                        <SelectItem value="Suite Class">Suite Class</SelectItem>
                        <SelectItem value="Hyundai Biz Class">
                          Hyundai Biz Class
                        </SelectItem>
                        <SelectItem value="Mercedes-Benz">
                          Mercedes-Benz
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="leavingPlace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departure Place</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select departure" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLeavingPlaceLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {leavingPlace?.places?.map((data) => (
                          <SelectItem key={data.id} value={data.placeName}>
                            {data.placeName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destinationPlace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isDestinationPlaceLoading && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {destinationPlace?.places?.map((data) => (
                          <SelectItem key={data.id} value={data.placeName}>
                            {data.placeName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={
                    createSchedule.isPending ||
                    updateSchedule.isPending ||
                    authUser?.role?.name === "VIEWER" ||
                    authUser?.role?.name === "DEMO"
                  }
                >
                  {createSchedule.isPending || updateSchedule.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                      wait...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RegularBusSchedule;
