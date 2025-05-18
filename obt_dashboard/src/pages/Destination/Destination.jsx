import { useEffect, useState } from "react";
import PageHeader from "../../components/PageHeader/PageHeader";
import useAuth from "@/store/useAuth";
import {
  useCreatePlace,
  useDeletePlace,
  useGetAllPlaces,
  useUpdatePlace,
} from "@/services/place.service";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2, MapPin, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loading from "@/components/Loading/Loading";
import { toast } from "sonner";

const formSchema = z.object({
  placeName: z.string().min(2, {
    message: "Place name must be at least 2 characters.",
  }),
  status: z.enum(["leave", "destination", "parkingPlace"], {
    required_error: "Please select a place status.",
  }),
  mapLink: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .nullable()
    .optional(),
  destinationKM: z.number().positive().nullable().optional(),
  bdTicketLink: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .nullable()
    .optional(),
});

const Destination = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const { authUser } = useAuth();
  const { data: placeData, isLoading: isPlaceLoading } = useGetAllPlaces();
  const createPlace = useCreatePlace();
  const updatePlace = useUpdatePlace();
  const deletePlace = useDeletePlace();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      placeName: "",
      status: undefined,
      mapLink: undefined,
      destinationKM: undefined,
      bdTicketLink: undefined,
    },
  });

  function onSubmit(data) {
    if (isEditing) {
      updatePlace.mutate({ id: currentData.id, data });
    } else {
      createPlace.mutate(data);
    }
  }

  const handleEdit = (data) => {
    setIsEditing(true);
    setCurrentData(data);
    form.setValue("placeName", data.placeName);
    form.setValue("status", data.status);
    form.setValue("mapLink", data.mapLink);
    form.setValue("destinationKM", parseInt(data.destinationKM));
    form.setValue("bdTicketLink", data.bdTicketLink);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    if (createPlace.isSuccess || updatePlace.isSuccess) {
      toast("Success", {
        description: `${
          createPlace?.data?.message || updatePlace?.data?.message
        }`,
      });
      setIsDialogOpen(false);
      setIsEditing(false);
      form.reset();
    }
    if (createPlace.error || updatePlace.error) {
      toast("Error", {
        description: `${
          createPlace?.error?.response?.data?.message ||
          updatePlace?.error?.response?.data?.message ||
          createPlace?.error?.message ||
          updatePlace?.error?.message
        }`,
      });
    }
  }, [
    createPlace?.data?.message,
    createPlace.error,
    createPlace.isSuccess,
    form,
    updatePlace?.data?.message,
    updatePlace.error,
    updatePlace.isSuccess,
  ]);

  const renderPlaceTable = (filteredPlaces) => (
    <>
      {isPlaceLoading ? (
        <div className="h-96 flex justify-center items-center">
          <Loading />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Place & Details</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlaces?.map((place, index) => (
              <TableRow key={place.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{place.placeName}</div>
                    {place.mapLink && (
                      <a
                        href={place.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground flex items-center"
                      >
                        <MapPin className="w-4 h-4 mr-1" />
                        View on Map
                      </a>
                    )}
                    {place.destinationKM && (
                      <div className="text-sm text-muted-foreground">
                        {place.destinationKM} KM
                      </div>
                    )}
                    {place.bdTicketLink && (
                      <a
                        href={place.bdTicketLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground flex items-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        BD Ticket
                      </a>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(place)}
                  >
                    <Pencil className="w-4 h-4 text-primary" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the place and remove it from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deletePlace.mutate(place.id)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
  return (
    <div>
      <div className="flex justify-between items-center">
        <PageHeader title="Places" />
        <Button
          onClick={() => {
            setIsEditing(false); // Reset editing mode
            form.reset();
            setIsDialogOpen(true);
          }}
        >
          Add Place
        </Button>
      </div>
      <Tabs defaultValue="parkingPlace">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="parkingPlace">TB Parking Places</TabsTrigger>
          <TabsTrigger value="destination">Destination Places</TabsTrigger>
          <TabsTrigger value="leave">Departure Places</TabsTrigger>
        </TabsList>
        <TabsContent value="parkingPlace">
          {renderPlaceTable(
            placeData?.places?.filter(
              (place) => place.status === "parkingPlace"
            )
          )}
        </TabsContent>
        <TabsContent value="destination">
          {renderPlaceTable(
            placeData?.places?.filter((place) => place.status === "destination")
          )}
        </TabsContent>
        <TabsContent value="leave">
          {renderPlaceTable(
            placeData?.places?.filter((place) => place.status === "leave")
          )}
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="max-h-[95vh] sm:max-w-[625px] overflow-y-auto"
          // onClick={(e) => e.stopPropagation()}
          onPointerDownOutside={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <AlertDialogHeader>
            <DialogTitle>
              {isEditing ? "Update notice" : "Create notice"}
            </DialogTitle>
          </AlertDialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="placeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Place Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter place name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="leave">Departure</SelectItem>
                        <SelectItem value="destination">Destination</SelectItem>
                        <SelectItem value="parkingPlace">
                          TB Parking Place
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mapLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Map Link</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Google Map link" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("status") === "destination" && (
                <>
                  <FormField
                    control={form.control}
                    name="destinationKM"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination KM</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter distance in KM"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? Number(e.target.value) : ""
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bdTicketLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>BD Ticket Link</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter BD Ticket link"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={
                    createPlace.isPending ||
                    updatePlace.isPending ||
                    authUser?.role?.name === "VIEWER" ||
                    authUser?.role?.name === "DEMO"
                  }
                >
                  {createPlace.isPending || updatePlace.isPending ? (
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

export default Destination;
