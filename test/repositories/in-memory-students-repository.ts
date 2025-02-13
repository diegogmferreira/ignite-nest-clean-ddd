import type { StudentRepository } from '@/domain/forum/application/repositories/students-repository'
import type { Student } from '@/domain/forum/enterprise/entities/students'

export class InMemoryStudentsRepository implements StudentRepository {
  public items: Student[] = []

  async findByEmail(email: string): Promise<Student | null> {
    const student = this.items.find((q) => q.email === email)

    if (!student) {
      return null
    }

    return student
  }

  async create(student: Student) {
    this.items.push(student)
  }
}
