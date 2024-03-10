import { Spinner } from "flowbite-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center py-20">
      <Spinner className="fill-main-border" size="xl" />
      <p className="text-main-border pl-3 text-xl">Loading...</p>
    </div>
  );
}
