import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export default async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS)
}
