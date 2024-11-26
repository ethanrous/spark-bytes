# Spark!Bytes

## Sprint 7 Progress and Test Plan

Users can now log in, sign up, view, and create events. For testing, we will conduct unit testing for each of our modules and integration testing will be conducted by running through our primary user stories in various scenarios. As a catchup for next sprint, we will also implement the email notifications for users signed up for an event.

To test:
- In the project root directory, run `docker compose down --volumes`, then run `docker compose up` to start the database.
- In the `api` directory, run `go run .` to start the backend on localhost port 5001 ([Go](https://go.dev/doc/install) must be installed).
- In the `client` directory, run `npm install`, then run `npm run dev` to start the frontend. This is accessible on localhost port 3000.
- The only default registered user has email `bown@bu.edu` and password `abcdefg`, but you can sign up new users as well.