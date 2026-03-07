"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { useSidebar } from "@/components/sidebar-context";

interface AppSidebarWrapperClientProps {
  isAdmin: boolean;
}

export function AppSidebarWrapperClient({ isAdmin }: AppSidebarWrapperClientProps) {
  const { open, close } = useSidebar();

  return (
    <AppSidebar
      isAdmin={isAdmin}
      open={open}
      onClose={close}
    />
  );
}
