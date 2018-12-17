import { Subject } from 'rxjs'

const addDocument = (documentState, document) => documentState.concat(document);

const DocumentStoreFactory = (() => {
    // The documentState is the global document truth
    let documentState = [];
    let documentSubject = new Subject();

    return {
        addDocument: (document) => {
            documentState = addDocument(documentState, document)
            documentSubject.next(documentState)
        },
        removeDocument: (document) => {
            documentSubject.next(documentState)
        },
        subscribe: (observer) => {
            return documentSubject.subscribe(observer);
        }
    }
});

export default DocumentStoreFactory()