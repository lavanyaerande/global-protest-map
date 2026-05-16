"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  ArrowLeft,
  CalendarIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Info,
} from "lucide-react";
import { categories, ProtestCategory, ProtestStatus } from "@/lib/mock-data";
import { submitProtest } from "@/lib/api";
import { cn } from "@/lib/utils";
import Link from "next/link";

const LocationPicker = dynamic(
  () => import("@/components/location-picker").then((mod) => mod.LocationPicker),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    ),
  }
);

interface FormData {
  title: string;
  description: string;
  category: ProtestCategory | "";
  status: ProtestStatus | "";
  startDate: Date | undefined;
  endDate: Date | undefined;
  location: { lat: number; lng: number; address?: string } | null;
  city: string;
  country: string;
  organizers: string;
  sourceUrl: string;
  participantEstimate: string;
}

export default function SubmitProtestPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    status: "",
    startDate: undefined,
    endDate: undefined,
    location: null,
    city: "",
    country: "",
    organizers: "",
    sourceUrl: "",
    participantEstimate: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (currentStep === 1) {
      if (!formData.title.trim()) newErrors.title = "Title is required";
      if (!formData.description.trim()) newErrors.description = "Description is required";
      if (!formData.category) newErrors.category = "Category is required";
      if (!formData.status) newErrors.status = "Status is required";
    }

    if (currentStep === 2) {
      if (!formData.startDate) newErrors.startDate = "Start date is required";
      if (!formData.location) newErrors.location = "Location is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.country.trim()) newErrors.country = "Country is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    setIsSubmitting(true);

    try {
     await submitProtest({
  title: formData.title,
  description: formData.description,

  date: formData.startDate!.toISOString(),  // ✅ ADD THIS LINE

  category: formData.category as ProtestCategory,
  status: formData.status as ProtestStatus,

  startDate: formData.startDate!.toISOString().split("T")[0],
  endDate: formData.endDate?.toISOString().split("T")[0],

  location: {
    lat: formData.location!.lat,
    lng: formData.location!.lng,
    city: formData.city,
    country: formData.country,
    address: formData.location!.address,
  },

  organizers: formData.organizers
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),

  participantCount: formData.participantEstimate
    ? parseInt(formData.participantEstimate)
    : undefined,

  sources: formData.sourceUrl
    ? [{ name: "Source", url: formData.sourceUrl }]
    : undefined,
});
      

      setSubmitSuccess(true);
    } catch (error) {
      console.error("Submit failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-14">
          <div className="max-w-2xl mx-auto px-4 py-16">
            <Card className="text-center">
              <CardContent className="pt-12 pb-8">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Submission Received
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Thank you for your submission. Our team will review the information
                  and verify the details before publishing it to the map.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link href="/">
                    <Button>View Map</Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSubmitSuccess(false);
                      setStep(1);
                      setFormData({
                        title: "",
                        description: "",
                        category: "",
                        status: "",
                        startDate: undefined,
                        endDate: undefined,
                        location: null,
                        city: "",
                        country: "",
                        organizers: "",
                        sourceUrl: "",
                        participantEstimate: "",
                      });
                    }}
                  >
                    Submit Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-14">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-muted-foreground mb-4">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Map
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Submit a Protest
            </h1>
            <p className="text-muted-foreground">
              Help us track protests around the world by submitting verified information.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    s === step
                      ? "bg-primary text-primary-foreground"
                      : s < step
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {s < step ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={cn(
                      "flex-1 h-1 rounded-full",
                      s < step ? "bg-green-500" : "bg-muted"
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Basic Information */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Provide the essential details about the protest
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Protest Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Climate Action March"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className={errors.title ? "border-destructive" : ""}
                  />
                  {errors.title && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.title}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the protest, its goals, and any relevant context..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className={errors.description ? "border-destructive" : ""}
                  />
                  {errors.description && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      Category <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value as ProtestCategory })
                      }
                    >
                      <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.category}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Status <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value as ProtestStatus })
                      }
                    >
                      <SelectTrigger className={errors.status ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="past">Past</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.status && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.status}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Location & Date */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Location & Date</CardTitle>
                <CardDescription>
                  When and where is the protest taking place?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      Start Date <span className="text-destructive">*</span>
                    </Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.startDate && "text-muted-foreground",
                            errors.startDate && "border-destructive"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate
                            ? format(formData.startDate, "PPP")
                            : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.startDate}
                          onSelect={(date) =>
                            setFormData({ ...formData, startDate: date })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.startDate && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.startDate}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>End Date (optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate
                            ? format(formData.endDate, "PPP")
                            : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.endDate}
                          onSelect={(date) =>
                            setFormData({ ...formData, endDate: date })
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>
                    Location <span className="text-destructive">*</span>
                  </Label>
                  <LocationPicker
                    value={formData.location || undefined}
                    onChange={(loc) =>
                      setFormData({ ...formData, location: loc })
                    }
                  />
                  {errors.location && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.location}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      City <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="city"
                      placeholder="e.g., Paris"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className={errors.city ? "border-destructive" : ""}
                    />
                    {errors.city && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.city}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">
                      Country <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="country"
                      placeholder="e.g., France"
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      className={errors.country ? "border-destructive" : ""}
                    />
                    {errors.country && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.country}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Additional Details */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
                <CardDescription>
                  Help us verify the protest with additional information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="organizers">Organizers (optional)</Label>
                  <Input
                    id="organizers"
                    placeholder="Comma-separated list of organizing groups"
                    value={formData.organizers}
                    onChange={(e) =>
                      setFormData({ ...formData, organizers: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    e.g., Organization A, Group B, Coalition C
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="participantEstimate">
                    Estimated Participants (optional)
                  </Label>
                  <Input
                    id="participantEstimate"
                    type="number"
                    placeholder="e.g., 5000"
                    value={formData.participantEstimate}
                    onChange={(e) =>
                      setFormData({ ...formData, participantEstimate: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sourceUrl">Source URL (optional)</Label>
                  <Input
                    id="sourceUrl"
                    type="url"
                    placeholder="https://..."
                    value={formData.sourceUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, sourceUrl: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Link to a news article or official announcement
                  </p>
                </div>

                <div className="p-4 bg-muted rounded-lg flex items-start gap-3">
                  <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      Verification Process
                    </p>
                    <p className="text-xs text-muted-foreground">
                      All submissions are reviewed by our team before being published.
                      Providing source URLs and organizer information helps speed up
                      the verification process.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            {step > 1 ? (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <Button onClick={handleNext}>Continue</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Protest"
                )}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
