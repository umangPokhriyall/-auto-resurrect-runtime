
export type FaultSource =
    | "sensor"
    | "processor"
    | "transmitter"
    | "system"
    | "runtime";


export type FaultSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type FaultNature = "TRANSIENT" | "PERSISTENT";


export interface FaultEvent {
    id: string;
    invariantId: string;
    source: string;
    severity: FaultSeverity;
    firstSeen: number;
    lastSeen: number;
    count: number;
    nature?: FaultNature;
}

export type FaultSignature =
    | "THREAD_STALL"
    | "LATENCY_DEGRADATION"
    | "UNKNOWN";



