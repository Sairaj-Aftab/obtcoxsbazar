import PageHeader from "../../components/PageHeader/PageHeader";
import { timeAgo } from "../../utils/timeAgo";
import { useEffect, useState } from "react";
import useAuth from "@/store/useAuth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Loading from "@/components/Loading/Loading";
import DataTable from "react-data-table-component";
import {
  useAllPermissions,
  useAllRoles,
  useCreateRole,
  useEditRole,
  useUpdateRoleStatus,
} from "@/services/users.service";
import { Eye, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  permissions: z.array(z.string()).min(1, {
    message: "At least one permission must be selected.",
  }),
});

const Role = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const { authUser } = useAuth();
  const { data, isLoading } = useAllRoles();
  const { data: permissions, isLoading: isLoadingPermissions } =
    useAllPermissions();
  const createRole = useCreateRole();
  const updateRole = useEditRole();
  const updateStatus = useUpdateRoleStatus();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      permissions: [],
    },
  });

  const handleEdit = (data) => {
    setIsEditing(true);
    setCurrentData(data);
    form.setValue("name", data.name);
    form.setValue(
      "permissions",
      data.permissions.map((p) => p.id)
    );
    setIsDialogOpen(true);
  };

  function onSubmit(data) {
    if (isEditing) {
      updateRole.mutate({ id: currentData.id, data });
    } else {
      createRole.mutate(data);
    }
  }

  useEffect(() => {
    if (
      createRole.isSuccess ||
      updateRole.isSuccess ||
      updateStatus.isSuccess
    ) {
      toast("Success", {
        description: `${
          createRole?.data?.message ||
          updateRole?.data?.message ||
          updateStatus?.data?.message
        }`,
      });
      setIsDialogOpen(false);
      setIsEditing(false);
      setCurrentData(null);
      form.reset();
    }
    if (createRole.error || updateRole.error || updateStatus.error) {
      toast("Error", {
        description: `${
          createRole?.error?.response?.data?.message ||
          updateRole?.error?.response?.data?.message ||
          updateStatus?.error?.response?.data?.message ||
          createRole?.error?.message ||
          updateRole?.error?.message ||
          updateStatus?.error?.message
        }`,
      });
    }
  }, [
    createRole?.data?.message,
    createRole.error,
    createRole.isSuccess,
    form,
    updateRole?.data?.message,
    updateRole.error,
    updateRole.isSuccess,
    updateStatus?.data?.message,
    updateStatus.error,
    updateStatus.isSuccess,
  ]);

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Slug",
      selector: (row) => row.slug,
      sortable: true,
    },
    {
      name: "Permissions",
      cell: (row) => (
        <ul className="list-disc list-inside space-y-1 py-1">
          {row.permissions.map((permission) => (
            <li key={permission.id}>{permission.name}</li>
          ))}
        </ul>
      ),
      width: "300px",
    },
    {
      name: "Created At",
      selector: (row) => timeAgo(row.createdAt),
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <Switch
          checked={row.status}
          // onCheckedChange={() => handleUpdateStatus(row.id, row.status)}
          disabled={authUser?.role?.name === "VIEWER"}
        />
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleEdit(row)}
          disabled={authUser?.role?.name === "VIEWER"}
        >
          <Eye className="h-4 w-4 text-primary" />
        </Button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center">
        <PageHeader title="User Role" />
        <Button
          onClick={() => {
            setIsEditing(false); // Reset editing mode
            form.reset(); // Reset form
            setIsDialogOpen(true);
          }}
        >
          Add Role
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data?.roles}
        responsive
        progressPending={isLoading}
        progressComponent={
          <div className="h-96 flex justify-center items-center">
            <Loading />
          </div>
        }
        pagination
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create User</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Role name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="permissions"
                render={() => (
                  <FormItem>
                    <FormLabel>Permissions</FormLabel>
                    {isLoadingPermissions && (
                      <Loader2 className="animate-spin w-5 h-5" />
                    )}
                    {permissions?.permission?.map((permission) => (
                      <FormField
                        key={permission.id}
                        control={form.control}
                        name="permissions"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={permission.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(permission.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          permission.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== permission.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {permission.name}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={
                  createRole.isPending ||
                  updateRole.isPending ||
                  authUser?.role?.name === "VIEWER" ||
                  authUser?.role?.name === "DEMO"
                }
              >
                {createRole.isPending || updateRole.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Role;
