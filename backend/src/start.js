import { Temporal } from "@js-temporal/polyfill";

globalThis.Temporal = Temporal;

await import("./server.js");


// Why? Prisma needs the Temporal object to generate timestamps. This file makes Temporal available before loading the backend.