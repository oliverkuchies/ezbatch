import { beforeEach, describe, expect, it, vi } from "vitest";
import { createDefaultJobs } from "../test/factory/job.factory";
import type { BatchProcessor } from "./interfaces";
import { DEFAULT_BATCH_INTERVAL, MicroBatcher } from "./micro-batcher";

type MyJobItem = {
	hello: string;
	world: number;
};

const mockFn = vi.fn((items: MyJobItem[]) => {
	console.log("Successfully executed!", items);
});

class MyBatchProcessor implements BatchProcessor<MyJobItem> {
	async execute(jobs: MyJobItem[]) {
		mockFn(jobs);
		return;
	}
}

const batchProcessorInstance = new MyBatchProcessor();
const microBatcher = new MicroBatcher(batchProcessorInstance);

describe("Microbatcher should execute concrete methods as expected", () => {
	beforeEach(() => {
		microBatcher.flushQueue();
	});

	it("createTimer should create a timer with the users given interval upon instantiation", async () => {
		const jobs = createDefaultJobs(microBatcher);

		expect(mockFn).not.toHaveBeenCalled();

		await new Promise<void>((resolve) =>
			setTimeout(resolve, DEFAULT_BATCH_INTERVAL),
		);

		expect(mockFn).toHaveBeenCalledOnce();
		expect(mockFn).toHaveBeenCalledWith(jobs);
	}, 5000);
});
