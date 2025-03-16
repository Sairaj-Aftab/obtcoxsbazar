import { useState } from "react";
import toast from "react-hot-toast";
import DataTable from "react-data-table-component";
import locationIcon from "../../assets/icon/location.png";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { formatDateTime } from "../../utils/formatDateTime";
import {
  createSchedule,
  deleteSchedule,
  getTodaysSchedulesDataByAuthId,
  updateSchedule,
} from "../../services/schedules.service";
import { getBusRegNo } from "../../services/busRegNo.service";
import { getGuideInfo } from "../../services/guideInfo.service";
import ComponentLoader from "../../components/Loader/ComponentLoader";
import { getDriverInfo } from "../../services/driverInof.service";
import usePlaces from "../../store/usePlaces";
import useParibahanAuth from "../../store/useParibahanAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { scheduleSchema } from "@/lib/schemas";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { busTypes } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Edit, Loader2, Trash2 } from "lucide-react";
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

const BusProfile = () => {
  const queryClient = useQueryClient();
  const { paribahanAuth: user } = useParibahanAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { leavingPlaces, destinationPlaces } = usePlaces();
  const form = useForm({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      busName: user?.paribahanName || "",
      time: "",
      busNo: "",
      type: "",
      leavingPlace: "",
      leavingMapLink: "",
      destinationPlace: "",
      destinationMapLink: "",
      guideName: "",
      guidePhone: "",
      driverName: "",
      driverPhone: "",
      rent: 0,
      discountRent: 0,
      seatStatus: false,
    },
  });

  const { data: todaysSchedule, isLoading: schedulesLoading } = useQuery({
    queryKey: ["todaysSchedules", { id: user.id, search }],
    queryFn: () => getTodaysSchedulesDataByAuthId({ id: user.id, search }),
  });

  const { data: busRegNo } = useQuery({
    queryKey: ["busRegNo", { id: user.id, page, limit: 1000 }],
    queryFn: () => getBusRegNo({ id: user.id, page: 1, limit: 1000 }),
  });
  const { data: guide } = useQuery({
    queryKey: ["guide", { id: user.id, page, limit: 1000 }],
    queryFn: () => getGuideInfo({ id: user.id, page: 1, limit: 1000 }),
  });
  const { data: driver } = useQuery({
    queryKey: ["driverInfo", { id: user.id, page: 1, limit: 1000 }],
    queryFn: () => getDriverInfo({ id: user.id, page: 1, limit: 1000 }),
  });

  const {
    mutateAsync: create,
    data: createData,
    isSuccess: createSuccess,
    error: createError,
    isPending: createLoading,
  } = useMutation({
    mutationFn: createSchedule,
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["todaysSchedules", { id: user.id, search }],
        (oldData = { schedules: [] }) => ({
          ...oldData,
          schedules: [data?.busSchedule, ...oldData.schedules],
        })
      );
      queryClient.setQueryData(
        ["authSchedules", { id: user.id, page, limit, search }],
        (oldData = { schedules: [] }) => ({
          ...oldData,
          schedules: [data?.busSchedule, ...oldData.schedules],
        })
      );
      queryClient.setQueryData(
        ["schedules"],
        (oldData = { schedules: [] }) => ({
          ...oldData,
          schedules: [data?.busSchedule, ...oldData.schedules],
        })
      );
      setIsOpen(false);
      form.reset();
      setCurrentData(null);
      setIsEditing(false);
      toast.success(data.message);
    },
  });
  const {
    mutateAsync: updateData,
    data: updatedData,
    isSuccess: updateSuccess,
    isPending: updateLoading,
    error: updateError,
  } = useMutation({
    mutationFn: updateSchedule,
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["todaysSchedules", { id: user.id, search }],
        (oldData = { schedules: [] }) => ({
          ...oldData,
          schedules: oldData.schedules.map((item) =>
            item.id === data?.busSchedule.id ? data?.busSchedule : item
          ),
        })
      );
      queryClient.setQueryData(
        ["authSchedules", { id: user.id, page, limit, search }],
        (oldData = { schedules: [] }) => ({
          ...oldData,
          schedules: oldData.schedules.map((item) =>
            item.id === data?.busSchedule.id ? data?.busSchedule : item
          ),
        })
      );
      queryClient.setQueryData(
        ["schedules"],
        (oldData = { schedules: [] }) => ({
          ...oldData,
          schedules: oldData.schedules.map((item) =>
            item.id === data?.busSchedule.id ? data?.busSchedule : item
          ),
        })
      );
      setIsOpen(false);
      form.reset();
      setCurrentData(null);
      setIsEditing(false);
      toast.success(data.message);
    },
  });

  const { mutateAsync: deleteData } = useMutation({
    mutationFn: deleteSchedule,
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["todaysSchedules", { id: user.id, search }],
        (oldData = { schedules: [] }) => ({
          ...oldData,
          schedules: oldData.schedules.filter(
            (item) => item.id !== data?.schedule.id
          ),
        })
      );
      queryClient.setQueryData(
        ["schedules"],
        (oldData = { schedules: [] }) => ({
          ...oldData,
          schedules: oldData.schedules.filter(
            (item) => item.id !== data?.schedule.id
          ),
        })
      );
      queryClient.setQueryData(
        ["schedules"],
        (oldData = { schedules: [] }) => ({
          ...oldData,
          schedules: oldData.schedules.filter(
            (item) => item.id !== data?.schedule.id
          ),
        })
      );
    },
  });
  // Create form

  const handleEdit = (data) => {
    setIsEditing(true);
    setCurrentData(data);
    form.setValue("time", data.time);
    form.setValue("busNo", data.busNo);
    form.setValue("guideName", data.guideName);
    form.setValue("guidePhone", data.guidePhone);
    form.setValue("driverName", data.driverName || "");
    form.setValue("driverPhone", data.driverPhone || "");
    form.setValue("busName", data.busName);
    form.setValue("type", data.type);
    form.setValue("leavingPlace", data.leavingPlace);
    form.setValue("leavingMapLink", data.leavingMapLink);
    form.setValue("destinationPlace", data.destinationPlace);
    form.setValue("rent", data.rent);
    form.setValue("discountRent", data.discountRent);
    form.setValue("seatStatus", data.seatStatus);
    form.setValue("destinationMapLink", data.destinationMapLink);
    setIsOpen(true);
  };

  async function onSubmit(data) {
    if (isEditing) {
      await updateData({ id: currentData.id, data });
    } else {
      await create({ id: user.id, data });
    }
  }

  const calculateItemIndex = (page, limit, index) => {
    return (page - 1) * limit + index + 1;
  };
  // Get today's date for the datetime-local input
  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD format for input[type="date"]
  const column = [
    {
      name: "#",
      selector: (data, index) => calculateItemIndex(page, limit, index),
      width: "60px",
    },
    {
      name: "Time",
      selector: (data) => formatDateTime(data.time),
      sortable: true,
    },
    {
      name: "Type",
      selector: (data) => data.type,
      sortable: true,
    },
    {
      name: "Reg No",
      selector: (data) => data.busNo,
      sortable: true,
    },
    {
      name: "Guide Name",
      selector: (data) => data.guideName,
      sortable: true,
    },
    {
      name: "Guide Phone",
      selector: (data) => data.guidePhone,
      width: "125px",
      sortable: true,
    },
    {
      name: "Driver Name",
      selector: (data) => data.driverName,
      sortable: true,
    },
    {
      name: "Driver Phone",
      selector: (data) => data.driverPhone,
      width: "125px",
      sortable: true,
    },
    {
      name: "Departure Place",
      // selector: (data) => data,
      cell: (data) => {
        return (
          <a
            href={data.leavingMapLink}
            className="w-full flex items-center gap-1 text-primary-color"
          >
            {data.leavingMapLink && (
              <img src={locationIcon} alt="" className="w-6" />
            )}
            <span>{data.leavingPlace}</span>
          </a>
        );
      },
      width: "180px",
    },
    {
      name: "Destination",
      selector: (data) => data.destinationPlace,
      sortable: true,
    },
    {
      name: "Fare",
      cell: (data) => (
        <p className="w-full flex flex-col text-center">
          <span>{`৳ ${
            data.discountRent ? data.discountRent : data.rent
          }`}</span>
          {data.discountRent > 0 && data.discountRent !== data.rent && (
            <div className="text-red -mt-2">
              ৳ <span className="line-through text-xs">{data.rent}</span>
            </div>
          )}
        </p>
      ),
      sortable: true,
    },
    {
      name: "Seat Status",
      selector: (data) => (data.seatStatus ? "Available" : "Booked"),

      sortable: true,
    },
    {
      name: "Actions",
      cell: (data) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(data)}>
            <Edit className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Trash2 className="h-4 w-4 text-red" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  data and remove it from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => await deleteData(data.id)}
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

  useEffect(() => {
    if (createError || updateError) {
      toast.error(createError?.message || updateError?.message);
    }
  }, [createError, updateError]);

  return (
    <>
      <div className="container mx-auto bg-white p-5 my-5 rounded-lg">
        {/* Table Body */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-lg font-semibold text-gray-700">
              Schedule List
            </h1>
            <div className="flex flex-col sm:flex-row gap-2 w-40 sm:w-auto">
              <input
                type="text"
                placeholder="Search"
                className="w-full sm:w-60"
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                onClick={() => {
                  form.reset();
                  setCurrentData(null);
                  setIsEditing(false);
                  setIsOpen(true);
                }}
                className="bg-primary-color py-1 px-2 text-base font-medium text-white rounded"
              >
                Add schedule
              </button>
            </div>
          </div>
          <DataTable
            columns={column}
            data={todaysSchedule?.schedules}
            responsive
            progressPending={schedulesLoading}
            progressComponent={
              <div className="w-full py-4">
                <ComponentLoader />
              </div>
            }
            pagination
            paginationServer
            paginationTotalRows={
              todaysSchedule?.count
                ? todaysSchedule?.count
                : todaysSchedule?.searchCount
            }
            onChangeRowsPerPage={(rowsPerPage) => setLimit(rowsPerPage)}
            onChangePage={(page) => setPage(page)}
            paginationRowsPerPageOptions={[10, 20, 30, 50, 100, 150, 200]}
            customStyles={{
              headCells: {
                style: {
                  fontSize: "14px",
                  fontWeight: "bold",
                },
              },
              rows: {
                style: {
                  fontSize: "14px",
                  fontWeight: "400",
                },
              },
            }}
          />
        </div>
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-h-[95vh] sm:max-w-[625px] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Schedule</DialogTitle>
            <DialogDescription>
              Add a new bus schedule to your system
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Paribahan Name */}
              <FormField
                control={form.control}
                name="busName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Paribahan Name</FormLabel>
                    <FormControl>
                      <Input {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bus Registration Number */}
              <FormField
                control={form.control}
                name="busNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select registration number" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {busRegNo?.busInfo?.map((data, index) => (
                          <SelectItem key={index} value={data.regNo}>
                            {data.regNo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Guide Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="guideName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guide Name</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          const selectedGuide = guide?.guideInfo.find(
                            (g) => g.name === value
                          );
                          if (selectedGuide) {
                            form.setValue("guidePhone", selectedGuide.phone);
                          }
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select guide" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {guide?.guideInfo?.map((data, index) => (
                            <SelectItem key={index} value={data.name}>
                              {data.name}
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
                  name="guidePhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guide Phone</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Driver Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="driverName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Driver Name</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          const selectedDriver = driver?.driverInfo.find(
                            (d) => d.name === value
                          );
                          if (selectedDriver) {
                            form.setValue("driverPhone", selectedDriver.phone);
                          }
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select driver" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {driver?.driverInfo?.map((data, index) => (
                            <SelectItem key={index} value={data.name}>
                              {data.name}
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
                  name="driverPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Driver Phone</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Starting Time */}
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Starting Time</FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        {...field}
                        min={`${today}T00:00`}
                        max={`${today}T23:59`}
                        onChange={(e) => {
                          // Only validate the date part, not the time
                          const selectedDate = new Date(
                            e.target.value
                          ).toLocaleDateString("en-CA");

                          if (selectedDate !== today) {
                            // If not today's date, reset to today with the same time
                            const selectedTime = e.target.value.split("T")[1];
                            field.onChange(`${today}T${selectedTime}`);

                            toast({
                              title: "Warning",
                              description: "Only today's date can be selected",
                            });
                          } else {
                            field.onChange(e.target.value);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bus Type */}
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
                        {busTypes.map((type) => (
                          <SelectItem key={type.id} value={type.label}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Departure and Destination */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="leavingPlace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departure Place</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          const selectedPlace = leavingPlaces?.places?.find(
                            (place) => place.placeName === value
                          );
                          if (selectedPlace && selectedPlace.mapLink) {
                            form.setValue(
                              "leavingMapLink",
                              selectedPlace.mapLink
                            );
                          }
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select departure place" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {leavingPlaces?.places?.map((place, index) => (
                            <SelectItem key={index} value={place.placeName}>
                              {place.placeName}
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
                          {destinationPlaces?.places?.map((place, index) => (
                            <SelectItem key={index} value={place.placeName}>
                              {place.placeName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="rent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regular Price (৳)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 4) {
                              field.onChange(Number(value));
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discountRent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Price (৳) (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 4) {
                              field.onChange(Number(value));
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Seat Status */}
              <FormField
                control={form.control}
                name="seatStatus"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value === true}
                        onCheckedChange={(checked) => {
                          field.onChange(checked ? true : false);
                        }}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Seats Available</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Check if seats are available, uncheck if booked
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={createLoading || updateLoading}>
                  {createLoading || updateLoading ? (
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
    </>
  );
};

export default BusProfile;
