import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity'

export interface Props {
  title: string
  url: string
}

export class Attachment extends Entity<Props> {
  get title() {
    return this.props.title
  }

  get url() {
    return this.props.url
  }

  static create(props: Props, id?: UniqueEntityID) {
    const attachment = new Attachment(props, id)

    return attachment
  }
}
