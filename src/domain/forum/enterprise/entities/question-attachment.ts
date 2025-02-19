import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity'

export interface Props {
  questionId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class QuestionAttachment extends Entity<Props> {
  get questionId() {
    return this.props.questionId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: Props, id?: UniqueEntityID) {
    const questionAttachment = new QuestionAttachment(props, id)

    return questionAttachment
  }
}
