import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity'

export interface Props {
  answerId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class AnswerAttachment extends Entity<Props> {
  get answerId() {
    return this.props.answerId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: Props, id?: UniqueEntityID) {
    const answerAttachment = new AnswerAttachment(props, id)

    return answerAttachment
  }
}
