import { Model } from '@loopback/repository';
export class NewPet extends Model {
    name: string
    tag: string
}