# ezbatch - Micro Batcher

[![npm version](https://img.shields.io/npm/v/ezbatch.svg)](https://www.npmjs.com/package/ezbatch)
[![license](https://img.shields.io/npm/l/ezbatch.svg)](https://github.com/oliverkuchies/ezbatch/blob/main/LICENSE)
[![build](https://img.shields.io/github/actions/workflow/status/oliverkuchies/ezbatch/ci.yml?branch=main)](https://github.com/oliverkuchies/ezbatch/actions)

A lightweight TypeScript library for batching jobs and processing them at configurable intervals. Designed for use cases where you want to collect jobs and process them in groups, improving efficiency and throughput.

## Features
- Generic batching for any job type
- Configurable batch size and interval
- Pluggable batch processor interface
- Minimal, clean API

## Installation

```
npm install ezbatch
```

## Usage

### 1. Implement the BatchProcessor Interface

Create a class or object that implements the `BatchProcessor<T>` interface:

```typescript
import { BatchProcessor } from './src/interfaces/batch-processor';

class MyBatchProcessor implements BatchProcessor<string> {
    async execute(batch: string[]): Promise<void> {
        // Process the batch
        console.log('Processing batch:', batch);
    }
}
```

### 2. Create a MicroBatcher Instance

```typescript
import { MicroBatcher } from './src/micro-batcher';

const processor = new MyBatchProcessor();
const batcher = new MicroBatcher<string>(processor, 1000, 5); // 1s interval, 5 jobs per batch
```

### 3. Add Jobs

```typescript
batcher.addJob('job1');
batcher.addJob('job2');
// ...
```

Jobs will be processed in batches of 5, every 1 second.

### 4. Monitor Queue Size (Optional)

```typescript
console.log(batcher.getQueueSize());
```

## API

### MicroBatcher<T>
- `constructor(batchProcessor: BatchProcessor<T>, batchInterval?: number, jobQuantity?: number)`
    - `batchProcessor`: Your implementation of the batch processor
    - `batchInterval`: Time in milliseconds between batch processing (default: 500)
    - `jobQuantity`: Number of jobs per batch (default: 10)
- `addJob(job: T)`: Add a job to the queue

### BatchProcessor<T>
- `execute(batch: T[]): Promise<void>`: Called with each batch of jobs

## Example

```typescript
class NumberBatchProcessor implements BatchProcessor<number> {
    async execute(batch: number[]): Promise<void> {
        console.log('Batch:', batch);
    }
}

const batcher = new MicroBatcher<number>(new NumberBatchProcessor(), 2000, 3);
batcher.addJob(1);
batcher.addJob(2);
batcher.addJob(3);
// After 2 seconds, [1,2,3] will be processed
```

## License
MIT
