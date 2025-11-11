import type { BatchProcessor } from "./interfaces/batch-processor";

export const DEFAULT_BATCH_INTERVAL = 500;
export const DEFAULT_JOB_QUANTITY = 10;

export class MicroBatcher<T> {
	private queue: T[] = [];
	private timer: number | null = null;

	constructor(
		/**
		 * @description - A batch processor utilising the BatchProcessor interface, used to execute batch functions
		 */
		private batchProcessor: BatchProcessor<T>,
		/**
		 * @description The amount of time required before a batch is processed, i.e. batch is processed every x ms
		 */
		private batchInterval = DEFAULT_BATCH_INTERVAL,
		/**
		 * @description The amount of jobs that are added to one batch
		 */
		private jobQuantity = DEFAULT_JOB_QUANTITY,
	) {
		this.createTimer();
	}

	/**
	 * Push the job to queue
	 */
	createJob(job: T) {
		this.queue.push(job);
	}

	/**
	 * Create a timer that will execute at batchInterval seconds
	 */
	private createTimer() {
		if (this.timer) {
			clearTimeout(this.timer);
		}

		this.timer = setTimeout(async () => {
			await this.runBatch();
			this.createTimer();
		}, this.batchInterval);
	}

	/**
	 * Utilise the batchProcessor to create a batch of jobQuantity numbers
	 */
	private async runBatch() {
		let jobsProcessed = 0;
		const currentBatch: T[] = [];

		while (this.queue.length && jobsProcessed < this.jobQuantity) {
			const currentItem = this.queue.shift();

			currentBatch.push(currentItem);
			jobsProcessed += 1;
		}

		await this.batchProcessor.execute(currentBatch);
	}

	/**
	 * Flush the queue to remove any outstanding items
	 */
	async flushQueue() {
		this.queue = [];
	}
}
