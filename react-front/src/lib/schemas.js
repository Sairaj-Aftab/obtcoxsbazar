import * as z from "zod";

export const reportFormSchema = z.object({
  reportType: z.enum(["LOST", "FOUND"]),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid mobile number"),
  address: z.string().min(5, "Please enter a valid address"),
  statusType: z.enum(["tourist", "local"]),
  place: z.string().min(2, "Please specify a valid location"),
  dateTime: z.string().refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date <= new Date();
    },
    {
      message: "Please enter a valid date and time not in the future",
    }
  ),
  goods: z.string().min(2, "Please list the lost or found items"),
  images: z
    .array(z.instanceof(File))
    .max(5, "Maximum 5 images can be uploaded")
    .optional(),
  policeReport: z.string().optional(),
  description: z.string().min(10, "Please provide a detailed description"),
});
// Scheude Schema
export const scheduleSchema = z.object({
  busName: z.string().min(1, "Paribahan name is required"),
  time: z.string().min(1, "Starting time is required"),
  busNo: z.string().min(1, "Registration number is required"),
  type: z.string().min(1, "Bus type is required"),
  leavingPlace: z.string().min(1, "Departure place is required"),
  leavingMapLink: z.string().optional(),
  destinationPlace: z.string().min(1, "Destination place is required"),
  destinationMapLink: z.string().optional(),
  guideName: z.string().min(1, "Guide name is required"),
  guidePhone: z.string().min(1, "Guide phone is required"),
  driverName: z.string().optional(),
  driverPhone: z.string().optional(),
  rent: z.coerce.number().min(1, "Rent amount is required"),
  discountRent: z.coerce.number().optional(),
  seatStatus: z.boolean(),
});

// Paribahan User Form
export const busInfoSchema = z.object({
  paribahanUserId: z.string().min(1, { message: "Paribahan Name is required" }),
  regNo: z.string().min(1, { message: "Registration Number is required" }),
  type: z.enum(
    [
      "Non-AC",
      "AC",
      "Sleeper Coach",
      "Double-decker",
      "Suite Class",
      "Hyundai Biz Class",
      "Mercedes-Benz",
      "Local Service",
    ],
    {
      required_error: "Bus Type is required",
    }
  ),
});
// Driver Form
export const driverFormSchema = z.object({
  paribahanUserId: z.string().min(1, { message: "Paribahan Name is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  fatherName: z.string().optional(),
  phone: z.string().optional(),
  license: z.string().optional(),
  address: z.string().optional(),
  comment: z.string().optional(),
  report: z.string().optional(),
});
// Guide Form
export const guideFormSchema = z.object({
  paribahanUserId: z.string().min(1, { message: "Paribahan Name is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  phone: z.string().optional(),
  address: z.string().optional(),
});
