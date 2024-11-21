"use client";

import React, { useState } from "react";
import Logo from "./logo";
import { Button } from "../ui/button";
import { Loader2, LogOut, MenuIcon } from "lucide-react";
import { useSubscribeStore } from "@/actions/store/subscribe";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useMedia } from "react-use";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { subscribeFormType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCategoryStore } from "@/actions/store/category";
import { cn } from "@/lib/utils";
import { useAuth, useSignIn, useSignUp, useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import { Skeleton } from "../ui/skeleton";
import axios from "axios";

const Header = () => {
  const { isSignedIn, isLoaded } = useUser();
  const { signOut } = useAuth();
  const { signUp, setActive } = useSignUp();
  const { signIn } = useSignIn();

  const { open } = useSubscribeStore();
  const mobile = useMedia("(max-width: 640px)");
  const { categoryStore, setGamingStore, setTechnologyStore, setAllStore } =
    useCategoryStore();

  const [userEmail, setUserEmail] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [code, setCode] = useState("");

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof subscribeFormType>>({
    resolver: zodResolver(subscribeFormType),
    defaultValues: {
      email: "",
    },
  });
  const { reset, control, handleSubmit } = form;

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
        await setActive?.({ session: signInAttempt.createdSessionId });
        setUserEmail("");
        setVerifying(false);
        reset();
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
        await signUp?.create({
          emailAddress: email,
          password: "@blogo1234",
        });

        // Send the user an email with the verification code
        await signUp?.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        toast({
          variant: "default",
          description: "Please check the code sent to your email !",
        });

        setVerifying(false);
        setStep(2);
      }
    }
  };

  // Handle the submission of the verification form
  const handleVerify = async (email: string, code: string) => {
    console.log("salut !!!", email, code);

    if (isSignedIn) return;

    if (!isLoaded) return;

    if (!email || !code) return;

    try {
      setVerifying(true);

      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp?.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt?.status === "complete") {
        await setActive?.({ session: signUpAttempt?.createdSessionId });

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

  return (
    <div className="fixed top-0 2 right-0 left-0 z-50 bg-white">
      <div className="lg:max-w-5xl m-auto p-6 flex justify-between text-center items-center border-b-2 border-black bg-white">
        <Logo />

        {!isSignedIn ? (
          <Button
            onClick={open}
            className="max-sm:hidden bg-transparent rounded-none text-black border-2 border-black shadow-[6px_6px] hover:bg-black hover:shadow-transparent hover:text-white animate-out duration-100"
          >
            {!isLoaded ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Subscribe"
            )}
          </Button>
        ) : (
          <Button
            onClick={() => signOut()}
            className="max-sm:hidden bg-transparent rounded-none text-black border-2 border-black shadow-[6px_6px] hover:bg-black hover:shadow-transparent hover:text-white animate-out duration-100"
          >
            {!isLoaded ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Logout"
            )}
          </Button>
        )}

        {mobile && (
          <Sheet>
            {isLoaded && (
              <SheetTrigger className="sm:hidden" asChild>
                <div className="border-2 border-black px-1 bg-black hover:bg-transparent text-white hover:text-black cursor-pointer animate-out duration-100">
                  <MenuIcon width={30} height={30} />
                </div>
              </SheetTrigger>
            )}

            {!isLoaded && <Skeleton className="w-[40px] h-[40px]" />}

            <SheetContent className="border-l-[3.5px] border-black">
              <SheetHeader>
                <SheetTitle className="flex items-start justify-start text-star">
                  <Logo className="text-4xl" />
                </SheetTitle>
              </SheetHeader>
              <div className=" flex flex-col items-center justify-center mt-8 gap-5">
                <Button
                  onClick={setAllStore}
                  className={cn(
                    categoryStore === "all"
                      ? "rounded-none w-full"
                      : "border-2 border-black rounded-none w-full bg-transparent hover:bg-black shadow-[8px_8px] text-black hover:text-white"
                  )}
                >
                  All
                </Button>
                <Button
                  onClick={setTechnologyStore}
                  className={cn(
                    categoryStore === "technology"
                      ? "rounded-none w-full"
                      : "border-2 border-black rounded-none w-full bg-transparent hover:bg-black shadow-[8px_8px] text-black hover:text-white"
                  )}
                >
                  Technologie
                </Button>
                <Button
                  onClick={setGamingStore}
                  className={cn(
                    categoryStore === "gaming"
                      ? "rounded-none w-full"
                      : "border-2 border-black rounded-none w-full bg-transparent hover:bg-black shadow-[8px_8px] text-black hover:text-white"
                  )}
                >
                  Gaming
                </Button>
              </div>
              <div className={"grid gap-4 mt-10"}>
                <h1
                  className={cn(
                    "font-extrabold text-2xl",
                    isSignedIn && "hidden"
                  )}
                >
                  Subscribe
                </h1>
                <SheetDescription
                  className={cn("font-normal -mt-3", isSignedIn && "hidden")}
                >
                  Join Blogo&apos;s newsletter! Enter and confirm your email to
                  stay updated. 🚀
                </SheetDescription>
                <Form {...form}>
                  <form
                    onSubmit={handleSubmit(handleSubmits)}
                    className={cn(isSignedIn && "hidden")}
                  >
                    {step === 1 ? (
                      <FormField
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <div className="grid gap-4 w-full">
                            {" "}
                            <FormItem>
                              <FormLabel className="font-normal w-full">
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="example@gmail.com"
                                  className="border-2 border-black rounded-none shadow-[7px_7px] focus:shadow-transparent duration-200 w-full"
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
                      <>
                        {" "}
                        <div className="grid gap-4 my-2 mb-4 w-full max-[341px]:hidden">
                          <FormLabel className="font-normal">
                            Enter your code{" "}
                          </FormLabel>
                          <InputOTP
                            className="w-full flex-1"
                            maxLength={6}
                            value={code}
                            onChange={(value) => setCode(value)}
                          >
                            <InputOTPGroup className="w-full flex-1">
                              <InputOTPSlot
                                className="w-full flex-1"
                                index={0}
                              />
                              <InputOTPSlot
                                className="w-full flex-1"
                                index={1}
                              />
                              <InputOTPSlot
                                className="w-full flex-1"
                                index={2}
                              />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup className="w-full flex-1">
                              <InputOTPSlot
                                className="w-full flex-1"
                                index={3}
                              />
                              <InputOTPSlot
                                className="w-full flex-1"
                                index={4}
                              />
                              <InputOTPSlot
                                className="w-full flex-1"
                                index={5}
                              />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                        <div className="min-[341px]:hidden grid gap-2 my-2 mb-4 w-full">
                          <FormLabel className="font-normal">
                            Enter your code{" "}
                          </FormLabel>
                          <Input
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="1234"
                            className="border focus:border-[3px] border-black"
                          />
                        </div>
                      </>
                    )}

                    <SheetFooter className="mt-2">
                      {step === 1 && (
                        <Button
                          type="submit"
                          className={
                            "rounded-none border-2 text-white border-black bg-black hover:bg-transparent w-full hover:text-black hover:shadow-none"
                          }
                        >
                          {verifying ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            "Next"
                          )}
                        </Button>
                      )}
                      {step === 2 && (
                        <Button
                          type="button"
                          onClick={() => handleVerify(userEmail, code)}
                          className="rounded-none border-2 text-white border-black bg-black hover:bg-transparent w-full hover:text-black
                             hover:shadow-none"
                        >
                          {verifying ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            "Subcribe"
                          )}
                        </Button>
                      )}
                    </SheetFooter>
                  </form>
                </Form>
                {isSignedIn && (
                  <Button
                    onClick={() => signOut()}
                    className="rounded-none border-2 text-white border-black bg-black hover:bg-transparent w-full hover:text-black
                             hover:shadow-none flex gap-2"
                  >
                    {isLoaded && <LogOut className="h-5 w-5" />}

                    {!isLoaded ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Logout"
                    )}
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </div>
  );
};

export default Header;
