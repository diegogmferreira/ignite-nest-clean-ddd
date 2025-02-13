import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity'
import {
  Notification,
  type Props,
} from '@/domain/notification/enterprise/entities/notification'

export function makeNotification(
  override: Partial<Props> = {},
  id?: UniqueEntityID,
) {
  const notification = Notification.create(
    {
      recipientId: new UniqueEntityID(),
      title: faker.lorem.sentence(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  )

  return notification
}
