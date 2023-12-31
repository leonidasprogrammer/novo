const { hash, compare } = require('bcryptjs')
const AppError = require('../utils/AppError.js')

const UserRepository = require('../repositories/UserRepository')
const sqliteConnection = require('../database/sqlite')
const UserCreateService = require('../services2/UserCreateService')

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body

    /*const database = await sqliteConnection()
    const checkUserExists = await databese.get("SELECT * FROM users WHERE email = (?)", [email]);

    if (checkUserExists) {
      throw new AppError("Este e-mail já está em uso")
    }*/

    const userRepository = new UserRepository()
    const userCreateService = new UserCreateService(userRepository)

    await userCreateService.execute({ name, email, password })

    return response.status(201).json()
  }

  /**
   *  index - GET para listar vários registros.
   *  show - GET para exibir um registro especifico.
   *  create - POST para criar um registro.
   *  update - PUT para atualizar um registro.
   *  delete - DELETE para remover um registro.
   */
  async update(request, response) {
    const { id, name, email, password, old_password } = request.body
    const user_id = await request.body.id

    //console.log({ user_id })

    const database = await sqliteConnection()
    const user = await database.get('SELECT * FROM users WHERE id = (?)', [
      user_id
    ])

    if (!user) {
      throw new AppError('Usuarios não encontrado')
    }

    const userWithUpdatedEmail = await database.get(
      'SELECT * FROM users WHERE email =  (?)',
      [email]
    )

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('Este e-mail já está em uso.')
    }
    user.name = name ?? user.name
    user.email = email ?? user.email

    if (password && !old_password) {
      throw new AppError(
        'Você precisa informar a senha antiga para definir nova senha'
      )
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password)

      if (!checkOldPassword) {
        throw new AppError('A senha antiga não confere.')
      }

      user.password = await hash(password, 8)
    }
    await database.run(
      `
    UPDATE users SET
    name = ?,
    email = ?,
    password = ?,
    updated_at = DATETIME('now')
    WHERE id = ?`,
      [user.name, user.email, user.password, user_id]
    )

    return response.json()
  }
}

module.exports = UsersController
