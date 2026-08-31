"use client";

import { useBoolean, useMemoizedFn } from "ahooks";
import { useState } from "react";

import type { AdminSubscription } from "@/app/api/paddle/admin/subscriptions/route";
import type { AdminTransaction } from "@/lib/paddle/transactions";

export function useCustomerDialogs() {
  const [cancelOpen, { set: setCancelOpen, setTrue: openCancel }] =
    useBoolean(false);
  const [pauseOpen, { set: setPauseOpen, setTrue: openPause }] =
    useBoolean(false);
  const [resumeOpen, { set: setResumeOpen, setTrue: openResume }] =
    useBoolean(false);
  const [slotsOpen, { set: setSlotsOpen, setTrue: openSlots }] =
    useBoolean(false);
  const [refundOpen, { set: setRefundOpen, setTrue: openRefund }] =
    useBoolean(false);
  const [refundTarget, setRefundTarget] = useState<AdminTransaction | null>(
    null,
  );
  const [activeSubscription, setActiveSubscription] =
    useState<AdminSubscription | null>(null);

  const handleRefund = useMemoizedFn((row: AdminTransaction) => {
    setRefundTarget(row);
    openRefund();
  });

  const handleCancel = useMemoizedFn((sub: AdminSubscription) => {
    setActiveSubscription(sub);
    openCancel();
  });

  const handlePause = useMemoizedFn((sub: AdminSubscription) => {
    setActiveSubscription(sub);
    openPause();
  });

  const handleResume = useMemoizedFn((sub: AdminSubscription) => {
    setActiveSubscription(sub);
    openResume();
  });

  const handleChangeSlots = useMemoizedFn((sub: AdminSubscription) => {
    setActiveSubscription(sub);
    openSlots();
  });

  return {
    activeSubscription,
    cancelOpen,
    handleCancel,
    handleChangeSlots,
    handlePause,
    handleRefund,
    handleResume,
    pauseOpen,
    refundOpen,
    refundTarget,
    resumeOpen,
    setCancelOpen,
    setPauseOpen,
    setRefundOpen,
    setResumeOpen,
    setSlotsOpen,
    slotsOpen,
  };
}
