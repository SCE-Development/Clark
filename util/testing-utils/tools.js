function emptySchema (schema) {
  schema.deleteMany({}, err => {
    if (err) {
      //
    }
  })
}

// Exporting functions
module.exports = {
  emptySchema: emptySchema
}
