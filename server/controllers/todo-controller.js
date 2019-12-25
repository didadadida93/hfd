const Todo = require('../models/todo');

class TodoController {
  static getAllTodos(req, res, next) {
    Todo.find({owner: req.payload.id})
      .then(todos => {
        res.json(todos);
      })
      .catch(next);
  }

  static createTodo(req, res, next) {
    Todo.create({
      description: req.body.description,
      dueDate: req.body.dueDate,
      owner: req.payload.id,
    })
      .then(todo => {
        res.status(201).json(todo);
      })
      .catch(next);
  }

  static deleteTodo(req, res, next) {
    Todo.findByIdAndRemove(req.params.todoId)
      .then(todo => {
        if (!todo) throw {name: 'NotFound', message: 'Todo not found'};
        res.json({message: 'Success delete todo'});
      })
      .catch(next);
  }

  static getTodoDetail(req, res, next) {
    Todo.findById(req.params.todoId)
      .populate('owner', 'username email')
      .then(todo => {
        if (!todo) throw {name: 'NotFound', message: 'Todo not found'};
        res.json(todo);
      })
      .catch(next);
  }

  static updateTodo(req, res, next) {
    Todo.findById(req.params.todoId)
      .then(todo => {
        if (!todo) throw {name: 'NotFound', message: 'Todo not found'};
        todo.description = req.body.description || todo.description;
        todo.dueDate = req.body.dueDate
          ? new Date(req.body.dueDate)
          : todo.dueDate;

        return todo.save();
      })
      .then(todo => {
        res.json(todo);
      })
      .catch(next);
  }
}

module.exports = TodoController;
