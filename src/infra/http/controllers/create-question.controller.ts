import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'

const createBodyQuestionSchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()),
})

type CreateBodyQuestionSchema = z.infer<typeof createBodyQuestionSchema>

@Controller('/questions')
// @UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(createBodyQuestionSchema))
    body: CreateBodyQuestionSchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { content, title, attachments } = body
    const { sub: userId } = user

    const result = await this.createQuestion.execute({
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
