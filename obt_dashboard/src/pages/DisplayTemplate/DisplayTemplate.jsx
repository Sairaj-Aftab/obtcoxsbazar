import PageHeader from "@/components/PageHeader/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Textarea } from "@/components/ui/textarea";
import { templateSchema } from "@/lib/schemas";
import {
  useCreateTemplate,
  useDeleteTemplate,
  useGetAllTemplate,
  useUpdateTemplate,
} from "@/services/displayTemplate.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Edit2, Eye, Loader2, MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const DisplayTemplate = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: templateData, isLoading: templateLoading } =
    useGetAllTemplate();
  const createInfo = useCreateTemplate();
  const updateInfo = useUpdateTemplate();
  const deleteInfo = useDeleteTemplate();

  const form = useForm({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      title: "",
      content: "",
      type: "",
      status: "",
      showFrom: null,
      showUntil: null,
    },
  });

  async function onSubmit(data) {
    if (isEditing) {
      updateInfo.mutate({ id: currentData.id, data });
    } else {
      createInfo.mutate({ data });
    }
  }

  useEffect(() => {
    if (createInfo.isSuccess || updateInfo.isSuccess || deleteInfo.isSuccess) {
      toast("Success", {
        description: `${
          createInfo?.data?.message ||
          updateInfo?.data?.message ||
          deleteInfo?.data?.message
        }`,
      });
      setIsDialogOpen(false);
      form.reset();
    }
    if (createInfo.error || updateInfo.error || deleteInfo.error) {
      toast("Error", {
        description: `${
          createInfo?.error?.response?.data?.message ||
          updateInfo?.error?.response?.data?.message ||
          deleteInfo?.error?.response?.data?.message ||
          createInfo?.error?.message ||
          updateInfo?.error?.message ||
          deleteInfo?.error?.message
        }`,
      });
    }
  }, [
    createInfo?.data?.message,
    createInfo.error,
    createInfo.isSuccess,
    deleteInfo?.data?.message,
    deleteInfo.error,
    deleteInfo.isSuccess,
    form,
    updateInfo?.data?.message,
    updateInfo.error,
    updateInfo.isSuccess,
  ]);

  // Get template type display name
  const getTemplateTypeLabel = (type) => {
    const typeMap = {
      birthday: "BIRTHDAY",
      anniversary: "Anniversary",
      promotion: "Promotion",
      wishing: "Wishes",
      celebration: "Celebration",
      "vip-welcome": "VIP Welcome",
    };
    return typeMap[type];
  };

  // Get template type color
  const getTemplateTypeColor = (type) => {
    const colorMap = {
      birthday: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
      anniversary:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      promotion:
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
      wishing:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      celebration:
        "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300",
      "vip-welcome":
        "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300",
    };
    return colorMap[type];
  };

  const onPreview = (templateId) => {};

  const onEdit = (templateId) => {};

  return (
    <div>
      <div className="flex justify-between items-center">
        <PageHeader title={"Display Template"} />
        <Button
          onClick={() => {
            setCurrentData(null);
            setIsEditing(false); // Reset editing mode
            form.reset(); // Reset form
            setIsDialogOpen(true);
          }}
        >
          Create Template
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templateData?.templates?.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            <div className="relative h-40 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
              <img
                src={template.thumbnail || "/placeholder.svg"}
                alt={template.title}
                className="h-full w-full object-cover transition-transform hover:scale-105"
              />
              <Badge
                className={`absolute left-2 top-2 ${getTemplateTypeColor(
                  template.type
                )}`}
              >
                {getTemplateTypeLabel(template.type)}
              </Badge>
              {template.scheduled && (
                <Badge className="absolute right-2 top-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Scheduled
                </Badge>
              )}
            </div>

            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="line-clamp-1">{template.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onPreview(template.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEdit(template.id)}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>

            <CardContent>
              <p className="line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                {template.description}
              </p>
              <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                <span>
                  Last modified:{" "}
                  {new Date(template.lastModified).toLocaleDateString()}
                </span>
                <span className="mx-2">•</span>
                <span>
                  {template.recipients} recipient
                  {template.recipients !== 1 ? "s" : ""}
                </span>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between pt-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPreview(template.id)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button size="sm" onClick={() => onEdit(template.id)}>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="max-h-[95vh] sm:max-w-[625px] overflow-y-auto"
          // onClick={(e) => e.stopPropagation()}
          onPointerDownOutside={(event) => event.preventDefault()}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Update Template" : "Create Template"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter template title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Content */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter template content"
                        className="min-h-[120px]"
                        {...field}
                      />
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
                    <FormLabel>Template Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select template type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="WELCOME">Welcome</SelectItem>
                        <SelectItem value="BIRTHDAY">Birthday</SelectItem>
                        <SelectItem value="ANNIVERSARY">Anniversary</SelectItem>
                        <SelectItem value="PROMOTION">Promotion</SelectItem>
                        <SelectItem value="GENERAL">General</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Show From */}
              <FormField
                control={form.control}
                name="showFrom"
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
                      <FormLabel>Show From</FormLabel>
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

              {/* Show Until */}
              <FormField
                control={form.control}
                name="showUntil"
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
                      <FormLabel>Show Until</FormLabel>
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

              {/* Status */}
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
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait...
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

export default DisplayTemplate;
