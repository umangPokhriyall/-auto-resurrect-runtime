import type { FaultSignature, Decision, FaultNature } from "shared-types/client";

export interface DecisionContext {
    nature?: FaultNature;
}

export function decide(
    signature: FaultSignature,
    context: DecisionContext = {}
): Decision {
    switch (signature) {
        case "THREAD_STALL":
            if (context.nature === "PERSISTENT") {
                return {
                    signature,
                    action: "DEGRADE_MODE",
                    target: "processor",
                    reason: "Persistent processor stall detected",
                };
            }

            return {
                signature,
                action: "RESTART_MODULE",
                target: "processor",
                reason: "Transient processor stall detected",
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
                reason: "Unknown or non-actionable fault",
            };
    }
}
