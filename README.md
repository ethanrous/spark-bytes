# Spark!Bytes

## Sprint 6 Progress and Catchup Plan

Setup for event creation.

We have set up allowing users to create accounts and the front end and database are set up for event creation. We don't yet have a backend to add events, however. To catch up, we will incorporate creating this backend into our next sprint where we will take care of all the event-related backend events (adding, viewing, and reserving). 

To test:
- In the project root directory, run `docker compose down --volumes`, then run `docker compose up` to start the database.
- In the `api` directory, run `go run .` to start the backend on localhost port 5001 ([Go](https://go.dev/doc/install) must be installed).
- In the `client` directory, run `npm install`, then run `npm run dev` to start the frontend. This is accessible on localhost port 3000.
- Currently the only registered user has email `bown@bu.edu` and password `abcdefg`, but you can sign up new users as well.