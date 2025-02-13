import { DomainEvents } from '@/core/events/domain-events'
import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import type { QuestionRepository } from '@/domain/forum/application/repositories/questions-repository'
import type { Question } from '@/domain/forum/enterprise/entities/questions'

export class InMemoryQuestionsRepository implements QuestionRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentRepository,
  ) {}

  async findById(id: string): Promise<Question | null> {
    const question = this.items.find((q) => q.id.toString() === id)

    if (!question) {
      return null
    }

    return question
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((q) => q.slug.value === slug)

    if (!question) {
      return null
    }

    return question
  }

  async findManyRecent(params: PaginationParams): Promise<Question[]> {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((params.page - 1) * 20, params.page * 20)

    return questions
  }

  async create(question: Question) {
    this.items.push(question)

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async save(question: Question) {
    const itemIndex = this.items.findIndex((q) => q.id === question.id)

    this.items[itemIndex] = question

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getNewItems(),
    )

    await this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question): Promise<void> {
    const itemIndex = this.items.findIndex((q) => q.id === question.id)

    this.items.splice(itemIndex, 1)
    this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    )
  }
}
