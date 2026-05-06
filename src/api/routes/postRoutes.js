import { Router } from 'express';
import { PostController } from '../controllers/PostController.js';

export function createPostRoutes(postRepository, eventPublisher) {
  const router = Router();
  const controller = new PostController(postRepository, eventPublisher);

  router.post('/', controller.createPost);
  router.get('/', controller.listPosts);
  router.get('/:id', controller.getPost);

  return router;
}
