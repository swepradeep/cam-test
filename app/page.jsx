"use client";

import dynamic from "next/dynamic";
import React from "react";

const CameraComponent = dynamic(() => import("./components/Camera"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <CameraComponent />
    </main>
  );
}
