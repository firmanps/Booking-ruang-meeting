"use client";

import { Toast } from "@base-ui/react/toast";
import { X } from "lucide-react";

export const toastManager = Toast.createToastManager();

export const toast = {
  success(message: string) {
    toastManager.add({ title: message, type: "success", priority: "low" });
  },
  error(message: string) {
    toastManager.add({ title: message, type: "error", priority: "high" });
  },
};

const toastRootClassName = [
  "pointer-events-auto cn-toast group/toast absolute top-0 right-0 z-[calc(1000-var(--toast-index))] h-(--height) w-full origin-top rounded-xl border border-slate-200 bg-white text-slate-900 shadow-lg outline-none",
  "[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)+calc(var(--toast-index)*var(--gap))+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]",
  "[transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)+(var(--toast-index)*var(--peek))+(var(--shrink)*var(--height))))_scale(var(--scale))] [transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms]",
  "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
  "data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
  "data-limited:opacity-0 data-starting-style:[transform:translateY(-150%)]",
  "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(-150%)]",
  "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
  "data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
  "data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
  "data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
  "data-expanded:data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
  "data-expanded:data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
  "data-expanded:data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
  "data-expanded:data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
  "data-[type=error]:border-red-200 data-[type=success]:border-emerald-200",
].join(" ");

function ToastList() {
  const { toasts } = Toast.useToastManager();
  return (
    <Toast.Portal>
      <Toast.Viewport className="pointer-events-none fixed inset-x-4 top-4 z-[100] mx-auto w-auto max-w-xl outline-none">
        {toasts.map((item) => (
          <Toast.Root
            key={item.id}
            toast={item}
            swipeDirection="down"
            className={toastRootClassName}
          >
            <Toast.Content className="flex h-full items-center justify-between gap-3 overflow-hidden p-4 transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100">
              <Toast.Title className="min-w-0 flex-1 text-sm font-medium leading-5" />
              <Toast.Close aria-label="Tutup notifikasi" className="pointer-events-auto shrink-0 rounded-md p-1 text-slate-500 hover:bg-slate-100">
                <X className="size-4" />
              </Toast.Close>
            </Toast.Content>
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  );
}

export function Toaster() {
  return (
    <Toast.Provider toastManager={toastManager} timeout={4500}>
      <ToastList />
    </Toast.Provider>
  );
}
