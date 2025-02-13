import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity'
import { Injectable } from '@nestjs/common'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { Answer } from '../../enterprise/entities/answers'
import { AnswersRepository } from '../repositories/answers-repository'

interface AnswerQuestionUseCaseRequest {
  authorId: string
  questionId: string
  content: string
  attachmentsIds: string[]
}

type AnswerQuestionUseCaseResponse = Either<
  null,
  {
    answer: Answer
  }
>

@Injectable()
export class AnswerQuestionUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async execute({
    authorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
    })

    const answerAttachments = attachmentsIds.map((attachmentsId) => {
      return AnswerAttachment.create({
        answerId: answer.id,
        attachmentId: new UniqueEntityID(attachmentsId),
      })
    })

    answer.attachments = new AnswerAttachmentList(answerAttachments)

    await this.answerRepository.create(answer)

    return right({ answer })
  }
}
