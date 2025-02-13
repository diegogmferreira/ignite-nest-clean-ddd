import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity'

interface Props {
  name: string
}

export class Instructor extends Entity<Props> {
  static create(props: Props, id?: UniqueEntityID) {
    const instructor = new Instructor(props, id)

    return instructor
  }
}
