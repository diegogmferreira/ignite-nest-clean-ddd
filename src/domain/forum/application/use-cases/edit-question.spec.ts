import { UniqueEntityID } from '@/core/entities/unique-entity'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { expect, it } from 'vitest'
import { EditQuestionUseCase } from './edit-question'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe('Edit question by Id', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
    )

    sut = new EditQuestionUseCase(
      inMemoryQuestionRepository,
      inMemoryQuestionAttachmentRepository,
    )
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionRepository.create(newQuestion)

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
      questionId: newQuestion.id.toString(),
      authorId: 'author-1',
      content: 'Conteúdo editado',
      title: 'Título editado',
      attachmentsIds: ['attachment-1', 'attachment-3'],
    })

    expect(inMemoryQuestionRepository.items[0]).toMatchObject({
      content: 'Conteúdo editado',
      title: 'Título editado',
    })

    expect(
      inMemoryQuestionRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(
      inMemoryQuestionRepository.items[0].attachments.currentItems,
    ).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-3'),
      }),
    ])
  })

  it('should not be able to edit a question if the author is different', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionRepository.create(newQuestion)

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: 'author-2',
      content: 'Conteúdo editado',
      title: 'Título editado',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should be sync new and removed attachments when editing a question', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    )

    await inMemoryQuestionRepository.create(newQuestion)

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

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: 'author-1',
      content: 'Conteúdo editado',
      title: 'Título editado',
      attachmentsIds: ['attachment-1', 'attachment-3'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionAttachmentRepository.items).toHaveLength(2)
    expect(inMemoryQuestionAttachmentRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('attachment-1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('attachment-3'),
        }),
      ]),
    )
  })
})
