export const deleteSpec = {
    "description": "deletes a single pet based on the ID supplied",
    "operationId": "deletePet",
    "parameters": [
        {
            "name": "id",
            "in": "path",
            "description": "ID of pet to delete",
            "required": true,
            "schema": {
                "type": "integer",
                "format": "int64"
            }
        }
    ],
    "responses": {
        "204": {
            "description": "pet deleted"
        },
        "default": {
            "$ref": "#/components/responses/default"
        }
    }
}