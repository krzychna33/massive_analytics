
## About solution

I absolutely can’t say that it is a complete solution for a given task. It is more a concept.

My main goal in this task was to optimize query response time to minimum.
The goal has been achieved by creating ProductStatistic table which stores current statistics about a given product.

![flip_arch1](docs/flip_arch1.jpg)

Orders Service fetches data from given endpoint. Data is being fetched page by page - app creates a recurrent (recurrent because one job crates another) job in
bullmq and redis (and it pushes data to Redis Storage service which is place where internal queue lives). In general this orders service simulates service where real queries like `POST /order` could be run.


Analytics Service is a place where data is being processed. Here appropriate records in database are being created and updated.
This service also merges duplicated products in order's item array.
Analytics service exposes also three endpoints which was required.
- `GET /order-analytics/top-profitable-products`
- `GET /order-analytics/top-bought-products`
- `GET /top-bought-products-yesterday`

Data for these endpoints comes from ProductsStatistics table. 
Thanks to this table i don't have to query `ProductOrder` table every time when i want to fetch analytics data. Now when i want to get TOP 
bought products i will get this data almost instantly.

However my another idea for solution was to maintain only first three tables (Product, ProductOrder, Order).
In this scenario i would create some indexes on ProductOrder table which will also bring me to almost "Instant response time".
Neverthereles even with these indexes response could take some time if we will have massive amount of data inside `ProductOrder`.
So solution without `Statistic` table was easier but this is more scalable and faster in general.

Orders and Analytics service are connected by Redis. Orders Service plays as a producer and Analytics service is consumer.

Of course there is A LOT OF THINGS TO DO:
I'm aware of:
* lack of testing (unit and integration)
* messy codebase
* lack of logging
* lack of complex documentation

However i believe that so short time (< 2MD) was too short to prepare complete solution.


I have some feedback for data source api:
* Products inside one order shouldnt be duplicated i guess
* there should be validation for query parameters to prevent requests with eg. `_page=-042133490`

### High level data flow overview:

![flip_seq](docs/flip_seq.jpg)

## Services

### OrdersService

- port = `3001`
- debugPort = `9229`

### AnalyticsService

- port = `3002`
- debugPort = `9239`

### RedisBus

- port = `6379`

### RedisQueue

- port = `6389`

## Running

1. Create .env file in both services.
2. Fill them with necessary variables (according to validator)
3. Run

```shell
docker-compose up
```
