export const findPetsSpec = {
    "description": "Returns all pets from the system that the user has access to",
    "parameters": [
        {
            "name": "tags",
            "in": "query",
            "description": "tags to filter by",
            "required": false,
            "style": "form",
            "schema": {
                "type": "array",
                "items": {
                    "type": "string"
                }
            }
        },
        {
            "name": "limit",
            "in": "query",
            "description": "maximum number of results to return",
            "required": false,
            "schema": {
                "type": "integer",
                "format": "int32"
            }
        }
    ],
    "responses": {
        "200": {
            "description": "pet response",
            "content": {
                "application/json": {
                    "schema": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/Pet"
                        }
                    }
                },
                "application/xml": {
                    "schema": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/Pet"
                        }
                    }
                },
                "text/xml": {
                    "schema": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/Pet"
                        }
                    }
                },
                "text/html": {
                    "schema": {
                        "type": "array",
                        "items": {
                            "$ref": "#/components/schemas/Pet"
                        }
                    }
                }
            }
        },
        "default": {
            "$ref": "#/components/responses/default"
        }
    }
}