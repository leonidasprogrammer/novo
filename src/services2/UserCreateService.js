const { hash } = require('bcryptjs')
const AppError = require('../utils/AppError.js')

class UserCreateService {
  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute({ name, email, password }) {
    //const database = await sqliteConnection()
    const checkUserExists = await this.userRepository.findByEmail(email)
    /*await database.get(
      'SELECT * FROM users WHERE email = (?)',
      [email]
    )*/

    if (checkUserExists) {
      throw new AppError('Este e-mail já está em uso.')
    }

    const hashedPassword = await hash(password, 8)

    const userCreated = await this.userRepository.create({
      name,
      email,
      password: hashedPassword
    })

    return userCreated

    /*await database.run(
      'INSERT INTO users (name, email, password) VALUES (?, ? ,?) ',
      [name, email, hashedPassword]
    )*/
  }
}

module.exports = UserCreateService
