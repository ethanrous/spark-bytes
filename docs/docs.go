// Package docs Code generated by swaggo/swag. DO NOT EDIT
package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "contact": {},
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/events": {
            "get": {
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Events"
                ],
                "summary": "Get All Events",
                "operationId": "GetEvents",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/EventInfo"
                            }
                        }
                    },
                    "401": {
                        "description": "Unauthorized"
                    }
                }
            },
            "post": {
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Events"
                ],
                "summary": "Create a New Event",
                "operationId": "CreateEvent",
                "parameters": [
                    {
                        "description": "Event params",
                        "name": "eventParams",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/NewEventParams"
                        }
                    }
                ],
                "responses": {
                    "201": {
                        "description": "Created"
                    },
                    "400": {
                        "description": "Bad Request"
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            }
        },
        "/events/owner": {
            "get": {
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Events"
                ],
                "summary": "Get Events By Owner",
                "operationId": "GetEventsByOwner",
                "parameters": [
                    {
                        "type": "string",
                        "description": "ID of Event Owner",
                        "name": "owner_id",
                        "in": "query"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/EventInfo"
                            }
                        }
                    },
                    "400": {
                        "description": "Bad Request"
                    },
                    "401": {
                        "description": "Unauthorized"
                    }
                }
            }
        },
        "/events/{id}": {
            "get": {
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Events"
                ],
                "summary": "Get an Event",
                "operationId": "GetEvent",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "ID of Event",
                        "name": "id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/EventInfo"
                        }
                    },
                    "401": {
                        "description": "Unauthorized"
                    }
                }
            },
            "put": {
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Events"
                ],
                "summary": "Modify an Existing Event",
                "operationId": "ModifyEvent",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "Event ID",
                        "name": "id",
                        "in": "path",
                        "required": true
                    },
                    {
                        "description": "Updated event details",
                        "name": "event",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/NewEventParams"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Event modified successfully"
                    },
                    "400": {
                        "description": "Invalid Event ID or Bad request"
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "403": {
                        "description": "Forbidden - Not the event owner"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            }
        },
        "/events/{id}/reservations": {
            "get": {
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Events"
                ],
                "summary": "Fetch the list of users who are reserved for an event",
                "operationId": "GetEventReservations",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "Event ID",
                        "name": "id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "201": {
                        "description": "Created",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/UserInfo"
                            }
                        }
                    },
                    "400": {
                        "description": "Invalid Event ID"
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            },
            "post": {
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Events"
                ],
                "summary": "Reserve a Spot in an Event",
                "operationId": "ReserveEvent",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "Event ID",
                        "name": "id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "201": {
                        "description": "Reservation created successfully",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "400": {
                        "description": "Invalid Event ID"
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "409": {
                        "description": "You already have a reservation for this event"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            },
            "delete": {
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Events"
                ],
                "summary": "Remove the Authenticated User's Reservation",
                "operationId": "RemoveReservationFromUser",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "Event ID",
                        "name": "id",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Reservation cleared successfully",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "400": {
                        "description": "Invalid Event ID"
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            },
            "patch": {
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Events"
                ],
                "summary": "Remove a Reservation by Code",
                "operationId": "RemoveReservationFromCode",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "Event ID",
                        "name": "id",
                        "in": "path",
                        "required": true
                    },
                    {
                        "type": "string",
                        "description": "Reservation code",
                        "name": "code",
                        "in": "query",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Reservation cleared successfully",
                        "schema": {
                            "type": "object",
                            "additionalProperties": {
                                "type": "string"
                            }
                        }
                    },
                    "400": {
                        "description": "Invalid request or missing code"
                    },
                    "401": {
                        "description": "Unauthorized"
                    },
                    "403": {
                        "description": "Forbidden - Not the event owner"
                    },
                    "404": {
                        "description": "Reservation not found"
                    },
                    "500": {
                        "description": "Internal Server Error"
                    }
                }
            }
        },
        "/users": {
            "get": {
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Users"
                ],
                "summary": "Get User",
                "operationId": "GetUser",
                "parameters": [
                    {
                        "type": "string",
                        "description": "User email",
                        "name": "email",
                        "in": "query",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/UserInfo"
                        }
                    },
                    "401": {
                        "description": "Unauthorized"
                    }
                }
            },
            "post": {
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Users"
                ],
                "summary": "Create User",
                "operationId": "CreateUser",
                "parameters": [
                    {
                        "description": "New user params",
                        "name": "newUserParams",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/NewUserParams"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    },
                    "401": {
                        "description": "Unauthorized"
                    }
                }
            }
        },
        "/users/login": {
            "post": {
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Users"
                ],
                "summary": "Login User",
                "operationId": "LoginUser",
                "parameters": [
                    {
                        "description": "Login params",
                        "name": "loginParams",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/LoginParams"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/UserInfo"
                        }
                    },
                    "401": {
                        "description": "Unauthorized"
                    }
                }
            }
        },
        "/users/logout": {
            "post": {
                "tags": [
                    "Users"
                ],
                "summary": "Logout User",
                "operationId": "LogoutUser",
                "responses": {
                    "200": {
                        "description": "OK"
                    }
                }
            }
        },
        "/users/me": {
            "get": {
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Users"
                ],
                "summary": "Get Logged in user",
                "operationId": "GetLoggedInUser",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/UserInfo"
                        }
                    },
                    "401": {
                        "description": "Unauthorized"
                    }
                }
            }
        },
        "/users/{userId}/verify": {
            "post": {
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "Users"
                ],
                "summary": "Verify a user",
                "operationId": "VerifyUser",
                "parameters": [
                    {
                        "type": "string",
                        "description": "UserId to verify",
                        "name": "userId",
                        "in": "path",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    },
                    "404": {
                        "description": "Not Found"
                    }
                }
            }
        }
    },
    "definitions": {
        "EventInfo": {
            "type": "object",
            "required": [
                "capacity",
                "description",
                "dietaryInfo",
                "endTime",
                "eventId",
                "location",
                "name",
                "owner",
                "registeredCount",
                "reservationIds",
                "startTime"
            ],
            "properties": {
                "capacity": {
                    "type": "integer"
                },
                "description": {
                    "type": "string"
                },
                "dietaryInfo": {
                    "type": "string"
                },
                "endTime": {
                    "type": "integer"
                },
                "eventId": {
                    "type": "integer"
                },
                "location": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "owner": {
                    "type": "integer"
                },
                "registeredCount": {
                    "type": "integer"
                },
                "reservationIds": {
                    "type": "array",
                    "items": {
                        "type": "integer"
                    }
                },
                "startTime": {
                    "type": "integer"
                }
            }
        },
        "LoginParams": {
            "type": "object",
            "required": [
                "email",
                "password"
            ],
            "properties": {
                "email": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                }
            }
        },
        "NewEventParams": {
            "type": "object",
            "properties": {
                "capacity": {
                    "type": "integer"
                },
                "description": {
                    "type": "string"
                },
                "dietary_info": {
                    "type": "string"
                },
                "end_time": {
                    "type": "integer"
                },
                "location": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                },
                "owner_id": {
                    "type": "integer"
                },
                "start_time": {
                    "type": "integer"
                }
            }
        },
        "NewUserParams": {
            "type": "object",
            "properties": {
                "email": {
                    "type": "string"
                },
                "first_name": {
                    "type": "string"
                },
                "last_name": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                }
            }
        },
        "UserInfo": {
            "type": "object",
            "properties": {
                "email": {
                    "type": "string"
                },
                "firstName": {
                    "type": "string"
                },
                "id": {
                    "type": "integer"
                },
                "joinedAt": {
                    "type": "string"
                },
                "lastName": {
                    "type": "string"
                },
                "verified": {
                    "type": "boolean"
                }
            }
        }
    },
    "securityDefinitions": {
        "SessionAuth": {
            "type": "apiKey",
            "name": "spark-bytes-session",
            "in": "cookie"
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "1.0",
	Host:             "localhost:5001",
	BasePath:         "/api/",
	Schemes:          []string{"http", "https"},
	Title:            "SparkBytes API",
	Description:      "Access to the SparkBytes server",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
	LeftDelim:        "{{",
	RightDelim:       "}}",
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
