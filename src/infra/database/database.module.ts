import { AnswerAttachmentRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswerCommentRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { QuestionAttachmentRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionCommentRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionRepository } from '@/domain/forum/application/repositories/questions-repository'
import { StudentRepository } from '@/domain/forum/application/repositories/students-repository'
import { NotificationRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Module } from '@nestjs/common'
import { CacheModule } from '../cache/cache.module'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-student-repository'

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: QuestionRepository,
      useClass: PrismaQuestionsRepository,
    },
    {
      provide: StudentRepository,
      useClass: PrismaStudentsRepository,
    },
    {
      provide: QuestionCommentRepository,
      useClass: PrismaQuestionCommentsRepository,
    },
    {
      provide: QuestionAttachmentRepository,
      useClass: PrismaQuestionAttachmentsRepository,
    },
    {
      provide: AnswersRepository,
      useClass: PrismaAnswersRepository,
    },
    {
      provide: AnswerCommentRepository,
      useClass: PrismaAnswerCommentsRepository,
    },
    {
      provide: AnswerAttachmentRepository,
      useClass: PrismaAnswerAttachmentsRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentsRepository,
    },
    {
      provide: NotificationRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [
    PrismaService,
    QuestionRepository,
    StudentRepository,
    QuestionCommentRepository,
    QuestionAttachmentRepository,
    AnswersRepository,
    AnswerCommentRepository,
    AnswerAttachmentRepository,
    AttachmentsRepository,
    NotificationRepository,
  ],
})
export class DatabaseModule {}
