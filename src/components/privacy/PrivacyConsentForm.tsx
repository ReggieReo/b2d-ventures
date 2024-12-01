"use client";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Checkbox } from "~/components/ui/checkbox";
import { updatePrivacyConsent } from "~/server/action/user_action";

export function PrivacyConsentForm() {
  const [open, setOpen] = useState(true);
  const [consent, setConsent] = useState(false);

  const handleConsent = async () => {
    await updatePrivacyConsent(consent);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Privacy Notice</DialogTitle>
          <DialogDescription>
            We value your privacy and want to be transparent about how we collect, 
            use, and protect your personal information.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p className="mb-2">By using our platform, we collect and process your data to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Facilitate investment transactions</li>
              <li>Verify your identity and maintain account security</li>
              <li>Send important notifications about your investments</li>
              <li>Improve our services and user experience</li>
              <li>Comply with legal and regulatory requirements</li>
            </ul>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="privacy-consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(checked as boolean)}
            />
            <label
              htmlFor="privacy-consent"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I consent to the collection and processing of my personal data as described 
              in the <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>
            </label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              onClick={handleConsent}
            >
              {consent ? "Accept" : "Continue without consent"}
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
} 