import { compare, hash } from 'bcryptjs'

import { HashCompare } from '@/domain/forum/application/cryptography/hash-compare'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { Injectable } from '@nestjs/common'

@Injectable()
export class BcryptHasher implements HashGenerator, HashCompare {
  private HASH_SALT_LENGTH = 10

  compare(plain: string, hashed: string): Promise<boolean> {
    return compare(plain, hashed)
  }

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }
}
