import type { InvariantViolation, FaultEvent } from "shared-types/client";

// Minimum occurrences before emitting a fault
const FAULT_THRESHOLD = 2;

// Occurrences beyond this are treated as persistent
const PERSISTENT_THRESHOLD = 3;

// Time window reserved for future use
const FAULT_WINDOW_MS = 5000;

// Active fault correlation state
const activeFaults = new Map<string, FaultEvent>();

export function detectFaults(
    violations: InvariantViolation[],
    now: number
): FaultEvent[] {
    const emitted: FaultEvent[] = [];

    for (const v of violations) {
        const key = `${v.invariantId}:${v.signal.name}`;

        const existing = activeFaults.get(key);

        if (!existing) {
            // First observation of this violation
            activeFaults.set(key, {
                id: key,
                invariantId: v.invariantId,
                source: v.signal.name,
                severity: "MEDIUM",
                firstSeen: now,
                lastSeen: now,
                count: 1,
            });
        } else {
            // Repeated violation
            existing.lastSeen = now;
            existing.count += 1;
            if (existing.count >= FAULT_THRESHOLD) {
                existing.nature =
                    existing.count >= PERSISTENT_THRESHOLD
                        ? "PERSISTENT"
                        : "TRANSIENT";

                emitted.push(existing);
                activeFaults.delete(key);
            }
        }
    }

    return emitted;
}
