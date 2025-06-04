"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { authClient } from "~/lib/auth-client";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function LoginPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(
    async (values) => {
      try {
        await authClient.signIn.email(
          {
            /**
             * The user email
             */
            email: values.email,
            /**
             * The user password
             */
            password: values.password,
            /**
             * A URL to redirect to after the user verifies their email (optional)
             */
            callbackURL: "/",
            /**
             * remember the user session after the browser is closed.
             * @default true
             */
            rememberMe: true,
          },
          {
            onSuccess: () => {
              toast.success("Logged in successfully!");
            },
            onError: (error) => {
              console.error(error);
              toast.error("Invalid email or password", {
                description:
                  "Please check your email and password and try again.",
              });
            },
          },
        );
      } catch (error) {
        console.error(error);
        toast.error("Invalid email or password", {
          description: "Please check your email and password and try again.",
        });
      }
    },
    (error) => {
      console.error(error);
      toast.error("Form error", {
        description: "Please check your email and password and try again.",
      });
    },
  );

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your email and password to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        type="email"
                        disabled={form.formState.isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        type="password"
                        disabled={form.formState.isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Logging in..." : "Login"}
              </Button>
              <p className="text-muted-foreground text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/register"
                  className="text-primary hover:text-primary/90 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
