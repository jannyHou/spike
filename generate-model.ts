import * as fs from 'fs';
import {OasLibraryUtils, Oas20Document, OasValidationError} from 'oai-ts-core';

fs.readFile('./pet3.json','utf8', (err, swagger3) => {
    if (err) throw err;
    // important! read it as string, parse it into json
    let jsonSwagger3 = JSON.parse(swagger3);

    // Get the OpenAPI document from somewhere (can be a string or js object).
    let openApiData: any = jsonSwagger3;
    // Create an instance of the library utils class.

    let library:OasLibraryUtils = new OasLibraryUtils();

    // Use the library utils to create a data model instance from the given
    // data.  This will convert from the source (string or js object) into
    // an instance of the OpenAPI data model.
    let document: Oas20Document = <Oas20Document> library.createDocument(openApiData);

    console.log(document);
    // Here you can anayze or manipulate the model.
    document.info.version = "1.1";
    document.info.description = "Made some changes to the OpenAPI document!";

    // Validate that your changes are OK.
    let errors: OasValidationError[] = library.validate(document);

    // And now write the node back out as a JSON string
    let modifiedOpenApiData: string = JSON.stringify(library.writeNode(document));
});
