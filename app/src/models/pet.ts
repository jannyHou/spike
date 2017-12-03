import { NewPet } from './new-pet';
import { Model } from '@loopback/repository';
import { allOf, OASConfig, OASConfigType } from '@loopback/OAS';
export class Pet extends Model {
    @allOf('default')
    id: number
    @allOf('default')
    name: string
    @allOf('newPet')
    newPet: NewPet
    @OASConfig
    static OAS_config:OASConfigType = {<some_oas_metadata>}
}