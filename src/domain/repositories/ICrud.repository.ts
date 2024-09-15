import { PageOptionsDto } from "src/application/dto/page-options.dto";
import { SelectQueryBuilder, UpdateResult } from "typeorm";

export interface ICrudRepository<T> {
    findAll(pageOptionsDto: PageOptionsDto):Promise<SelectQueryBuilder<T>>;
    findOne(id: number): Promise<T>;
    delete(id: number): Promise<UpdateResult>;
}