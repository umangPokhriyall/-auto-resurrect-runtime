// apps/simulator/src/system.ts

import { Sensor } from "./modules/sensor";
import { Processor } from "./modules/processor";
import { Transmitter } from "./modules/transmitter";

import { checkInvariants } from "runtime-core/invariants";
import { detectFaults } from "runtime-core/detectors";
import { matchSignature } from "runtime-core/signatures";
import { decide } from "runtime-core/decision-engine";
import { executeDecision } from "runtime-core/executor";
import { FaultInjector } from "./faults";


export class EmbeddedSystem {
    private sensor = new Sensor();
    private processor = new Processor();
    private transmitter = new Transmitter();

    start(): void {
        console.log("[SYSTEM] Starting embedded pipeline...");

        setInterval(() => {
            const now = Date.now();

            const sensorData = this.sensor.read();

            if (!sensorData) {
                console.log("[SYSTEM] Sensor data missing");
                return;
            }

            const processed = this.processor.process(sensorData);
            this.transmitter.transmit(processed);

            // ---- TELEMETRY SNAPSHOT ----
            const telemetry = {
                now,
                heartbeatTs: this.processor.heartbeat(),
                latencyMs: processed.latencyMs,
            };

            // ---- RUNTIME PIPELINE ----
            const violations = checkInvariants(telemetry);

            if (violations.length > 0) {
                console.log("[VIOLATION]", violations.map(v => v.invariantId));
            }

            const faults = detectFaults(violations, now);

            if (faults.length > 0) {
                const signature = matchSignature(faults);
                console.log(`[SIGNATURE] ${signature}`);

                const decision = decide(signature);
                executeDecision(decision, this);
            }
        }, 1000);
    }

    // ---- RECOVERY HOOKS ----
    restartModule(name: string) {
        if (name === "processor") {
            FaultInjector.clearFault("PROCESSOR_STALL");
            this.processor.reset();
            console.log("[RECOVERED] Processor healthy");
        }
    }



    degradeModule(name: string) {
        if (name === "processor") {
            this.processor.enableSafeMode();
        }
    }
}
