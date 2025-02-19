import { right, type Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'
import { AnswerCommentRepository } from '../repositories/answer-comments-repository'

interface FetchAnswerCommentsUseCaseRequest {
  page: number
  answerId: string
}

type FetchAnswerCommentsUseCaseResponse = Either<
  null,
  {
    comments: CommentWithAuthor[]
  }
>

@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswerCommentRepository) {}

  async execute({
    page,
    answerId,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const comments =
      await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(
        answerId,
        { page },
      )

    return right({ comments })
  }
}
