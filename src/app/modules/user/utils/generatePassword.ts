import { hash } from 'bcrypt'

const SALT_ROUNDS = 10

const generatePassword = async (password: string): Promise<string> => {
  return hash(password, SALT_ROUNDS)
}

export default generatePassword
