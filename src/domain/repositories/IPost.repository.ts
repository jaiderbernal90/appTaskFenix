import { CreatePostDto } from "src/application/dto/post/create-post.dto";
import { ICrudRepository } from "./ICrud.repository";
import { ListPostDto } from "src/application/dto/post/list-post.dto";
import { UpdateResult } from "typeorm";
import { UpdatePostDto } from "src/application/dto/post/update-post.dto";
import { Post } from "../entities/post.entity";

export interface IPostRepository extends ICrudRepository<ListPostDto>{
    create(body: CreatePostDto): Promise<Post>;
    update(id:number, body: UpdatePostDto): Promise<UpdateResult>;
    addOrRemoveLikeByPost(post:Post): Promise<Post>;
 } 