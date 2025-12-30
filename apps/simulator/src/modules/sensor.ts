// sensor.ts

import { FaultInjector } from "../faults";

export interface SensorOutput {
    value: number;
    timestamp: number;
}

export class Sensor {
    private lastHeartbeat: number = Date.now();

    read(): SensorOutput | null {
        // FAULT: silent failure (sensor stops responding)
        if (FaultInjector.hasFault("SILENT_SENSOR_FAILURE")) {
            return null;
        }

        this.lastHeartbeat = Date.now();

        return {
            value: Math.random() * 100,
            timestamp: Date.now(),
        };
    }

    heartbeat(): number {
        return this.lastHeartbeat;
    }
}
