import { Either, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity'
import { Injectable } from '@nestjs/common'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { Question } from '../../enterprise/entities/questions'
import { QuestionRepository } from '../repositories/questions-repository'

interface CreateQuestionUseCaseRequest {
  authorId: string
  title: string
  content: string
  attachmentsIds: string[]
}

type CreateQuestionUseCaseResponse = Either<
  null,
  {
    question: Question
  }
>

@Injectable()
export class CreateQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute({
    authorId,
    title,
    content,
    attachmentsIds,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({
      authorId: new UniqueEntityID(authorId),
      title,
      content,
    })

    const questionAttachments = attachmentsIds.map((attachmentsId) => {
      return QuestionAttachment.create({
        questionId: question.id,
        attachmentId: new UniqueEntityID(attachmentsId),
      })
    })

    question.attachments = new QuestionAttachmentList(questionAttachments)

    await this.questionRepository.create(question)

    return right({ question })
  }
}
