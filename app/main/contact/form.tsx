"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";

const schema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Please enter a valid email" }),
  message: z.string().min(1, { message: "Please enter a message" }),
});

type FormValues = z.infer<typeof schema>;

export const ContactForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values }),
      });

      if (!res.ok) {
        setIsLoading(false);
        toast.error("Error sending message");
        return;
      }

      setIsLoading(false);
      reset();
      toast.success("Message sent successfully");
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      toast.error("Error sending message");
    }
  };

  return (
    <div className="flex h-[calc(100vh-379px)] min-h-[550px] items-center justify-center px-4">
      <div className="w-full max-w-[500px] space-y-4 rounded-xl border bg-background p-6 shadow-lg">
        <div className="space-y-1.5">
          <h3 className="font-semibold">Contact us</h3>
          <p className="text-[13px] text-muted-foreground">
            We&apos;d love to hear from you! Whether you have a question, feedback, or just want to
            say hello, we&apos;re here to help.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input placeholder="Your email" type="email" {...register("email")} />
            {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>How can we help?</Label>
            <Textarea placeholder="What's on your mind?" {...register("message")} />
            {errors.message && <p className="text-xs text-red-600">{errors.message.message}</p>}
          </div>
          <Button type="submit" size="sm" className="w-[114px]" disabled={isLoading}>
            {isLoading ? <ButtonSpinner /> : "Send message"}
          </Button>
        </form>
      </div>
    </div>
  );
};
