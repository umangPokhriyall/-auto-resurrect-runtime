// apps/simulator/src/modules/processor.ts

import type { SensorOutput } from "./sensor";
import { FaultInjector } from "../faults";

export interface ProcessedData {
    processedValue: number;
    latencyMs: number;
}

export class Processor {
    private lastHeartbeat: number = Date.now();
    private safeMode: boolean = false;

    process(input: SensorOutput): ProcessedData {
        const start = Date.now();

        // FAULT: CPU STALL
        if (FaultInjector.hasFault("PROCESSOR_STALL")) {
            const stallUntil = Date.now() + 3000;
            while (Date.now() < stallUntil) { }
        }

        // FAULT: LATENCY SPIKE
        if (FaultInjector.hasFault("LATENCY_SPIKE")) {
            const delayUntil = Date.now() + 1000;
            while (Date.now() < delayUntil) { }
        }

        this.lastHeartbeat = Date.now();

        const processedValue = this.safeMode
            ? input.value // degraded logic
            : input.value * 2;

        const end = Date.now();

        return {
            processedValue,
            latencyMs: end - start,
        };
    }

    heartbeat(): number {
        return this.lastHeartbeat;
    }

    reset(): void {
        console.log("[PROCESSOR] Resetting state");
        this.safeMode = false;
        this.lastHeartbeat = Date.now();
    }

    enableSafeMode(): void {
        console.log("[PROCESSOR] Entering safe mode");
        this.safeMode = true;
    }
}
