import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comments'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { InMemoryStudentsRepository } from './in-memory-students-repository'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentRepository
{
  public items: QuestionComment[] = []

  constructor(private studentsRepository: InMemoryStudentsRepository) {}

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = this.items.find((q) => q.id.toString() === id)

    if (!questionComment) {
      return null
    }

    return questionComment
  }

  async findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<QuestionComment[]> {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((params.page - 1) * 20, params.page * 20)

    return questionComments
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    params: PaginationParams,
  ) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
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

    return questionComments
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const itemIndex = this.items.findIndex((q) => q.id === questionComment.id)

    this.items.splice(itemIndex, 1)
  }
}
