import type { NotificationRepository } from '@/domain/notification/application/repositories/notifications-repository'
import type { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository implements NotificationRepository {
  public items: Notification[] = []

  constructor() {}

  async findById(id: string): Promise<Notification | null> {
    const notification = this.items.find((q) => q.id.toString() === id)

    if (!notification) {
      return null
    }

    return notification
  }

  async create(notification: Notification) {
    this.items.push(notification)
  }

  async save(notification: Notification) {
    const itemIndex = this.items.findIndex((q) => q.id === notification.id)

    this.items[itemIndex] = notification
  }
}
