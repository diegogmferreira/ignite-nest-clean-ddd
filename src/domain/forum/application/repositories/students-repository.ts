// import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { Student } from '../../enterprise/entities/students';

export abstract class StudentRepository {
  abstract findByEmail(email: string): Promise<Student | null>
  abstract create(student: Student): Promise<void>
}
