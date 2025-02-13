import type { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/questions-comments'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentRepository
{
  public items: QuestionComment[] = []

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

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const itemIndex = this.items.findIndex((q) => q.id === questionComment.id)

    this.items.splice(itemIndex, 1)
  }
}
