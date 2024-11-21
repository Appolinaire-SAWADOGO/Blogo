"use client";

import { useSubscribeStore } from "@/actions/store/subscribe";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Logo from "../logo";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { subscribeFormType } from "@/lib/types";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useMedia } from "react-use";
import { useSignIn, useSignUp, useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import axios from "axios";

export function SubscribeModal() {
  const mobile = useMedia("(max-width: 640px)");
  const { isSignedIn } = useUser();
  const { isLoaded, signUp, setActive } = useSignUp();
  const { signIn } = useSignIn();
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2>(1);
  const [UserEmail, setUserEmail] = useState("");
  const form = useForm<z.infer<typeof subscribeFormType>>({
    resolver: zodResolver(subscribeFormType),
    defaultValues: {
      email: "",
    },
  });
  const { reset, control, handleSubmit } = form;
  const { isOpen, close } = useSubscribeStore();

  const handleSubmits = async ({
    email,
  }: z.infer<typeof subscribeFormType>) => {
    if (isSignedIn) return;
    if (!isLoaded) return;

    if (!email) return;

    setUserEmail(email);

    // Start the sign-up process using the email and password provided
    try {
      setVerifying(true);

      // Try to sign in the user
      const signInAttempt = await signIn?.create({
        identifier: email,
        password: "@blogo1234",
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      // Si la connexion est réussie
      if (signInAttempt?.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        setVerifying(false);
        reset();
        close();
        toast({
          description: "Connected !",
        });
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      // toast({
      //   variant: "default",
      //   description: "Sometime went wrong !",
      // });

      if (err instanceof Error) {
        console.error(JSON.stringify(err, null, 2));
        await signUp.create({
          emailAddress: email,
          password: "@blogo1234",
        });

        // Send the user an email with the verification code
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        toast({
          variant: "default",
          description: "Please check the code sent to your email !",
        });

        setStep(2);
      }
    } finally {
      setVerifying(false);
    }
  };

  // Handle the submission of the verification form
  const handleVerify = async (email: string, code: string) => {
    if (isSignedIn) return;

    if (!isLoaded) return;

    if (!email || !code) return;

    try {
      setVerifying(true);

      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });

        await axios.post("/api/createsubscribe", { email });

        toast({ description: "Subscribe success !" });
        reset();
        setStep(1);
        setCode("");
        setVerifying(false);
        setUserEmail("");
        router.refresh();
        close();
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        toast({ description: "Code Incorrect !" });
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      if (err instanceof Error) console.error(JSON.stringify(err, null, 2));
    } finally {
      setVerifying(false);
    }
  };

  if (isOpen && mobile) close();

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-none border-[2.5px] border-black">
        <DialogHeader>
          <DialogTitle>
            <Logo className="text-2xl" />
          </DialogTitle>
          <DialogDescription className="font-normal">
            Join Blogo&apos;s newsletter! Enter and confirm your email to stay
            updated. 🚀
          </DialogDescription>
        </DialogHeader>

        {/* <div className="grid grid-cols-4 items-center gap-4"> */}
        <Form {...form}>
          <form onSubmit={handleSubmit(handleSubmits)}>
            {step === 1 ? (
              <FormField
                name="email"
                control={control}
                render={({ field }) => (
                  <div className="grid gap-4 py-4">
                    <FormItem>
                      <FormLabel className="font-normal">Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@gmail.com"
                          className="border-2 border-black rounded-none shadow-[7px_7px] focus:shadow-transparent duration-200"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription />
                      <FormMessage className="font-normal" />
                    </FormItem>
                  </div>
                )}
              />
            ) : (
              <div className="grid gap-4 py-4 mb-2 items-center">
                <FormLabel className="font-normal">Enter your code </FormLabel>
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={(value) => setCode(value)}
                  className="w-full flex-1"
                >
                  <InputOTPGroup className="w-full flex-1">
                    <InputOTPSlot className="w-full flex-1" index={0} />
                    <InputOTPSlot className="w-full flex-1" index={1} />
                    <InputOTPSlot className="w-full flex-1" index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup className="w-full flex-1">
                    <InputOTPSlot className="w-full flex-1" index={3} />
                    <InputOTPSlot className="w-full flex-1" index={4} />
                    <InputOTPSlot className="w-full flex-1" index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            )}

            <DialogFooter>
              {step === 1 ? (
                <Button
                  type="submit"
                  className="rounded-none border-2 border-black hover:bg-transparent hover:text-black
               bg-black text-white hover:shadow-none flex gap-2"
                >
                  {verifying && <Loader2 className="w-5 h-5 animate-spin" />}
                  Next
                </Button>
              ) : (
                <Button
                  onClick={() => handleVerify(UserEmail, code)}
                  className="rounded-none border-2 border-black hover:bg-transparent hover:text-black
               bg-black text-white hover:shadow-none flex gap-2"
                >
                  {verifying && <Loader2 className="w-5 h-5 animate-spin" />}
                  Subscribe
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
