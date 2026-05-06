import { CreatePostUseCase } from '../../application/useCases/CreatePost.js';
import { GetPostUseCase } from '../../application/useCases/GetPost.js';
import { ListPostsUseCase } from '../../application/useCases/ListPosts.js';
import { CreatePostDTO } from '../../application/dtos/CreatePostDTO.js';
import { PostResponseDTO } from '../../application/dtos/PostResponseDTO.js';

export class PostController {
  constructor(postRepository, eventPublisher) {
    this.createPostUseCase = new CreatePostUseCase(postRepository, eventPublisher);
    this.getPostUseCase = new GetPostUseCase(postRepository);
    this.listPostsUseCase = new ListPostsUseCase(postRepository);
  }

  createPost = async (req, res, next) => {
    try {
      const dto = CreatePostDTO.fromRequest(req.body);
      dto.validate();
      const post = await this.createPostUseCase.execute(dto);
      res.status(201).json({ success: true, data: PostResponseDTO.fromEntity(post) });
    } catch (error) {
      next(error);
    }
  };

  getPost = async (req, res, next) => {
    try {
      const { id } = req.params;
      const post = await this.getPostUseCase.execute(id);
      res.json({ success: true, data: PostResponseDTO.fromEntity(post) });
    } catch (error) {
      next(error);
    }
  };

  listPosts = async (req, res, next) => {
    try {
      const result = await this.listPostsUseCase.execute();
      res.json({ success: true, data: { posts: PostResponseDTO.fromEntities(result.posts) } });
    } catch (error) {
      next(error);
    }
  };
}
