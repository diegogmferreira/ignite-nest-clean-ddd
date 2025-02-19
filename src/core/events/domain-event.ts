import { UniqueEntityID } from '../entities/unique-entity'

export interface DomainEvent {
  occurredAt: Date
  getAggregateId(): UniqueEntityID
}
