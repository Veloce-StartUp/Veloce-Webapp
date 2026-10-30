"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { CalendarIcon } from "lucide-react";

const loadDialog = () =>
  import("@/components/schedule-meeting-dialog").then((module) => module.ScheduleMeetingDialog);

// The calendar and its date library are large, so they load only once someone goes to book a call.
const ScheduleMeetingDialog = dynamic(loadDialog, { ssr: false });

export function ScheduleMeetingModal() {
  const [open, setOpen] = useState(false);
  const [requested, setRequested] = useState(false);

  return (
    <>
      <button
        type="button"
        className="btn-glass btn-sm"
        aria-haspopup="dialog"
        aria-expanded={open}
        onPointerEnter={loadDialog}
        onTouchStart={loadDialog}
        onFocus={loadDialog}
        onClick={() => {
          setRequested(true);
          setOpen(true);
        }}
      >
        <CalendarIcon className="h-4 w-4" />
        Schedule Call
      </button>
      {requested && <ScheduleMeetingDialog open={open} onOpenChange={setOpen} />}
    </>
  );
}
