import { UniqueEntityID } from '@/core/entities/unique-entity'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { expect, it } from 'vitest'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'

let inMemoryAnswerCommentRepository: InMemoryAnswerCommentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryAnswerCommentRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentRepository)
  })

  it('should be able to fetch answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' })
    inMemoryStudentsRepository.items.push(student)

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })
    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })
    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    })

    await inMemoryAnswerCommentRepository.create(comment1)
    await inMemoryAnswerCommentRepository.create(comment2)
    await inMemoryAnswerCommentRepository.create(comment3)

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.comments).toHaveLength(3)

    const answerComments = result.value?.comments
    expect(answerComments).toEqual([
      expect.objectContaining({
        author: 'John Doe',
        commentId: comment1.id,
      }),
      expect.objectContaining({
        author: 'John Doe',
        commentId: comment2.id,
      }),
      expect.objectContaining({
        author: 'John Doe',
        commentId: comment3.id,
      }),
    ])
  })

  it('should be able to fetch paginated answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' })
    inMemoryStudentsRepository.items.push(student)

    for (let i = 1; i <= 28; i++) {
      await inMemoryAnswerCommentRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.comments).toHaveLength(8)
  })
})
