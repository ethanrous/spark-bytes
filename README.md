# Spark!Bytes

## Sprint 5 Progress

Basic frontend-backend communication set up.

To test:

- In the project root directory, run `docker compose down --volume`, then run `docker compose up` to start the database.
- In the `api` directory, run `go run .` to start the backend on localhost port 5001 ([Go](https://go.dev/doc/install) must be installed).
- In the `client` directory, run `npm install`, then run `npm run dev` to start the frontend. This is accessible on localhost port 3000.
- Navigate to the [login](http://localhost:3000/login) page. Currently the only registered user has email `bown@bu.edu` and password `abcdefg`.