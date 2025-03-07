import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity'
import { Optional } from '@/core/types/optional'

export interface Props {
  recipientId: UniqueEntityID
  title: string
  content: string
  readAt?: Date | null
  createdAt: Date
}

export class Notification extends Entity<Props> {
  get recipientId() {
    return this.props.recipientId
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get readAt() {
    return this.props.readAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  read() {
    this.props.readAt = new Date()
  }

  static create(props: Optional<Props, 'createdAt'>, id?: UniqueEntityID) {
    const notification = new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return notification
  }
}
