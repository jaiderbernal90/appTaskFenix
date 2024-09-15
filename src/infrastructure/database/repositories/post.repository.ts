import { InjectRepository } from "@nestjs/typeorm";
import { PageOptionsDto } from "src/application/dto/page-options.dto";
import { CreatePostDto } from "src/application/dto/post/create-post.dto";
import { ListPostDto } from "src/application/dto/post/list-post.dto";
import { UpdatePostDto } from "src/application/dto/post/update-post.dto";
import { Post } from "src/domain/entities/Post.entity";
import { IPostRepository } from "src/domain/repositories/IPost.repository";
import { Repository, SelectQueryBuilder, UpdateResult } from "typeorm";

export default class PostRepository implements IPostRepository {

    constructor(@InjectRepository(Post) private postRepository: Repository<Post>) { }

    async findAll(pageOptionsDto: PageOptionsDto): Promise<SelectQueryBuilder<Post>> {
        return this.postRepository.createQueryBuilder("post")
            .leftJoinAndSelect('post.user', 'user')
            .orderBy("post.created", (pageOptionsDto.order || "DESC"))
            .skip(pageOptionsDto.skip)
            .take(pageOptionsDto.take);
    }

    async findOne(id: number): Promise<Post> {
        return await this.postRepository.createQueryBuilder("post")
            .leftJoinAndSelect('post.user', 'user')
            .where("post.id= :id", { id: id })
            .getOne();
    }

    async delete(id: number): Promise<UpdateResult> {
        return await this.postRepository.softDelete(id);
    }

    async create(body: CreatePostDto): Promise<Post> {
        return await this.postRepository.save(body);
    }

    async addOrRemoveLikeByPost(post:Post): Promise<Post> {
        return await this.postRepository.save(post);
    }

    async update(id: number, body: UpdatePostDto): Promise<UpdateResult> {
        return await this.postRepository.update(id, body);
    }
}
