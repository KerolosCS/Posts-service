export class PostCreatedEvent {
  constructor(post) {
    this.type = 'POST_CREATED';
    this.payload = {
      id: post.id,
      title: post.title,
      content: post.content,
      author: post.author,
      createdAt: post.createdAt
    };
    this.timestamp = new Date().toISOString();
  }
}
