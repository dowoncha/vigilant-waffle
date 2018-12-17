/**
 * Document Model
 * Uses a Data Mapper
 * Document <- Document Mapper -> Endpoint (Gateway?, Service Layer?)
 */
// Similar Models
// Notice
// Hotline Documents
// Document type -> 

class Document {
  constructor(fields) {
    for (const prop in fields) {
      if (fields.hasOwnProperty(prop)) {
        this[prop] = fields[prop]
      }
    }
  }
}

export default Document