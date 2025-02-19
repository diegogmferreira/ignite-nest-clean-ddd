import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { expect, it } from 'vitest'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentsRepository
let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions', () => {
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
    sut = new FetchRecentQuestionsUseCase(inMemoryQuestionRepository)
  })

  it('should be able to fetch recent questions', async () => {
    await inMemoryQuestionRepository.create(
      makeQuestion({ createdAt: new Date(2024, 10, 8) }),
    )
    await inMemoryQuestionRepository.create(
      makeQuestion({ createdAt: new Date(2024, 10, 18) }),
    )
    await inMemoryQuestionRepository.create(
      makeQuestion({ createdAt: new Date(2024, 10, 12) }),
    )

    const result = await sut.execute({
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    const questions = result.value?.questions
    expect(questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2024, 10, 18) }),
      expect.objectContaining({ createdAt: new Date(2024, 10, 12) }),
      expect.objectContaining({ createdAt: new Date(2024, 10, 8) }),
    ])
  })

  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 1; i <= 28; i++) {
      await inMemoryQuestionRepository.create(makeQuestion())
    }

    const result = await sut.execute({
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    const questions = result.value?.questions
    expect(questions).toHaveLength(8)
  })
})
