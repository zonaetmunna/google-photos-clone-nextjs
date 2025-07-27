"use client";

import { useEffect, useState } from "react";
import { useMobile } from "./use-mobile";

export const useSidebar = () => {
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  return {
    sidebarOpen,
    setSidebarOpen,
  };
};
