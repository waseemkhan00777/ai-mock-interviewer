"use client";
import React, { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  jobPosition: z.string().min(5, {
    message: "Must be at least 5 characters",
  }),
  jobDescription: z.string().min(10, {
    message: "Must be at least 10 characters",
  }),
  jobExperience: z.string().max(50, {
    message: "Must be 0 to 50",
  }),
});

const AddInterviewModal = () => {
  const [open, setOpen] = useState(false);
  const toggleOpenModal = useCallback(() => {
    setOpen(prev => !prev);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobPosition: "",
      jobDescription: "",
      jobExperience: "0",
    },
  });

  const onSubmit = useCallback((values: z.infer<typeof formSchema>) => {
    console.log(values);
  }, []);

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary
    hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={toggleOpenModal}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>
      <Dialog open={open} onOpenChange={toggleOpenModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interviewing
            </DialogTitle>
            <DialogDescription>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <div>
                    <h2>
                      Add details about your job position/rol, Job description
                      and years of experience
                    </h2>
                    <FormField
                      control={form.control}
                      name="jobPosition"
                      render={({ field }) => (
                        <FormItem className="mt-7 my-3">
                          <FormLabel>Job Role/Job Position</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="EX. Full Stack developer"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="jobDescription"
                      render={({ field }) => (
                        <FormItem className="my-3">
                          <FormLabel>
                            Job Description/Tech Stack (In short)
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="EX. React, Angular, NodeJs, MySql etc"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="jobExperience"
                      render={({ field }) => (
                        <FormItem className="my-3">
                          <FormLabel>Years of experience</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="EX. 5"
                              type="number"
                              max="50"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-5 justify-end">
                    <Button
                      variant="ghost"
                      type="button"
                      onClick={toggleOpenModal}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Start Interview</Button>
                  </div>
                </form>
              </Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddInterviewModal;
