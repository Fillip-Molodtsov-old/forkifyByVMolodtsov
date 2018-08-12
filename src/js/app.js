import Search from './data/Search';
import { elements, renderLoader, deleteLoader } from './view/Elements';
import * as searchView from './view/SearchView';
import * as recipeView from './view/RecipeView';
import * as listView from './view/ListView';
import * as likeView from './view/LikeView';
import { Recipe } from './data/MainRecipe';
import { List } from './data/List';
import { Like } from './data/Like';

const state = {};
let isLoaded = true;
const controlSearch = async () => {

    let query;
    if (isLoaded) { query = searchView.getQuery() }
    else if (!isLoaded) { console.log('Something is loading right now') };
    // 1.get the query
    if (query) {
        //2.Create and object
        state.search = new Search(query);
        isLoaded = false;
        //3.Prepare again the UI
        searchView.deleteResults();
        renderLoader(elements.searchResults);
        try {
            //4.Get the recipes
            await state.search.getSearchResults();
            //5.Render the results-list
            deleteLoader();
            searchView.renderResults(state.search.recipes);
        } catch (e) {
            deleteLoader();
            alert('We have some issues with the search request');
        }
        isLoaded = true;
    }
}

elements.searchArea.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.turnPage.addEventListener('click', async (e) => {
    const but = e.target.closest('.but-page');
    const recipePerPage = 10;
    if (but) {
        if (Array.from(but.classList).includes('next-but') && !((+but.dataset.goto) % 3) && (+but.dataset.goto) * recipePerPage === state.search.recipes.length) { //двигаемся вперед и перед тем как закончиться список подгружаем еще(после каждых 20 рецептов)(оно подгружает только тогда когда на следующей странице список заканчивается!)
            searchView.deleteResults();
            renderLoader(elements.searchResults);
            await state.search.getSearchResults(); //.then(console.log(state.search.recipes.length));
            deleteLoader();
        };
        searchView.deleteResults();
        searchView.renderResults(state.search.recipes, but.dataset.goto);
    }
});

const controlRecipe = async () => {
    //1.get the id
    let id;
    if (isLoaded) { id = window.location.hash.replace('#', '') }
    else if (!isLoaded) console.log('Something is loading right now');
    if (id) {
        //2.create an object
        recipeView.focusElectedTab(id);
        state.recipe = new Recipe(id);
        isLoaded = false;
        //3.clean the UI
        recipeView.cleanMain();
        renderLoader(elements.mainBody);
        try {
            //4.get the recipes
            await state.recipe.getRecipe();
            state.recipe.calcTime();
            state.recipe.parseIngredients();
            //5.display the recipes
            deleteLoader();
            recipeView.renderRecipe(state.recipe, state.like.isLiked(state.recipe.id));
        } catch (e) {
            console.log(e);
            alert('we have some problems with getting the recipe');
            deleteLoader();
        }
        isLoaded = true;
    }
}

['hashchange'].forEach(event => { window.addEventListener(event, controlRecipe) });

const controlList = recipe => {
    if (!state.list) state.list = new List();
    recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.description);
        listView.renderItem(item);
    });

}
window.addEventListener('load',()=>{
    state.like = new Like();
    state.like.downloadingFromLocalStorage();
    likeView.ChangeHeartVisibility(state.like.getNumberOfLikes());
    state.like.likeItems.forEach(el => likeView.renderLikes(el));
    controlRecipe();
});

const controlLike = likeBut =>{
    if(!state.like) state.like = new Like();
    const recipe = state.recipe;
    const isLiked = state.like.isLiked(recipe.id);
    //if isn't liked
    if(!isLiked){
        //add to the base
        likeView.ChangeHeartVisibility(state.like.getNumberOfLikes()); //to know if there was zero likes
        const newlike=state.like.addItem(recipe.id,recipe.title,recipe.publisher,recipe.image)
        //change the but
        likeView.changeBUT(likeBut,isLiked)
        
        //add tho the fav list
        likeView.renderLikes(newlike);
    }else{
        //remove the item
        state.like.deleteItem(recipe.id);
        //change the but
        likeView.changeBUT(likeBut, isLiked);
        likeView.ChangeHeartVisibility(state.like.getNumberOfLikes()); //to know if there is any likes left
        //remove from the fav list
        likeView.delLikes(recipe.id);
    }
}
elements.mainBody.addEventListener('click', e => {
    if (e.target.matches('.change-servings, .change-servings *')) {
        if (Array.from(e.target.closest('.change-servings').classList).includes('info-plus')) {
            state.recipe.changeServings('inc');
        } else if (Array.from(e.target.closest('.change-servings').classList).includes('info-minus')) {
            state.recipe.changeServings('dec');
        }
        recipeView.refreshIngredients(state.recipe);
    } else if (e.target.matches('.add-to-shop-list, .add-to-shop-list *')) {
        controlList(state.recipe);
    } else if (e.target.matches('.like-but, .like-but *')){
        const like = e.target.closest('.like-but');
        controlLike(like);
    }
});

elements.shoppingContainer.addEventListener('click', e => {
    const id = e.target.closest('.point-of-the-list').dataset.uniqid;
    if (e.target.matches('.delete-item')){
        listView.delItem(id);
        state.list.deleteItem(id);
    } else if(e.target.matches('.count-shopping')){
        const newCount = +e.target.value;
        state.list.changeCount(id,newCount);
        console.log(state.list);
    }
});
