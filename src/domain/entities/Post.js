export class Post {
  constructor({ id, title, content, author, createdAt }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.author = author;
    this.createdAt = createdAt || new Date();
  }

  static create({ title, content, author }) {
    if (!title || title.trim().length === 0) {
      throw new Error('Title is required');
    }
    if (!content || content.trim().length === 0) {
      throw new Error('Content is required');
    }
    if (!author || author.trim().length === 0) {
      throw new Error('Author is required');
    }

    return new Post({
      title: title.trim(),
      content: content.trim(),
      author: author.trim()
    });
  }
}
