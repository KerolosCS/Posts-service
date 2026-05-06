export class PostResponseDTO {
  static fromEntity(post) {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.author,
      createdAt: post.createdAt
    };
  }

  static fromEntities(posts) {
    return posts.map(post => PostResponseDTO.fromEntity(post));
  }
}
