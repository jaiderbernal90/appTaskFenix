import { PageOptionsDto } from "src/application/dto/page-options.dto";
import { PageDto } from "src/application/dto/page.dto";
import { IResponse } from "../IResponse.interface";

export interface ICrudService<T> {
    findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<T>>;
    findOne(id: number): Promise<T>;
    remove(id: number): Promise<IResponse<T>>;
}