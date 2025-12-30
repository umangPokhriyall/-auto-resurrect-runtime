// packages/runtime-core/src/decision-engine/engine.ts

import type { FaultSignature, Decision } from "shared-types/client";

export function decide(
    signature: FaultSignature
): Decision {
    switch (signature) {
        case "THREAD_STALL":
            return {
                signature,
                action: "RESTART_MODULE",
                target: "processor",
                reason: "Processor thread stalled",
            };

        case "LATENCY_DEGRADATION":
            return {
                signature,
                action: "DEGRADE_MODE",
                target: "processor",
                reason: "Latency exceeded safe bounds",
            };

        default:
            return {
                signature,
                action: "NO_OP",
                target: "system",
                reason: "Unknown or transient fault",
            };
    }
}
