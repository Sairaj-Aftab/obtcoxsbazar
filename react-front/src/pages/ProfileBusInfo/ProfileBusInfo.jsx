import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DataTable from "react-data-table-component";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBusRegNo,
  getBusRegNo,
  updateBusRegNo,
} from "../../services/busRegNo.service";
import ComponentLoader from "../../components/Loader/ComponentLoader";
import useParibahanAuth from "../../store/useParibahanAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { busInfoSchema } from "@/lib/schemas";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { busTypes } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const ProfileBusInfo = () => {
  const queryClient = useQueryClient();
  const { paribahanAuth: user } = useParibahanAuth();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const { data: busRegNo, isLoading: busRegNoLoading } = useQuery({
    queryKey: ["busRegNo", { id: user.id, page, limit, search }],
    queryFn: () => getBusRegNo({ id: user.id, page, limit, search }),
  });
  const {
    mutateAsync: createRegNo,
    data: createData,
    isSuccess: createSuccess,
    error: createError,
    isPending: createLoading,
  } = useMutation({
    mutationFn: createBusRegNo,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["busRegNo"] });
      form.reset();
      setIsEditing(false);
      setIsOpen(false);
      toast.success(data.message);
    },
  });
  // Update bus info
  const {
    mutateAsync: updateBusReg,
    data: updateData,
    isSuccess: updateSuccess,
    error: updateError,
    isPending: updateLoading,
  } = useMutation({
    mutationFn: updateBusRegNo,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["busRegNo"] });
      form.reset();
      setIsEditing(false);
      setIsOpen(false);
      toast.success(data.message);
    },
  });
  const form = useForm({
    resolver: zodResolver(busInfoSchema),
    defaultValues: {
      paribahanUserId: user.id,
      regNo: "",
      type: undefined,
    },
  });
  const onSubmit = async (data) => {
    if (isEditing) {
      await updateBusReg({ id: currentData.id, data });
    } else {
      await createRegNo(data);
    }
  };

  const calculateItemIndex = (page, limit, index) => {
    return (page - 1) * limit + index + 1;
  };
  const column = [
    {
      name: "#",
      selector: (data, index) => calculateItemIndex(page, limit, index),
      width: "60px",
    },
    {
      name: "Bus Reg No",
      selector: (data) => data.regNo,
      sortable: true,
    },
    {
      name: "Type",
      selector: (data) => data.type,
      sortable: true,
    },
    // {
    //   name: "FC Expire",
    //   cell: (data) => {
    //     const currentDate = new Date();
    //     const fcExpireDate = new Date(data?.fcExpire);
    //     const isExpired = fcExpireDate < currentDate;

    //     return (
    //       <span
    //         style={{
    //           color: isExpired ? "red" : "inherit",
    //           textDecoration: isExpired ? "line-through" : "none",
    //         }}
    //       >
    //         {data.fcExpire}
    //       </span>
    //     );
    //   },
    //   sortable: true,
    // },
    // {
    //   name: "Route Permit",
    //   selector: (data) => data.comment,
    //   sortable: true,
    // },
    {
      name: "Report",
      selector: (data) => data.report,
      sortable: true,
    },
    // {
    //   name: "Entry Date",
    //   selector: (data) => formatDateTime(data.createdAt),
    //   sortable: true,
    // },
    // {
    //   name: "Actions",
    //   cell: (data) => (
    //     <div className="flex justify-end gap-1">
    //       <button
    //         onClick={() => handleOpenUpdateForm(data.id)}
    //         className="bg-primary-color py-1 px-2 text-sm font-medium text-white rounded"
    //       >
    //         Edit
    //       </button>
    //     </div>
    //   ),
    //   right: true, // Align the column to the right
    // },
  ];

  useEffect(() => {
    if (createError || updateError) {
      toast.error(createError.message || updateError.message);
    }
  }, [createError, updateError]);
  return (
    <>
      <div className="container mx-auto bg-white p-5 my-5 rounded-lg">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-lg font-semibold text-gray-700">Bus Info</h1>
          <div className="flex flex-col sm:flex-row gap-2 w-40 sm:w-auto">
            <input
              type="text"
              placeholder="Search"
              className="w-full sm:w-60"
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={() => {
                setIsEditing(false);
                setCurrentData(null);
                form.reset();
                setIsOpen(true);
              }}
              className="bg-primary-color py-1 px-2 text-base font-medium text-white rounded"
            >
              Add bus info
            </button>
          </div>
        </div>
        <DataTable
          columns={column}
          data={busRegNo?.busInfo
            ?.slice() // Create a shallow copy of the array
            .sort((a, b) => a.regNo.localeCompare(b.regNo))}
          responsive
          progressPending={busRegNoLoading}
          progressComponent={
            <div className="w-full py-4">
              <ComponentLoader />
            </div>
          }
          pagination
          paginationServer
          paginationTotalRows={
            busRegNo?.totalCount ? busRegNo?.totalCount : busRegNo?.searchCount
          }
          onChangeRowsPerPage={(perRow) => setLimit(perRow)}
          onChangePage={(page) => setPage(page)}
          paginationRowsPerPageOptions={[100, 150, 200]}
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
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="max-h-[95vh] sm:max-w-[625px] overflow-y-auto"
          // onClick={(e) => e.stopPropagation()}
          onPointerDownOutside={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{isEditing ? "Update Bus" : "Create Bus"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="regNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        {busTypes?.map((data) => (
                          <SelectItem key={data.id} value={data.label}>
                            {data.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
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

export default ProfileBusInfo;
