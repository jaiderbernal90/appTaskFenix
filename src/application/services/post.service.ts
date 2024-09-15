import { Injectable, NotFoundException } from '@nestjs/common';
import { PageOptionsDto } from '../dto/page-options.dto';
import { PageDto } from '../dto/page.dto';
import { PageMetaDto } from '../dto/page-meta.dto';
import { IResponse } from '../interfaces/IResponse.interface';
import PostRepository from 'src/infrastructure/database/repositories/post.repository';
import { IPostService } from '../interfaces/services/IPostService.interface';
import { ListPostDto } from '../dto/post/list-post.dto';
import { UpdatePostDto } from '../dto/post/update-post.dto';
import { CreatePostDto, LikesDto, UpdateLikePostDto } from '../dto/post/create-post.dto';
import { Post } from 'src/domain/entities/post.entity';

@Injectable()
export class PostService implements IPostService {

    constructor(private readonly repository: PostRepository) { }

    async findAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<ListPostDto>> {
        const queryBuilder = await this.repository.findAll(pageOptionsDto);

        const itemCount = await queryBuilder.getCount();
        const { entities } = await queryBuilder.getRawAndEntities();

        const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

        return new PageDto(entities, pageMetaDto);
    }

    async findOne(id: number): Promise<ListPostDto> {
        const data = await this.repository.findOne(id);
        if (!data) throw new NotFoundException('No existe el post con el id ' + id);
        return data;
    }

    async updateLikes(body: UpdateLikePostDto): Promise<LikesDto> {
        const { id, increment } = body;
        const post = await this.findPostById(id);

        if (!post.likes && !increment) return { likes: 0 };

        this.updatePostLikes(post, increment);
        await this.repository.addOrRemoveLikeByPost(post);

        return { likes: post.likes };
    }

    private updatePostLikes(post: Post, increment: boolean): void {
        post.likes = increment ? post.likes + 1 : post.likes - 1;
    }


    private async findPostById(id: number): Promise<Post> {
        const post = await this.repository.findOne(id);
        if (!post) {
            throw new NotFoundException('Post not found');
        }
        return post;
    }
    
    async update(id: number, body: UpdatePostDto): Promise<IResponse<ListPostDto>> {   
        const data = await this.repository.findOne(id);
        
        if (!data) throw new NotFoundException({message: 'No existe el post solicitado'});
        
        await this.repository.update(id, body);
        
        return { message: 'Post actualizado exitosamente', data: await this.repository.findOne(id) }; 
    }

    async create(body: CreatePostDto): Promise<IResponse<ListPostDto>> {
        const data = await this.repository.create(body);    
        return { message: 'Post registrado exitosamente', data: data };
    }

    async remove(id: number): Promise<IResponse<ListPostDto>> {
        const data = await this.repository.findOne(id);
        if (!data) throw new NotFoundException({ message: 'No existe el post solicitado' });
        await this.repository.delete(id);
        return { message: 'Post eliminado exitosamente', data: data };
    }
}
