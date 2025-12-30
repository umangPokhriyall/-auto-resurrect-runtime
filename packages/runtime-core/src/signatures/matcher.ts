import type { FaultEvent, FaultSignature } from "shared-types/client";

export function matchSignature(
    faults: FaultEvent[]
): FaultSignature {

    // THREAD STALL = persistent latency violation from processor
    const processorLatencyStall = faults.some(
        f =>
            f.invariantId === "LATENCY_VIOLATION" &&
            f.source.includes("processor") &&
            f.count >= 2
    );

    if (processorLatencyStall) {
        return "THREAD_STALL";
    }

    return "UNKNOWN";
}
