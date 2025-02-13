import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { expect, it } from 'vitest'
import { SendNotificationUseCase } from './send-notification'

let inMemoryNotificationRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notification', () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationRepository)
  })

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientId: '1',
      title: 'Nova pergunta',
      content: 'Novo conteúdo',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.notification.content).toEqual(
      inMemoryNotificationRepository.items[0].content,
    )
  })
})
