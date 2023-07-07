const { Router } = require('express')

const NotesController = require('../controllers/NotesController')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const notesRoutes = Router()

/*function myMiddleware(request, response, next) {
  console.log('Você passou pelo Middleware!')

  if (!request.body.isAdmin) {
    return response.json({ message: 'user unauthorized' })
  }

  next()
}*/

const notesController = new NotesController()

notesRoutes.use(ensureAuthenticated)

notesRoutes.get('/', notesController.index)
notesRoutes.post('/', notesController.create)
notesRoutes.get('/:id', notesController.show)
notesRoutes.delete('/:id', notesController.delete)

module.exports = notesRoutes
