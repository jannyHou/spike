export const findPetByIdSpec = {
    "description": "Returns a user based on a single ID, if the user does not have access to the pet",
    "operationId": "findPetById",
    "parameters": [
        {
            "name": "id",
            "in": "path",
            "description": "ID of pet to fetch",
            "required": true,
            "schema": {
                "type": "integer",
                "format": "int64"
            }
        }
    ],
    "responses": {
        "200": {
            "description": "pet response",
            "content": {
                "application/json": {
                    "schema": {
                        "$ref": "#/components/schemas/Pet"
                    }
                },
                "application/xml": {
                    "schema": {
                        "$ref": "#/components/schemas/Pet"
                    }
                },
                "text/xml": {
                    "schema": {
                        "$ref": "#/components/schemas/Pet"
                    }
                },
                "text/html": {
                    "schema": {
                        "$ref": "#/components/schemas/Pet"
                    }
                }
            }
        },
        "default": {
            "$ref": "#/components/responses/default"
        }
    }
}