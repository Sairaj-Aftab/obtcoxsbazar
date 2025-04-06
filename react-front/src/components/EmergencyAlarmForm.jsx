import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import {
  AlertTriangle,
  Camera,
  Loader2,
  Star,
  UploadIcon,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { alarmFormSchema } from "@/lib/schemas";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

// eslint-disable-next-line react/prop-types
export function EmergencyAlarmForm({
  busId,
  lon,
  lat,
  paribahanName,
  deviceInfo,
  ipAddress,
}) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // Initialize form with default values
  const form = useForm({
    resolver: zodResolver(alarmFormSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      regNo: "",
      emergencyType: "",
      location: "",
      description: "",
      images: [],
      lon: lon,
      lat: lat,
    },
  });

  // Handle form submission
  async function onSubmit(data) {
    if (submitted) {
      toast.error("Review already submitted!");
      return;
    }

    try {
      setIsSubmitting(true);

      // Create FormData for file uploads
      const formData = new FormData();

      // Append all regular fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== "images" && value !== undefined) {
          formData.append(key, value);
        }
      });

      // Append device info and IP address
      formData.append("paribahanName", paribahanName);
      formData.append("phoneName", deviceInfo.phoneName);
      formData.append("phoneModel", deviceInfo.phoneModel);
      formData.append("ipAddress", ipAddress);

      // Append files with the SAME FIELD NAME for backend array handling
      if (data.images && data.images.length > 0) {
        data.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      // Submit the review
      await axios.post(
        `${import.meta.env.VITE_API_URL}/alarm/create/${busId}`,
        formData,
        { withCredentials: true }
      );

      toast.success("Alarm submitted successfully!");
      setSubmitted(true);
      form.reset();
      setFiles([]);
      setPreviews([]);
    } catch (error) {
      toast.error("Failed to submit alarm. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleFileChange = (e) => {
    const fileList = e.target.files;
    if (fileList) {
      const newFiles = Array.from(fileList);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      form.setValue("images", [...form.getValues("images"), ...newFiles]);

      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
    }
  };

  const removeFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setPreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
    form.setValue(
      "images",
      form.getValues("images").filter((_, i) => i !== index)
    );
  };

  return (
    <>
      <Card>
        <CardHeader className="p-3">
          <div className="flex justify-center items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red" />
            <CardTitle className="text-red">Emergency Alarm</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={cn(
                          isSubmitting &&
                            "cursor-not-allowed text-muted-foreground"
                        )}
                      >
                        Your Name*
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          disabled={isSubmitting || submitted}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={cn(
                          isSubmitting &&
                            "cursor-not-allowed text-muted-foreground"
                        )}
                      >
                        Contact Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your phone number"
                          disabled={isSubmitting || submitted}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="regNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={cn(
                          isSubmitting &&
                            "cursor-not-allowed text-muted-foreground"
                        )}
                      >
                        Bus/Coach Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter bus registration number"
                          disabled={isSubmitting || submitted}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        className={cn(
                          isSubmitting &&
                            "cursor-not-allowed text-muted-foreground"
                        )}
                      >
                        Emergency Type
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isSubmitting || submitted}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select emergency type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="accident">Accident</SelectItem>
                          <SelectItem value="breakdown">
                            Vehicle Breakdown
                          </SelectItem>
                          <SelectItem value="medical">
                            Medical Emergency
                          </SelectItem>
                          <SelectItem value="fire">Fire</SelectItem>
                          <SelectItem value="security">
                            Security Threat
                          </SelectItem>
                          <SelectItem value="other">Other Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel
                        className={cn(
                          isSubmitting &&
                            "cursor-not-allowed text-muted-foreground"
                        )}
                      >
                        Current Location
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Describe your current location"
                          disabled={isSubmitting || submitted}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Please provide specific details about your location
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel
                        className={cn(
                          isSubmitting &&
                            "cursor-not-allowed text-muted-foreground"
                        )}
                      >
                        Emergency Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the emergency situation in detail..."
                          className="min-h-[120px] resize-none"
                          disabled={isSubmitting || submitted}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="images"
                  render={() => (
                    <FormItem className="md:col-span-2">
                      <FormLabel
                        className={cn(
                          isSubmitting &&
                            "cursor-not-allowed text-muted-foreground"
                        )}
                      >
                        Evidence Photos
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <Input
                              id="images"
                              type="file"
                              multiple
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileChange}
                              disabled={isSubmitting || submitted}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                document.getElementById("images")?.click()
                              }
                              disabled={isSubmitting || submitted}
                              className="gap-2"
                            >
                              <Camera className="h-4 w-4" />
                              Add Photos
                            </Button>
                            <FormDescription>
                              {files.length > 0
                                ? `${files.length} photo${
                                    files.length > 1 ? "s" : ""
                                  } selected`
                                : "Upload photos of the emergency situation"}
                            </FormDescription>
                          </div>
                          {previews.length > 0 && (
                            <div className="grid grid-cols-3 gap-4">
                              {previews.map((preview, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={preview || ""}
                                    alt={`Preview ${index + 1}`}
                                    className="rounded-md object-cover w-full aspect-square border"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    className="absolute -top-2 -right-2 h-6 w-6"
                                    onClick={() => removeFile(index)}
                                    disabled={isSubmitting || submitted}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full bg-red hover:bg-red text-white"
                  disabled={isSubmitting || submitted}
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting Emergency Report...
                    </>
                  ) : submitted ? (
                    "Emergency Report Submitted"
                  ) : (
                    "Submit Emergency Report"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <AlertDialog open={submitted} onOpenChange={setSubmitted}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submission Confirmed</AlertDialogTitle>
            <AlertDialogDescription>
              Your emergency alarm has been successfully submitted. You will now
              be redirected to the OBT homepage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => navigate("/", { replace: true })}>
              Ok
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
