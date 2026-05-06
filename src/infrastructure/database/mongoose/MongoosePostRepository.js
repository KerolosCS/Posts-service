import { PostRepository } from '../../../domain/repositories/PostRepository.js';
import { Post } from '../../../domain/entities/Post.js';
import { PostModel } from './models/PostModel.js';

export class MongoosePostRepository extends PostRepository {
  async create(post) {
    const doc = await PostModel.create({
      title: post.title,
      content: post.content,
      author: post.author,
      createdAt: post.createdAt
    });
    return this._toEntity(doc);
  }

  async findById(id) {
    const doc = await PostModel.findById(id).lean();
    return doc ? this._toEntity(doc) : null;
  }

  async findAll() {
    const docs = await PostModel.find()
      .sort({ createdAt: -1 })
      .lean();
    return docs.map(doc => this._toEntity(doc));
  }

  _toEntity(doc) {
    return new Post({
      id: doc._id.toString(),
      title: doc.title,
      content: doc.content,
      author: doc.author,
      createdAt: doc.createdAt
    });
  }
}
