import { type ClassValue, clsx } from "clsx";
import { type SyntheticEvent } from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function onPromise<T>(promise: (event: SyntheticEvent) => Promise<T>) {
  return (event: SyntheticEvent) => {
    if (promise) {
      promise(event).catch((error) => {
        console.log("Unexpected error", error);
      });
    }
  };
}

export const newsletterBaseApi = process.env.API_BASE ?? "/";

const getDefaultHeader = () => {
  const myHeaders = new Headers();
  myHeaders.append("Accept", "application/json");
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append(
    "Authorization",
    "af3g3aj*eYzxstC73exVLQai&Sj7gCuBiD2$DAQoghSNMPQ8^dk4QjK!pRxiqox&d!Va%kZ2!GGFa"
  );
  return myHeaders;
};

export const defaultHeader = getDefaultHeader();

export const isExternalURL = (url: string | URL) =>
  new URL(url).origin !== location.origin;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function deepEqual(a: any, b: any): boolean {
  // If both are identical (strict equality), they are equal
  if (a === b) return true;

  // If either value is null or not an object, they aren't deeply equal
  if (
    a === null ||
    typeof a !== "object" ||
    b === null ||
    typeof b !== "object"
  )
    return false;

  // If they don't have the same number of keys, they aren't deeply equal
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const keysA = Object.keys(a);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  // Check if all keys and values are the same
  for (const key of keysA) {
    if (!keysB.includes(key)) return false; // missing key in 'b'
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!deepEqual(a[key], b[key])) return false; // values aren't deeply equal
  }

  return true;
}
