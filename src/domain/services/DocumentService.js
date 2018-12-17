import Document from '../models/Document'
import readFile from '../../util/readFile'

/********************************************
 * Validation
 ********************************************/




/********************************************
 * Business Logic 
 ********************************************/
let id = 0;

const getAllDocuments = async () => {
  return Object.keys(localStorage)
    .map((key) => JSON.parse(localStorage.getItem(key)));
}

const getDocument = async (id) => {
  return JSON.parse(localStorage.getItem(`doc-${id}`))
}

const createDocument = (documentFields) => {
  id += 1;

  console.log(documentFields)

  const document = new Document({ id, ...documentFields });

  return document
}

const patchDocument = async(newDoc) => {
    const oldDoc = await this.getDocument(newDoc.id)
    const updated = { ...oldDoc, ...newDoc};

    console.log(oldDoc, newDoc, updated)

    localStorage.setItem(`doc-${updated.id}`, JSON.stringify(updated));
  }

const actions = {
    submitForReview: (id) => {
      this.patchDocument({ id, status: 'waitingReview'})
    }
  }

const DocumentServiceFactory = () => ({
    createDocument
})

export default DocumentServiceFactory()