# DOWN-TOP


## Define Openapi3 types

Module 'openapi3-ts' exports a bunch of interfaces mapping to openapi3 specs:
https://github.com/metadevpro/openapi3-ts/blob/master/src/model/OpenApi.ts

# TOP-DOWN

## Parse a swagger2/3 file into spec models

A very helpful module: https://github.com/Apicurio/oai-ts-core.

Models for spec: https://github.com/Apicurio/oai-ts-core/tree/master/src/models
Read the swagger file, build specs as instance of spec models.

*Could not use it out of box, solve the build failure OR build our own one*

## Build template 

Yeoman uses https://github.com/SBoudrias/mem-fs-editor to build template.

Implementation details:

- How to build a function(multiple parameters, sync/async, multiple returns)
- How to add Class property
- How to add multiple decorators to one property

## Artifacts mapping

