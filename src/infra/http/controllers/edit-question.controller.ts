import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'

const editBodyQuestionSchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()),
})

const bodyValidationPipe = new ZodValidationPipe(editBodyQuestionSchema)

type EditBodyQuestionSchema = z.infer<typeof editBodyQuestionSchema>

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe)
    body: EditBodyQuestionSchema,
    @CurrentUser() user: UserPayload,
    @Param('id') questionId: string,
  ) {
    const { content, title, attachments } = body
    const { sub: userId } = user

    const result = await this.editQuestion.execute({
      questionId,
      content,
      title,
      authorId: userId,
      attachmentsIds: attachments,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
