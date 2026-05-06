export class ListPostsUseCase {
  constructor(postRepository) {
    this.postRepository = postRepository;
  }

  async execute() {
    const posts = await this.postRepository.findAll();
    return { posts };
  }
}
