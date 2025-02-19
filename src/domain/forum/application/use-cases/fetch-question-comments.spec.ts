import { UniqueEntityID } from '@/core/entities/unique-entity'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { expect, it } from 'vitest'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'

let inMemoryQuestionCommentRepository: InMemoryQuestionCommentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository()
    inMemoryQuestionCommentRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    )
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentRepository)
  })

  it('should be able to fetch question comments', async () => {
    const student = makeStudent({ name: 'John Doe' })
    inMemoryStudentsRepository.items.push(student)

    const comment1 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })
    const comment2 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })
    const comment3 = makeQuestionComment({
      questionId: new UniqueEntityID('question-1'),
      authorId: student.id,
    })

    await inMemoryQuestionCommentRepository.create(comment1)
    await inMemoryQuestionCommentRepository.create(comment2)
    await inMemoryQuestionCommentRepository.create(comment3)

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)

    const questionComments = result.value?.comments
    expect(questionComments).toEqual([
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

  it('should be able to fetch paginated question comments', async () => {
    const student = makeStudent({ name: 'John Doe' })
    inMemoryStudentsRepository.items.push(student)

    for (let i = 1; i <= 28; i++) {
      await inMemoryQuestionCommentRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityID('question-1'),
          authorId: student.id,
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.isRight()).toBe(true)

    const questionComments = result.value?.comments
    expect(questionComments).toHaveLength(8)
  })
})
