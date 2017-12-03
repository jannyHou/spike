export const newResponse = {
    "201": {
        "description": "created",
         "content": {
            "application/json": {
                "schema": {
                    "$ref": "#/components/schemas/GreetModel"
                }
            }
        }
    }
}