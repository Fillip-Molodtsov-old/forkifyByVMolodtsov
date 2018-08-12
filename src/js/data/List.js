import uniqid from 'uniqid';

export class List {
    constructor() {
        this.items = [];
    }
    addItem(count, unit, description) {
        const newItem = {
            count,
            unit,
            description,
            id: uniqid(),
        }
        this.items.push(newItem);
        return newItem;
    }
    deleteItem(id) {
        const index = this.items.findIndex(el => el.id == id);
        this.items.splice(index,1);
        return this.items;
    }
    changeCount(id,newCount){
        this.items.find(el => el.id == id).count = newCount; 
    }
}

