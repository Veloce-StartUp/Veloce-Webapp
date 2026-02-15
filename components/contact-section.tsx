"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Clock, Send, MessageSquare } from "lucide-react";
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

export function ContactSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

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
    <section
      ref={sectionRef}
      id="contact"
      className="py-20 bg-black relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-500/10 rounded-full blur-xl float-animation" />
        <div
          className="absolute bottom-20 right-10 w-40 h-40 bg-green-500/10 rounded-full blur-2xl float-animation"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-500/5 rounded-full blur-lg float-animation"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-20">
        <div
          className={`text-center mb-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance text-white">
            Get In <span className="text-green-400">Touch</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto text-pretty">
            Ready to transform your business with cutting-edge technology? Let's
            discuss your project.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <Card
              className={`group modern-card-hover bg-gray-900/80 backdrop-blur-sm border border-gray-800 ${isVisible ? "animate-fade-in-left" : "opacity-0"}`}
            >
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-500/30 group-hover:scale-110 transition-all duration-300">
                    <Mail className="h-6 w-6 text-green-400 group-hover:text-green-300 transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors">
                      Email Us
                    </h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      Send us a message
                    </p>
                  </div>
                </div>
                <p className="text-green-400 font-medium">
                  info@veloce-technology.com
                </p>
              </CardContent>
            </Card>

            <Card
              className={`group modern-card-hover bg-gray-900/80 backdrop-blur-sm border border-gray-800 ${isVisible ? "animate-fade-in-left" : "opacity-0"}`}
              style={{ animationDelay: "0.1s" }}
            >
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-500/30 group-hover:scale-110 transition-all duration-300">
                    <Phone className="h-6 w-6 text-green-400 group-hover:text-green-300 transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors">
                      Call Us
                    </h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      Mon-Fri 9am-6pm IST
                    </p>
                  </div>
                </div>
                <p className="text-green-400 font-medium">+94 (76) 879-4004</p>
                <p className="text-green-400 font-medium">+94 (75) 865-7450</p>
              </CardContent>
            </Card>

            <Card
              className={`group modern-card-hover bg-gray-900/80 backdrop-blur-sm border border-gray-800 ${isVisible ? "animate-fade-in-left" : "opacity-0"}`}
              style={{ animationDelay: "0.3s" }}
            >
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-500/30 group-hover:scale-110 transition-all duration-300">
                    <Clock className="h-6 w-6 text-green-400 group-hover:text-green-300 transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors">
                      Business Hours
                    </h3>
                    <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                      Indian Standard Time
                    </p>
                  </div>
                </div>
                <div className="text-sm space-y-1 text-gray-400 group-hover:text-gray-300 transition-colors">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card
              className={`h-fit modern-card-hover bg-gray-900/80 backdrop-blur-sm border border-gray-800 ${isVisible ? "animate-fade-in-right" : "opacity-0"}`}
              style={{ animationDelay: "0.2s" }}
            >
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <MessageSquare className="h-5 w-5 mr-2 text-green-400" />
                  Send us a message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">
                              Full Name *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Doe"
                                className="transition-all duration-200 focus:ring-2 focus:ring-green-400/20 focus:border-green-400 bg-gray-800 border-gray-700 text-white"
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
                            <FormLabel className="text-gray-300">
                              Email Address *
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="john@company.com"
                                className="transition-all duration-200 focus:ring-2 focus:ring-green-400/20 focus:border-green-400 bg-gray-800 border-gray-700 text-white"
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
                          <FormLabel className="text-gray-300">
                            Company (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your Company Name"
                              className="transition-all duration-200 focus:ring-2 focus:ring-green-400/20 focus:border-green-400 bg-gray-800 border-gray-700 text-white"
                              {...field}
                            />
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
                          <FormLabel className="text-gray-300">
                            Message *
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your project or how we can help you..."
                              rows={6}
                              className="resize-none transition-all duration-200 focus:ring-2 focus:ring-green-400/20 focus:border-green-400 bg-gray-800 border-gray-700 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 modern-button-hover bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 hover:scale-105 transition-all duration-300"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                      <ScheduleMeetingModal />
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
