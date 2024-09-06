"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useLoading } from "@/hooks/useLoading";
import { registerPublicUser, loginPublicUser, verifyVerificationCode, registerGuest } from "./actions";
import { toast } from "sonner";

export function AuthDialog({
  dialogOpen,
  setDialogOpen,
  eventId,
}: {
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  eventId: string;
}) {
  const { isLoading, withLoading } = useLoading();
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);
  const [isVerification, setIsVerification] = useState(false);
  const [isGuestDialog, setIsGuestDialog] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = withLoading(async () => {
    setErrorMessage("");
    if (isSignIn) {
      const res = await loginPublicUser({
        username: userData.email,
        password: userData.password,
      });

      if (res.error) {
        setErrorMessage(res.error);
        return;
      }

      setDialogOpen(false);
      toast.success("Signed in successfully!");
    } else {
      const res = await registerPublicUser({
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.email,
        password: userData.password,
        eventId: eventId,
        phoneNumber: userData.phoneNumber,
      });

      if (res.error) {
        setErrorMessage(res.error);
        return;
      }

      setRegisterSuccess(true);
      setIsVerification(true);
    }
  });

  const handleVerification = withLoading(async () => {
    const res = await verifyVerificationCode({ code: verificationCode });

    if (res.error) {
      setErrorMessage(res.error);
      return;
    }

    setDialogOpen(false);
    toast.success("Email verified successfully!");
  });

  const handleContinueAsGuest = () => {
    setIsGuestDialog(true);
  };

  const handleGuestSubmit = withLoading(async () => {
 
    const res = await registerGuest({
      name: userData.firstName,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      eventId: eventId,
    });

    if (res.error) {
      setErrorMessage(res.error);
      toast.error(res.error);
      return;
    }

    setDialogOpen(false);
    toast.success("RSVPed successfully!");
  });

  const handleBack = () => {
    setIsGuestDialog(false);
    setIsSignIn(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        {!registerSuccess && !isSignIn && !isVerification && !isGuestDialog && (
          <DialogHeader>
            <DialogTitle>Create an account</DialogTitle>
            <DialogDescription>
              Please create an account to RSVP
            </DialogDescription>
          </DialogHeader>
        )}
        {!registerSuccess && isSignIn && !isVerification && !isGuestDialog && (
          <DialogHeader>
            <DialogTitle>Sign In</DialogTitle>
            <DialogDescription>
              Please enter your credentials
            </DialogDescription>
          </DialogHeader>
        )}
        {isVerification && (
          <DialogHeader>
            <DialogTitle>Verify Your Email</DialogTitle>
            <DialogDescription>
              Please enter the verification code sent to your email. This code is valid for 15 minutes.
            </DialogDescription>
          </DialogHeader>
        )}
        {isGuestDialog && (
          <DialogHeader>
            <DialogTitle>Continue as Guest</DialogTitle>
            <DialogDescription>
              Please provide your information to continue as a guest
            </DialogDescription>
          </DialogHeader>
        )}
        {isVerification ? (
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="verification-code">Verification Code</Label>
              <Input
                id="verification-code"
                placeholder="Enter your 6-digit code"
                required
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
            <Button
              className="w-full"
              onClick={handleVerification}
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </div>
        ) : registerSuccess ? (
          <div className="text-center">
            <p className="mb-4">Registration successful!</p>
            <p className="mb-4">Please check your email for the verification code.</p>
            <Button onClick={() => setIsVerification(true)}>Enter Verification Code</Button>
          </div>
        ) : isGuestDialog ? (
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="guest-name">Name</Label>
              <Input
                id="guest-name"
                placeholder="Your Name"
                required
                onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="guest-email">Email</Label>
              <Input
                id="guest-email"
                type="email"
                placeholder="your@email.com"
                required
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="guest-phone">Phone Number</Label>
              <Input
                id="guest-phone"
                type="tel"
                placeholder="Your Phone Number"
                onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}
              />
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
            <Button
              className="w-full"
              onClick={handleGuestSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "RSVP as Guest"}
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={handleBack}
            >
              Back
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-4">
              {!isSignIn && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input
                      id="first-name"
                      placeholder="Farhan"
                      required
                      onChange={(e) => {
                        setUserData({ ...userData, firstName: e.target.value });
                      }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input
                      id="last-name"
                      placeholder="Helmy"
                      required
                      onChange={(e) => {
                        setUserData({ ...userData, lastName: e.target.value });
                      }}
                    />
                  </div>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e) => {
                    setUserData({ ...userData, email: e.target.value });
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  onChange={(e) => {
                    setUserData({ ...userData, password: e.target.value });
                  }}
                />
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm">{errorMessage}</p>
              )}
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : (isSignIn ? "Sign In" : "Sign Up")}
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={handleContinueAsGuest}
                disabled={isLoading}
              >
                Continue as Guest
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {isSignIn ? (
                <>
                  Don&apos;t have an account?{" "}
                  <Button variant="link" className="p-0" onClick={() => setIsSignIn(false)}>
                    Sign up
                  </Button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Button variant="link" className="p-0" onClick={() => setIsSignIn(true)}>
                    Sign in
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
