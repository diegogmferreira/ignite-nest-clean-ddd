import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comments'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentRepository
{
  public items: AnswerComment[] = []

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = this.items.find((q) => q.id.toString() === id)

    if (!answerComment) {
      return null
    }

    return answerComment
  }

  async findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]> {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((params.page - 1) * 20, params.page * 20)

    return answerComments
  }

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    params: PaginationParams,
  ) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((params.page - 1) * 20, params.page * 20)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) => {
          return student.id.equals(comment.authorId)
        })

        if (!author) {
          throw new Error(
            `Author not found for comment ${comment.id.toString()}`,
          )
        }

        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          author: author.name,
          authorId: author.id,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
        })
      })

    return answerComments
  }

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const itemIndex = this.items.findIndex((q) => q.id === answerComment.id)

    this.items.splice(itemIndex, 1)
  }
}
