const notesRouter = require('express').Router()
const Note = require('../models/Note')

notesRouter.get('/', (req, res) => {
  Note.find({})
    .then(notes => {
      notes.map(note => {
        const { _id, __v, ...restOfNote } = note
        return {
          ...restOfNote,
          id: _id
        }
      })
      res.json(notes)
    })
})

notesRouter.get('/:id', (req, res, next) => {
  const { id } = req.params

  Note.findById(id).then(note => {
    note
      ? res.json(note)
      : res.status(404).end()

    // if (note) {
    //   res.json(note)
    // } else {
    //   res.status(404).end()
    // }
  }).catch(err => {
    next(err)
  })
})

notesRouter.put('/:id', (req, res, next) => {
  const { id } = req.params
  const note = req.body

  const newNoteInfo = {
    content: note.content,
    important: note.important

  }
  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      next(err)
    })
})

notesRouter.delete('/:id', (req, res, next) => {
  const { id } = req.params
  Note.findByIdAndDelete(id)
    .then(note => { res.status(204).end() })
    .catch(err => { next(err) })
})

notesRouter.post('/', (req, res) => {
  const note = req.body

  if (!note || !note.content) {
    return res.status(400).json({
      error: 'note.content is missing'
    })
  }

  const newNote = new Note({
    content: note.content,
    important: typeof note.important !== 'undefined' ? note.important : false,
    date: new Date()
  })
  newNote.save().then(savedNote => {
    res.status(201).json(savedNote)
  })
})

module.exports = notesRouter
