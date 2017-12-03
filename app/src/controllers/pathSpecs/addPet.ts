export const addPetSpec = 
{
    "description": "Creates a new pet in the store.  Duplicates are allowed",
    "responses": {
        "200": {
            "description": "pet response",
            "content": {
                "application/json": {
                    "schema": {
                        "$ref": "#/components/schemas/Pet"
                    }
                }
            }
        },
        "default": {
            "$ref": "#/components/responses/default"
        }
    },
    "requestBody": {
        "content": {
            "application/json": {
                "schema": {
                    "$ref": "#/components/schemas/NewPet"
                }
            }
        },
        "description": "Pet to add to the store",
        "required": true
    }
}
