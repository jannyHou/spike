export interface apiSpec {
  // a fake apiSpec type since we haven't unified openapi 2 and 3
}

export async function getAPISpecPerServer(name: string) {
  // a fake apiSpec generator
}

export async function getAPISpecs() {
    let result:any = {};

    result.serverFoo = await getAPISpecPerServer('serverFoo');
    result.serverBar = await getAPISpecPerServer('serverBar');

    return result;
}