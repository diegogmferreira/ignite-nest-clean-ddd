import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answerRepository: AnswersRepository,
    private sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name,
    )
  }

  private async sendBestAnswerNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answerRepository.findById(bestAnswerId.toString())

    if (answer) {
      await this.sendNotificationUseCase.execute({
        recipientId: answer.authorId.toString(),
        title: `Sua resposta escolhida como melhor para${question.title.substring(0, 40).concat('...')}`,
        content: `A resposta que você enviou em "${question.title.substring(0, 20).concat('...')}" foi escolhida pelo autor.`,
      })
    }
  }
}
