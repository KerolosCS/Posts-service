import { Post } from '../../domain/entities/Post.js';
import { PostCreatedEvent } from '../../domain/events/PostCreatedEvent.js';

export class CreatePostUseCase {
  constructor(postRepository, eventPublisher) {
    this.postRepository = postRepository;
    this.eventPublisher = eventPublisher;
  }

  async execute(dto) {
    const post = Post.create({ title: dto.title, content: dto.content, author: dto.author });
    const savedPost = await this.postRepository.create(post);
    
    const event = new PostCreatedEvent(savedPost);
    await this.eventPublisher.publish(event);
    
    return savedPost;
  }
}
