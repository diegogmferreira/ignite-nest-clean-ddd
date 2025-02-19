import { left, right, type Either } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found'
import { Injectable } from '@nestjs/common'
import { QuestionComment } from '../../enterprise/entities/question-comments'
import { QuestionCommentRepository } from '../repositories/question-comments-repository'
import { QuestionRepository } from '../repositories/questions-repository'

interface CommentOnQuestionUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

type CommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment
  }
>

@Injectable()
export class CommentOnQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private questionCommentRepository: QuestionCommentRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
    })

    await this.questionCommentRepository.create(questionComment)

    return right({ questionComment })
  }
}
