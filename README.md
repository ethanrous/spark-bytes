# Spark Bytes Website

Welcome to the Spark Bytes website repository. This document will guide you through setting up and running the application on your local machine. 

Further documentation for the backend can be found [here](http://localhost:5001/docs/index.html) (server must be running).

## Prerequisites

Before running the application, ensure you have the following software installed:

1. **Docker**
   - Download and install Docker from [here](https://www.docker.com/products/docker-desktop).
   - Ensure Docker is running in the background.

2. **Node.js**
   - Download and install Node.js from [here](https://nodejs.org/).

3. **Next.js**
   - Install Next.js globally by running:
     ```bash
     npm install -g next
     ```

4. **Go**
   - Download and install Go from [here](https://golang.org/dl/).
   - Verify installation by running:
     ```bash
     go version
     ```

5. **Swaggo**
   - Install Swaggo for generating API documentation by running:
     ```bash
     go install github.com/swaggo/swag/cmd/swag@latest
     ```

## Cloning the Repository

Clone the repository to your local machine using the following command:
```bash
git clone <repository_url>
```

Navigate to the project directory:
```bash
cd spark-bytes
```

## Running the Application

To test and run the application, follow these steps:

1. Make the `scripts/run` script executable if it is not already:
   ```bash
   chmod +x scripts/run
   ```

2. Execute the script to start the application:
   ```bash
   ./scripts/run
   ```

### What This Script Does:
- Starts the database using Docker.
- Compiles the frontend using Node.js and Next.js.
- Starts the backend using Go.

> **Note:** The script may prompt for your `sudo` password to start the database.

### Accessing the Application

Once the script has run successfully, navigate to [http://localhost:5001](http://localhost:5001) in your web browser to view the application.

## Troubleshooting

If you encounter any issues:

1. Ensure Docker is running in the background.
2. Verify that the required software (Node.js, Go, Docker, Next.js, and Swaggo) is properly installed and accessible from the command line.
3. Check the logs generated during the execution of the `scripts/run` script for any errors.

For additional assistance, feel free to open an issue in the repository.

