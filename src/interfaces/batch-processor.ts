export interface BatchProcessor<T> {
	execute: (batch: T[]) => Promise<void>;
}
