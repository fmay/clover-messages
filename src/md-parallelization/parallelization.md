<!-- Common : tweak and repeat -->

# Parallelization
## Running transformations in parallel

Clover can run multiple processes at once in parallel. This can help enormously with performance.

Some high-latency operations can delay per-record processing times. Parallelizing the processing of the individual records can make a huge difference, especially in cloud environments such as Redshift, S3 etc.

