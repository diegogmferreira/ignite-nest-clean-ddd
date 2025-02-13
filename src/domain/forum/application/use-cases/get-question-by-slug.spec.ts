import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { expect, it } from 'vitest'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question by Slug', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentRepository,
    )
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionRepository)
  })

  it('should be able to create a question', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create('example-question'),
    })
    await inMemoryQuestionRepository.items.push(newQuestion)

    const result = await sut.execute({
      slug: 'example-question',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        id: newQuestion.id,
        title: newQuestion.title,
      }),
    })
  })
})
