export class Like{
    constructor(){
        this.likeItems =[];
    }
    addItem(id,title,publisher,image){
        const newItem = {
            id,
            title,
            publisher,
            image,
        };
        this.likeItems.push(newItem);
        this.savingToLocalStorage();
        return newItem;
    }
    deleteItem(id){
        const index = this.likeItems.findIndex(el => el.id == id);
        this.likeItems.splice(index,1);
        this.savingToLocalStorage();
        return this.likeItems;
    }
    isLiked(id){
        return this.likeItems.findIndex(el => el.id == id) !== -1;
    }
    getNumberOfLikes(){
        return this.likeItems.length;
    }
    savingToLocalStorage() {
        localStorage.setItem('likeItems', JSON.stringify(this.likeItems));
    } 
    downloadingFromLocalStorage(){
        this.likeItems = JSON.parse(localStorage.getItem('likeItems')) || [];
    }
}