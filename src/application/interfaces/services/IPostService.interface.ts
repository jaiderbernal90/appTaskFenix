import { IResponse } from "../IResponse.interface";
import { ListPostDto } from "src/application/dto/post/list-post.dto";
import { ICrudService } from "./ICrudService.interface";
import { UpdatePostDto } from "src/application/dto/post/update-post.dto";
import { CreatePostDto, LikesDto, UpdateLikePostDto } from "src/application/dto/post/create-post.dto";

export const POST_SERVICE_TOKEN = 'POST_SERVICE_TOKEN';

export interface IPostService extends ICrudService<ListPostDto>  {
    update(id: number, body:UpdatePostDto): Promise<IResponse<ListPostDto>>;
    create(body: CreatePostDto): Promise<IResponse<ListPostDto>> ;
    updateLikes(body: UpdateLikePostDto): Promise<LikesDto>;
}