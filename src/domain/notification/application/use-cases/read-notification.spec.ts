import { UniqueEntityID } from '@/core/entities/unique-entity'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { makeNotification } from 'test/factories/make-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { expect, it } from 'vitest'
import { ReadNotificationUseCase } from './read-notification'

let inMemoryNotificationRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationRepository)
  })

  it('should be able to read a notification', async () => {
    const newNotification = makeNotification()

    await inMemoryNotificationRepository.create(newNotification)

    const result = await sut.execute({
      recipientId: newNotification.recipientId.toString(),
      notificationId: newNotification.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryNotificationRepository.items[0].readAt).toEqual(
      expect.any(Date),
    )
  })

  it('should not be able to read a notification if the recipient is different', async () => {
    const newNotification = makeNotification({
      recipientId: new UniqueEntityID('recipient-1'),
    })

    await inMemoryNotificationRepository.create(newNotification)

    const result = await sut.execute({
      recipientId: 'recipient-2',
      notificationId: newNotification.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryNotificationRepository.items[0].readAt).toBeUndefined()
  })
})
