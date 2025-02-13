import { UniqueEntityID } from '@/core/entities/unique-entity'
import type { DomainEvent } from '@/core/events/domain-event'
import type { Question } from '../entities/questions'

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  public occurredAt: Date
  public question: Question
  public bestAnswerId: UniqueEntityID

  constructor(question: Question, bestAnswerId: UniqueEntityID) {
    this.bestAnswerId = bestAnswerId
    this.question = question
    this.occurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.question.id
  }
}
