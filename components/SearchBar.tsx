"use client";

import { useSearchParams } from "next/navigation";

export default function SearchBar() {
  const searchParams = useSearchParams();

  const search = searchParams.get("search");

  // This will not be logged on the server during prerendering
  console.log(search);

  return <>Search: {search}</>;
}
