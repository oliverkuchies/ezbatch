import { faker } from "@faker-js/faker";
import { DEFAULT_JOB_QUANTITY, MicroBatcher } from "../../src";

export function createMockJob() {
    return {
        hello: faker.string.alpha(),
        world: faker.number.int()
    };
}

export function createDefaultJobs<T>(microBatcher: MicroBatcher<T>) {
    let jobs = [];

    for (let i = 1; i <= DEFAULT_JOB_QUANTITY; i++) {
        const job = createMockJob() as T;
        microBatcher.createJob(job);
        jobs.push(job);
    }

    return jobs;
}