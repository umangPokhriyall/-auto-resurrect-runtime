// fault.ts

// Where the fault originated
export type FaultSource =
    | "sensor"
    | "processor"
    | "transmitter"
    | "system"
    | "runtime";

// Severity is important for decision priority
export type FaultSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

// Atomic fault event emitted by detection engine
export interface FaultEvent {
    id: string;
    invariantId: string;
    source: string;
    severity: FaultSeverity;
    firstSeen: number;
    lastSeen: number;
    count: number;
}

export type FaultSignature =
    | "THREAD_STALL"
    | "LATENCY_DEGRADATION"
    | "UNKNOWN";



