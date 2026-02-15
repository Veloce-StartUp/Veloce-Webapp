"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DayPicker } from "react-day-picker";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  date: z.date({
    required_error: "A date of meeting is required.",
  }),
  time: z.string({
    required_error: "Please select a time.",
  }),
  topic: z.string().optional(),
});

// Generate time slots (09:00 to 17:30)
const TIME_SLOTS: string[] = [];
for (let i = 9; i <= 17; i++) {
  TIME_SLOTS.push(`${i.toString().padStart(2, "0")}:00`);
  TIME_SLOTS.push(`${i.toString().padStart(2, "0")}:30`);
}

export function ScheduleMeetingModal() {
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [showCalendar, setShowCalendar] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      topic: "",
    },
  });

  const selectedDate = form.watch("date");

  // Reset calendar visibility when dialog closes
  React.useEffect(() => {
    if (!open) {
      setShowCalendar(false);
      form.reset();
    }
  }, [open, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          date: values.date.toISOString(),
        }),
      });

      if (!res.ok) throw new Error("Failed to schedule");

      toast.success("Meeting scheduled!", {
        description: "Check your email for the calendar invite.",
      });
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Failed to schedule meeting");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="modern-button-hover border-green-500 text-green-400 hover:bg-green-600 hover:text-white bg-transparent hover:scale-105 transition-all duration-300"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          Schedule Call
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-gray-900 border-gray-800 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            Schedule a Meeting
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Choose a suitable time for us to discuss your project.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.stopPropagation();
              form.handleSubmit(onSubmit)(e);
            }}
            className="space-y-4 pt-2"
          >
            {/* Name & Email row */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your Name"
                        className="bg-gray-800 border-gray-700 text-white focus:ring-green-500/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        className="bg-gray-800 border-gray-700 text-white focus:ring-green-500/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Date & Time row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Date picker trigger */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-gray-300">Date</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCalendar(!showCalendar)}
                      className={cn(
                        "w-full pl-3 text-left font-normal bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-white",
                        field.value ? "text-white" : "text-gray-500",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "MMM d, yyyy")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
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
                    <FormLabel className="text-gray-300">Time</FormLabel>
                    <FormControl>
                      <select
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                        disabled={!selectedDate}
                        className="flex h-9 w-full rounded-md border bg-gray-800 border-gray-700 text-white px-3 py-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500/50 appearance-none"
                      >
                        <option value="" disabled className="text-gray-500">
                          {selectedDate ? "Select time" : "Pick date first"}
                        </option>
                        {TIME_SLOTS.map((slot) => (
                          <option
                            key={slot}
                            value={slot}
                            className="bg-gray-800 text-white"
                          >
                            {slot}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Inline Calendar */}
            {showCalendar && (
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <div className="rounded-xl border border-gray-700/50 bg-gray-800/50 backdrop-blur-sm p-3 shadow-xl shadow-green-500/5">
                    <DayPicker
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        if (date) setShowCalendar(false);
                      }}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                      showOutsideDays
                      classNames={{
                        root: "w-full",
                        months: "flex flex-col",
                        month: "space-y-3",
                        month_caption: "flex justify-center items-center h-8",
                        caption_label: "text-sm font-semibold text-white",
                        nav: "flex items-center justify-between absolute inset-x-0 top-0 px-1",
                        button_previous:
                          "h-7 w-7 inline-flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors",
                        button_next:
                          "h-7 w-7 inline-flex items-center justify-center rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors",
                        month_grid: "w-full border-collapse",
                        weekdays: "flex",
                        weekday:
                          "text-gray-500 w-9 h-8 flex items-center justify-center text-xs font-medium uppercase",
                        week: "flex w-full mt-1",
                        day: "relative p-0 text-center flex-1 flex items-center justify-center",
                        day_button:
                          "h-9 w-9 rounded-lg text-sm font-medium text-gray-300 hover:bg-green-600/30 hover:text-white transition-all duration-150 cursor-pointer flex items-center justify-center",
                        selected:
                          "[&>button]:bg-green-600 [&>button]:text-white [&>button]:hover:bg-green-500 [&>button]:shadow-lg [&>button]:shadow-green-600/30",
                        today:
                          "[&>button]:border [&>button]:border-green-500/50 [&>button]:text-green-400",
                        outside:
                          "[&>button]:text-gray-600 [&>button]:hover:text-gray-400",
                        disabled:
                          "[&>button]:text-gray-700 [&>button]:hover:bg-transparent [&>button]:cursor-not-allowed [&>button]:opacity-40",
                      }}
                    />
                  </div>
                )}
              />
            )}

            {/* Topic */}
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">
                    Topic (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Project discussion"
                      className="bg-gray-800 border-gray-700 text-white focus:ring-green-500/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white mt-4 font-medium transition-all duration-200"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Scheduling...
                </>
              ) : (
                "Confirm Meeting"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
