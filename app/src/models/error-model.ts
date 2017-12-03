import { Model } from '@loopback/repository';
export class ErrorModel extends Model {
    code: number
    message: string 
}