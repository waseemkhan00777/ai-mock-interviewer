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
import { Loader2 } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { chatSession } from "@/utils/gemini-ai-modal";
import { db } from "@/utils/db";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";

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
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);

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

  const { isSubmitting } = form.formState;

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      const { jobPosition, jobDescription, jobExperience } = values;
      const inputPrompt = `Job position: ${jobPosition}, Job description: ${jobDescription}, Years of experience: ${jobExperience}, Depends on job position, job description and years of experience give us ${process.env.NEXT_PUBLIC_AI_INTERVIEW_QUESTIONS_LIMIT} interview question along with Answer in json format`;
      // get data from gemini api
      const result = await chatSession.sendMessage(inputPrompt);
      const mockJsonResp = result.response
        .text()
        .replace("```json", "")
        .replace("```", "");
      setJsonResponse(JSON.parse(mockJsonResp));
      console.log(mockJsonResp);

      if (mockJsonResp) {
        // set response to state
        // save data to DB
        const response = await db
          .insert(MockInterview)
          .values({
            mockId: uuidv4(),
            jsonMockResp: mockJsonResp,
            jobPosition,
            jobDescription,
            jobExperience,
            createdBy: user?.primaryEmailAddress?.emailAddress ?? "",
            createdAt: moment().format("DD-MM-yyyy"),
          })
          .returning({
            mockId: MockInterview.mockId,
          });

        console.log("inserted data id: ", response);
      }
    },
    [user?.primaryEmailAddress?.emailAddress],
  );

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
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {isSubmitting ? (
                        <>
                          Generating <Loader2 className="animate-spin" />
                        </>
                      ) : (
                        "Start Interview"
                      )}
                    </Button>
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
