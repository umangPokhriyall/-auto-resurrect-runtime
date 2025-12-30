import type { InvariantViolation, TelemetrySignal }
    from "shared-types/client";

export interface TelemetrySnapshot {
    now: number;
    heartbeatTs: number;
    latencyMs: number;
}

const INVARIANTS = {
    HEARTBEAT_MAX_GAP_MS: 2000,
    MAX_ALLOWED_LATENCY_MS: 500,
};

export function checkInvariants(
    telemetry: TelemetrySnapshot
): InvariantViolation[] {
    const violations: InvariantViolation[] = [];

    /* -------- Heartbeat Invariant -------- */

    const heartbeatGap = telemetry.now - telemetry.heartbeatTs;

    if (heartbeatGap > INVARIANTS.HEARTBEAT_MAX_GAP_MS) {
        const signal: TelemetrySignal = {
            name: "processor.heartbeat_gap",
            value: heartbeatGap,
            timestamp: telemetry.now,
        };

        violations.push({
            invariantId: "HEARTBEAT_TIMEOUT",
            signal,
            expected: `< ${INVARIANTS.HEARTBEAT_MAX_GAP_MS}ms`,
            actual: heartbeatGap,
            timestamp: telemetry.now,
        });
    }

    /* -------- Latency Invariant -------- */

    if (telemetry.latencyMs > INVARIANTS.MAX_ALLOWED_LATENCY_MS) {
        const signal: TelemetrySignal = {
            name: "processor.latency",
            value: telemetry.latencyMs,
            timestamp: telemetry.now,
        };

        violations.push({
            invariantId: "LATENCY_VIOLATION",
            signal,
            expected: `< ${INVARIANTS.MAX_ALLOWED_LATENCY_MS}ms`,
            actual: telemetry.latencyMs,
            timestamp: telemetry.now,
        });
    }

    return violations;
}
