import Loading from "@/components/Loading/Loading";
import PageHeader from "@/components/PageHeader/PageHeader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
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
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { busTypes } from "@/config/busType";
import { scheduleFormSchema } from "@/lib/schemas";
import { useGetBusInfo } from "@/services/busInfo.service";
import { useDriverInfo } from "@/services/driverInfo.service";
import { useGuideInfo } from "@/services/guideInfo.service";
import {
  useGetDestinationPlaces,
  useGetLeavingPlaces,
} from "@/services/place.service";
import {
  useGetTodaysSchedule,
  useUpdateSchedule,
} from "@/services/schedule.service";
import useAuth from "@/store/useAuth";
import { formatDateTime } from "@/utils/timeAgo";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const TodaysSchedule = () => {
  const { authUser } = useAuth();

  const [search, setSearch] = useState("");
  const [busSearch, setBusSearch] = useState("");
  const [guideSearch, setGuideSearch] = useState("");
  const [driverSearch, setDriverSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rowPage, setRowPage] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [bus, setBus] = useState({});
  const [selectedGuide, setSelectedGuide] = useState({});
  const [selectedDriver, setSelectedDriver] = useState({});
  const { data, isLoading } = useGetTodaysSchedule({
    page,
    limit: rowPage,
    search,
  });
  const { data: leavingPlace, isLoading: isLeavingPlaceLoading } =
    useGetLeavingPlaces();
  const { data: destinationPlace, isLoading: isDestinationPlaceLoading } =
    useGetDestinationPlaces();
  const { data: busInfoData, isLoading: busInfoLoading } = useGetBusInfo({
    id: currentData?.paribahanUserId,
    page: 1,
    limit: 5,
    search: busSearch,
  });

  const { data: guideInfo, isLoading: guideInfoLoading } = useGuideInfo({
    id: currentData?.paribahanUserId,
    page: 1,
    limit: 5,
    search: guideSearch,
  });
  const { data: driverInfo, isLoading: driverInfoLoading } = useDriverInfo({
    id: currentData?.paribahanUserId,
    page: 1,
    limit: 5,
    search: driverSearch,
  });

  const updateSchedule = useUpdateSchedule();

  const form = useForm({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      type: "",
      time: "",
      busNo: "",
      guideName: "",
      guidePhone: "",
      driverName: "",
      driverPhone: "",
      leavingPlace: "",
      leavingMapLink: "",
      destinationPlace: "",
      rent: 0,
      discountRent: 0,
      seatStatus: false,
      comment: "",
    },
  });

  const handleSelectedBusInfo = (regNo) => {
    const selectedVehicle = busInfoData?.busInfo?.find(
      (vehicle) => vehicle.regNo === regNo
    );

    if (selectedVehicle) {
      setBus({
        regNo: selectedVehicle.regNo,
      });
    } else {
      setBus({});
    }
  };
  const handleSelectedGuide = (name, phone) => {
    const selectedInfo = guideInfo?.guideInfo?.find(
      (data) => data.name === name && data.phone === phone
    );

    if (selectedInfo) {
      setSelectedGuide({
        name: selectedInfo.name,
        phone: selectedInfo.phone,
      });
      form.setValue("guideName", selectedInfo.name);
      form.setValue("guidePhone", selectedInfo.phone);
    } else {
      setSelectedGuide({});
    }
  };

  const handleSelectedDriver = (name, phone) => {
    const selectedInfo = driverInfo?.driverInfo?.find(
      (data) => data.name === name && data.phone === phone
    );

    if (selectedInfo) {
      setSelectedDriver({
        name: selectedInfo.name,
        phone: selectedInfo.phone,
      });
      form.setValue("driverName", selectedInfo.name);
      form.setValue("driverPhone", selectedInfo.phone);
    } else {
      setSelectedDriver({});
    }
  };

  const handleEdit = (data) => {
    setIsEditing(true);
    setCurrentData(data);
    setBusSearch(data.busNo);
    setGuideSearch(data.guideName);
    setDriverSearch(data.driverName);
    setBus({
      regNo: data.busNo,
    });
    setSelectedGuide({
      name: data.guideName,
      phone: data.guidePhone,
    });
    setSelectedDriver({
      name: data.driverName,
      phone: data.driverPhone,
    });
    form.setValue("time", data.time);
    form.setValue("busNo", data.busNo);
    form.setValue("guideName", data.guideName);
    form.setValue("guidePhone", data.guidePhone);
    form.setValue("driverName", data.driverName);
    form.setValue("driverPhone", data.driverPhone);
    form.setValue("busName", data.busName);
    form.setValue("type", data.type);
    form.setValue("leavingPlace", data.leavingPlace);
    form.setValue("leavingMapLink", data.leavingMapLink);
    form.setValue("destinationPlace", data.destinationPlace);
    form.setValue("rent", data.rent);
    form.setValue("discountRent", data.discountRent);
    form.setValue("seatStatus", data.seatStatus);
    form.setValue("comment", data.comment);
    setIsDialogOpen(true);
  };

  async function onSubmit(data) {
    if (isEditing) {
      updateSchedule.mutate({ id: currentData.id, data });
    }
  }

  useEffect(() => {
    if (updateSchedule.isSuccess) {
      toast("Success", {
        description: `${updateSchedule?.data?.message}`,
      });
      setIsDialogOpen(false);
      form.reset();
    }
    if (updateSchedule.error) {
      toast("Error", {
        description: `${
          updateSchedule?.error?.response?.data?.message ||
          updateSchedule?.error?.message
        }`,
      });
    }
  }, [
    form,
    updateSchedule?.data?.message,
    updateSchedule.error,
    updateSchedule.isSuccess,
  ]);

  const handleDeleteSchedule = () => {};

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
      name: "#",
      cell: (data) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            handleEdit(data);
          }}
        >
          <Edit className="h-4 w-4 text-primary" />
        </Button>
      ),
      width: "60px",
    },
    {
      name: "Time",
      selector: (data) => formatDateTime(data.time),
      sortable: true,
    },
    {
      name: "Paribahan",
      selector: (data) => data.busName,
      sortable: true,
      width: "180px",
    },
    {
      name: "Bus Type",
      selector: (data) => data.type,
      sortable: true,
    },
    {
      name: "Reg No",
      selector: (data) => data.busNo,
      sortable: true,
      width: "180px",
    },
    {
      name: "Guide Name",
      selector: (data) => data.guideName,
      sortable: true,
    },
    {
      name: "Guide Phone",
      selector: (data) => data.guidePhone,
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
      sortable: true,
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
        <Button
          className="bg-red-500"
          onClick={() => handleDeleteSchedule(data.id)}
          disabled={authUser?.role?.name === "VIEWER" && true}
        >
          <Trash className="mr-1 h-4 w-4" /> Delete
        </Button>
      ),
      right: true, // Align the column to the right
    },
  ];
  return (
    <div>
      <PageHeader title="Today's Schedule" />
      <Input
        type="text"
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="my-3"
      />
      <DataTable
        columns={columns}
        data={data?.schedules || []}
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
          data?.searchCount ? data?.searchCount : data?.totalScheduleCount
        }
        onChangeRowsPerPage={(newPerPage) => setRowPage(newPerPage)}
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
            <DialogTitle>{currentData?.busName}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Time */}
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => {
                  // Get today's date in YYYY-MM-DD format
                  const today = new Date();
                  const todayStr = today.toISOString().split("T")[0];

                  // Set min to start of today (00:00)
                  const minDateTime = `${todayStr}T00:00`;

                  // Set max to end of today (23:59)
                  const maxDateTime = `${todayStr}T23:59`;

                  return (
                    <FormItem>
                      <FormLabel>Starting Time</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          // min={minDateTime}
                          // max={maxDateTime}
                          {...field}
                          onChange={(e) => {
                            // Only validate the date part, not the time
                            const selectedDate = new Date(e.target.value)
                              .toISOString()
                              .split("T")[0];

                            if (selectedDate !== todayStr) {
                              // If not today's date, reset to today with the same time
                              const selectedTime = e.target.value.split("T")[1];
                              field.onChange(`${todayStr}T${selectedTime}`);

                              // Optionally show a toast message
                              if (typeof toast !== "undefined") {
                                toast("Invalid date", {
                                  description:
                                    "Only today's date can be selected",
                                });
                              }
                            } else {
                              field.onChange(e.target.value);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground">
                        You can only select today&apos;s date
                      </p>
                    </FormItem>
                  );
                }}
              />
              <div className="flex flex-col md:flex-row gap-2">
                {/* Bus Number */}
                <Popover>
                  <PopoverTrigger className="flex-1 flex gap-2 flex-col justify-start">
                    <Label htmlFor="vehicle">Reg. No.</Label>
                    <Input
                      value={`${bus?.regNo || ""}`}
                      readOnly
                      disabled={updateSchedule.isPending}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-[360px] sm:w-[420px] p-2">
                    <input
                      type="text"
                      placeholder="Search vehicle"
                      onChange={(e) => setBusSearch(e.target.value)}
                      className="w-full px-3 py-1 rounded-md border border-gray-300 outline-gray-400 text-base text-gray-800"
                    />
                    <FormField
                      control={form.control}
                      name="busNo"
                      render={() => (
                        <FormItem className="w-full mt-1">
                          <div className="flex space-x-5 font-semibold text-sm">
                            <span>#</span>
                            <span>Reg. No.</span>
                          </div>

                          <div className="h-[120px] w-full">
                            {busInfoLoading ? (
                              <div className="h-[150px] w-full flex items-center justify-center">
                                Loading...
                              </div>
                            ) : (
                              busInfoData?.busInfo?.map((item) => (
                                <FormField
                                  key={item.id}
                                  control={form.control}
                                  name="busNo"
                                  render={({ field }) => {
                                    const handleCheckboxChange = () => {
                                      // If the selected ID is the same as the current ID, deselect it
                                      const newValue =
                                        field.value === item.regNo
                                          ? ""
                                          : item.regNo;

                                      // Update the form field
                                      field.onChange(newValue);

                                      // Call handleSelectedGarage with the selected or deselected ID
                                      handleSelectedBusInfo(newValue);
                                    };

                                    return (
                                      <FormItem
                                        key={item.id}
                                        className="w-full flex space-x-3 space-y-0 mb-2"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value === item.regNo}
                                            onCheckedChange={
                                              handleCheckboxChange
                                            }
                                          />
                                        </FormControl>

                                        <FormLabel className="font-normal w-full">
                                          {item.regNo}
                                        </FormLabel>
                                      </FormItem>
                                    );
                                  }}
                                />
                              ))
                            )}
                            {!busInfoLoading &&
                              busInfoData?.busInfo.length < 1 && (
                                <div className="h-[150px] w-full flex justify-center items-center">
                                  <p className="text-sm font-semibold text-red-500">
                                    No bus found
                                  </p>
                                </div>
                              )}
                          </div>
                        </FormItem>
                      )}
                    />
                  </PopoverContent>
                </Popover>
                {/* Type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Bus Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="!mt-0">
                            <SelectValue placeholder="Select bus type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {busTypes?.map((busType) => (
                            <SelectItem key={busType.id} value={busType.label}>
                              {busType.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Guide Name and Phone */}
              <div className="flex flex-col md:flex-row gap-2">
                {/* Guide Name */}
                <Popover>
                  <PopoverTrigger className="flex-1 flex gap-2 flex-col justify-start">
                    <Label htmlFor="vehicle">Guide Name</Label>
                    <Input
                      value={`${selectedGuide?.name || ""}`}
                      readOnly
                      disabled={updateSchedule.isPending}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-[360px] sm:w-[420px] p-2">
                    <input
                      type="text"
                      placeholder="Search vehicle"
                      onChange={(e) => setGuideSearch(e.target.value)}
                      className="w-full px-3 py-1 rounded-md border border-gray-300 outline-gray-400 text-base text-gray-800"
                    />
                    <FormField
                      control={form.control}
                      name="guideName"
                      render={() => (
                        <FormItem className="w-full mt-1">
                          <div className="flex space-x-5 font-semibold text-sm">
                            <span>#</span>
                            <span>Guide</span>
                          </div>

                          <div className="h-[120px] w-full">
                            {guideInfoLoading ? (
                              <div className="h-[150px] w-full flex items-center justify-center">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />{" "}
                                Loading...
                              </div>
                            ) : (
                              guideInfo?.guideInfo?.map((item) => (
                                <FormField
                                  key={item.id}
                                  control={form.control}
                                  name="guideName"
                                  render={({ field }) => {
                                    const handleCheckboxChange = () => {
                                      const isCurrentlySelected =
                                        field.value === item.name &&
                                        form.getValues("guidePhone") ===
                                          item.phone;

                                      if (isCurrentlySelected) {
                                        field.onChange("");
                                        form.setValue("guidePhone", "");
                                        setSelectedGuide({});
                                      } else {
                                        // Update the form fields
                                        field.onChange(item.name);
                                        form.setValue("guidePhone", item.phone);

                                        // Call handleSelectedGuide with both name and phone
                                        handleSelectedGuide(
                                          item.name,
                                          item.phone
                                        );
                                      }
                                    };

                                    return (
                                      <FormItem
                                        key={item.id}
                                        className="w-full flex space-x-3 space-y-0 mb-2"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={
                                              field.value === item.name &&
                                              form.getValues("guidePhone") ===
                                                item.phone
                                            }
                                            onCheckedChange={
                                              handleCheckboxChange
                                            }
                                          />
                                        </FormControl>

                                        <FormLabel className="font-normal w-full">
                                          {item.name} - {item.phone}
                                        </FormLabel>
                                      </FormItem>
                                    );
                                  }}
                                />
                              ))
                            )}
                            {!guideInfoLoading &&
                              guideInfo?.guideInfo.length < 1 && (
                                <div className="h-[150px] w-full flex justify-center items-center">
                                  <p className="text-sm font-semibold text-red-500">
                                    No guide found
                                  </p>
                                </div>
                              )}
                          </div>
                        </FormItem>
                      )}
                    />
                  </PopoverContent>
                </Popover>
                {/* Guide Phone */}
                <FormField
                  control={form.control}
                  name="guidePhone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Guide Phone</FormLabel>
                      <FormControl>
                        <Input {...field} className="!mt-0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* Driver Name and Phone */}
              <div className="flex flex-col md:flex-row gap-2">
                {/* Driver Name */}
                <Popover>
                  <PopoverTrigger className="flex-1 flex gap-2 flex-col justify-start">
                    <Label htmlFor="driver">Driver Name</Label>
                    <Input
                      value={`${selectedDriver?.name || ""}`}
                      readOnly
                      disabled={updateSchedule.isPending}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-[360px] sm:w-[420px] p-2">
                    <input
                      type="text"
                      placeholder="Search driver"
                      onChange={(e) => setDriverSearch(e.target.value)}
                      className="w-full px-3 py-1 rounded-md border border-gray-300 outline-gray-400 text-base text-gray-800"
                    />
                    <FormField
                      control={form.control}
                      name="driverName"
                      render={() => (
                        <FormItem className="w-full mt-1">
                          <div className="flex space-x-5 font-semibold text-sm">
                            <span>#</span>
                            <span>Driver</span>
                          </div>

                          <div className="h-[120px] w-full overflow-y-auto">
                            {driverInfoLoading ? (
                              <div className="h-[150px] w-full flex items-center justify-center">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />{" "}
                                Loading...
                              </div>
                            ) : (
                              driverInfo?.driverInfo?.map((item) => (
                                <FormField
                                  key={item.id}
                                  control={form.control}
                                  name="driverName"
                                  render={({ field }) => {
                                    const handleCheckboxChange = () => {
                                      // If the selected driver is the same, deselect it
                                      const isCurrentlySelected =
                                        field.value === item.name &&
                                        form.getValues("driverPhone") ===
                                          item.phone;

                                      if (isCurrentlySelected) {
                                        field.onChange("");
                                        form.setValue("driverPhone", "");
                                        setSelectedDriver({});
                                      } else {
                                        // Update the form fields
                                        field.onChange(item.name);
                                        form.setValue(
                                          "driverPhone",
                                          item.phone
                                        );

                                        // Call handleSelectedDriver with both name and phone
                                        handleSelectedDriver(
                                          item.name,
                                          item.phone
                                        );
                                      }
                                    };

                                    return (
                                      <FormItem
                                        key={item.id}
                                        className="w-full flex space-x-3 space-y-0 mb-2"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={
                                              field.value === item.name &&
                                              form.getValues("driverPhone") ===
                                                item.phone
                                            }
                                            onCheckedChange={
                                              handleCheckboxChange
                                            }
                                          />
                                        </FormControl>

                                        <FormLabel className="font-normal w-full">
                                          {item.name} - {item.phone}
                                        </FormLabel>
                                      </FormItem>
                                    );
                                  }}
                                />
                              ))
                            )}
                            {!driverInfoLoading &&
                              driverInfo?.driverInfo?.length < 1 && (
                                <div className="h-[150px] w-full flex justify-center items-center">
                                  <p className="text-sm font-semibold text-red-500">
                                    No driver found
                                  </p>
                                </div>
                              )}
                          </div>
                        </FormItem>
                      )}
                    />
                  </PopoverContent>
                </Popover>
                {/* Driver Phone */}
                <FormField
                  control={form.control}
                  name="driverPhone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Driver Phone</FormLabel>
                      <FormControl>
                        <Input {...field} className="!mt-0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="leavingPlace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departure Place</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Find the selected place and set its map link
                        const selectedPlace = leavingPlace?.places?.find(
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
              {/* Rent and Discount */}
              <div className="flex flex-col md:flex-row gap-2">
                <FormField
                  control={form.control}
                  name="rent"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Rent Amount</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="!mt-0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discountRent"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Discount Amount</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} className="!mt-0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Comment */}
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                      <Input {...field} className="!mt-0" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Seat Status */}
              <FormField
                control={form.control}
                name="seatStatus"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Seat Status</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Check if all seats are available
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={
                    updateSchedule.isPending ||
                    authUser?.role?.name === "VIEWER" ||
                    authUser?.role?.name === "DEMO"
                  }
                >
                  {updateSchedule.isPending ? (
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

export default TodaysSchedule;
