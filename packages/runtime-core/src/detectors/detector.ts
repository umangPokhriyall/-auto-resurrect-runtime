// packages/runtime-core/src/detectors/detector.ts

import type { InvariantViolation, FaultEvent } from "shared-types/client";


const FAULT_THRESHOLD = 2;
const FAULT_WINDOW_MS = 5000;


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
            existing.lastSeen = now;
            existing.count += 1;

            if (existing.count >= FAULT_THRESHOLD) {
                emitted.push(existing);
                activeFaults.delete(key);
            }

        }
    }

    return emitted;
}
