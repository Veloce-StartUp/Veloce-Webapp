"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarClock, Clock, Mail, MessageSquare, Phone, Send } from "lucide-react";
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
import { toast } from "sonner";
import { ScheduleMeetingModal } from "@/components/schedule-meeting-modal";
import { SectionHeading, type HeadingLevel } from "@/components/section-heading";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  company: z.string().optional(),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

const fieldClass =
  "h-12 rounded-xl border-white/10 bg-white/[0.04] text-white placeholder:text-gray-400 transition-all duration-200 focus-visible:border-green-400/60 focus-visible:bg-white/[0.06] focus-visible:ring-green-400/20";

const contactDetails = [
  {
    icon: Mail,
    title: "Email Us",
    subtitle: "Send us a message",
    lines: ["build.veloce@gmail.com"],
    href: "mailto:build.veloce@gmail.com",
  },
  {
    icon: Phone,
    title: "Call Us",
    subtitle: "Mon-Fri 9am-6pm IST",
    lines: ["+94 (76) 879-4004", "+94 (75) 865-7450"],
    href: "tel:+94768794004",
  },
  {
    icon: Clock,
    title: "Business Hours",
    subtitle: "Indian Standard Time",
    lines: ["Monday - Friday: 9:00 AM - 6:00 PM", "Saturday: 10:00 AM - 4:00 PM", "Sunday: Closed"],
  },
];

export function ContactSection({ headingAs }: { headingAs?: HeadingLevel }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      toast.success("Message sent successfully!", {
        description: "We'll get back to you as soon as possible.",
      });
      form.reset();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="relative overflow-hidden py-24 md:py-32">
      <div
        aria-hidden="true"
        data-speed="0.8"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[900px] max-w-[150vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(34,197,94,0.05),transparent)]"
      />

      <div className="container relative z-20 mx-auto px-4">
        <SectionHeading
          as={headingAs}
          title={
            <>
              Get In <span className="text-gradient-green">Touch</span>
            </>
          }
          description="Ready to transform your business with cutting-edge technology? Let's discuss your project."
        />

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-5 lg:gap-8">
          {/* Contact Information */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <div data-reveal="left" className="glass rounded-[1.75rem] p-2">
              {contactDetails.map((detail, index) => {
                const Icon = detail.icon;
                const body = (
                  <>
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-green-400/25 bg-green-500/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-green-500/20">
                      <Icon className="h-5 w-5 text-green-400" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-white transition-colors group-hover:text-green-300">
                        {detail.title}
                      </span>
                      <span className="block text-xs text-gray-400">{detail.subtitle}</span>
                      <span className="mt-2 block space-y-0.5">
                        {detail.lines.map((line) => (
                          <span
                            key={line}
                            className={
                              detail.href ? "block font-medium text-green-400" : "block text-sm text-gray-300"
                            }
                          >
                            {line}
                          </span>
                        ))}
                      </span>
                    </span>
                  </>
                );

                const className = `group flex items-start gap-4 rounded-[1.25rem] p-4 transition-colors md:p-5 ${index > 0 ? "border-t border-white/[0.06]" : ""} ${detail.href ? "hover:bg-white/[0.04]" : ""}`;

                return detail.href ? (
                  <a key={detail.title} href={detail.href} className={className}>
                    {body}
                  </a>
                ) : (
                  <div key={detail.title} className={className}>
                    {body}
                  </div>
                );
              })}
            </div>

            <div data-reveal="left" className="glass-green rounded-[1.75rem] p-6">
              <div className="mb-3 flex items-center gap-3">
                <CalendarClock className="h-5 w-5 text-green-300" />
                <h3 className="font-semibold text-white">Prefer to talk it through?</h3>
              </div>
              <p className="mb-5 text-sm text-gray-200">
                Pick a time that suits you and we&apos;ll walk through your project together.
              </p>
              <ScheduleMeetingModal />
            </div>
          </div>

          {/* Contact Form */}
          <div data-reveal="right" className="glass spotlight rounded-[1.75rem] p-6 md:p-8 lg:col-span-3">
            <h3 className="mb-6 flex items-center text-lg font-semibold text-white">
              <MessageSquare className="mr-2 h-5 w-5 text-green-400" />
              Send us a message
            </h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" className={fieldClass} {...field} />
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
                        <FormLabel className="text-gray-200">Email Address *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@company.com"
                            className={fieldClass}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Company (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Company Name" className={fieldClass} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Message *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about your project or how we can help you..."
                          rows={6}
                          className={`${fieldClass} h-auto min-h-36 resize-none py-3`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary h-12 w-full text-base disabled:pointer-events-none disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
