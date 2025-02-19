import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class CommentWithAuthorPresenter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toHttp(CommentWithAuthor: CommentWithAuthor) {
    return {
      commentId: CommentWithAuthor.commentId.toString(),
      authorId: CommentWithAuthor.authorId.toString(),
      authorName: CommentWithAuthor.author,
      content: CommentWithAuthor.content,
      createdAt: CommentWithAuthor.createdAt,
      updatedAt: CommentWithAuthor.updatedAt,
    }
  }
}
