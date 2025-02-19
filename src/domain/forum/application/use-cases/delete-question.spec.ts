import { UniqueEntityID } from '@/core/entities/unique-entity'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { expect, it } from 'vitest'
import { DeleteQuestionUseCase } from './delete-question'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question by Id', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
      inMemoryAttachmentsRepository,
      inMemoryStudentsRepository,
    )
    sut = new DeleteQuestionUseCase(inMemoryQuestionRepository)
  })

  it('should be able to delete a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionRepository.items.push(newQuestion)

    inMemoryQuestionAttachmentRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('attachment-1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('attachment-2'),
      }),
    )

    await sut.execute({
      questionId: 'question-1',
      authorId: 'author-1',
    })

    expect(inMemoryQuestionRepository.items).toHaveLength(0)
    expect(inMemoryQuestionAttachmentRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question if the author is different', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionRepository.items.push(newQuestion)

    const result = await sut.execute({
      questionId: 'question-1',
      authorId: 'author-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
