export class CreatePostDTO {
  constructor({ title, content, author }) {
    this.title = title;
    this.content = content;
    this.author = author;
  }

  static fromRequest(body = {}) {
    return new CreatePostDTO(body);
  }

  validate() {
    if (!this.title || this.title.trim().length === 0) {
      throw new Error('Title is required');
    }
    if (!this.content || this.content.trim().length === 0) {
      throw new Error('Content is required');
    }
    if (!this.author || this.author.trim().length === 0) {
      throw new Error('Author is required');
    }
    return true;
  }
}
