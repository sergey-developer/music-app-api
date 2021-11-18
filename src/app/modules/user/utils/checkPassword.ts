import { compare } from 'bcrypt'

export default (password: string, hashedPassword: string): Promise<boolean> => {
  return compare(password, hashedPassword)
}
