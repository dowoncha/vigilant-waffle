import UnitOfWork from './UnitOfWork'

class DomainObject {
    markNew() {
        UnitOfWork.current.registerNew(this);
    }
}