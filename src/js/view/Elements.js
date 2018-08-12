export const elements = {
    searchArea: document.querySelector('.search-area'),
    searchRecipe: document.querySelector('.search-recipe'),
    resultList: document.querySelector('.search-list'),
    searchResults: document.querySelector('.search-results'),
    mainBody: document.querySelector('.main-body'),
    turnPage: document.querySelector('.turn-page'),
    modalLoader:document.querySelector('.modal-loader'),
    mainBody: document.querySelector('.main-body'),
    shoppingContainer: document.querySelector('.shopping-container'),
    heart: document.querySelector('.heart-top-side'),
    fav: document.querySelector('.favourites'),
    favList: document.querySelector('.fav-list'),
    face:document.querySelector('.nothing-found'),
}

export const renderLoader = (parent) => {
    const blueprint = `
    <div class="loader-wrap">
        <i class="far fa-sun fa-spin loader fa-7x"></i>
    </div>
    `;
    parent.insertAdjacentHTML('beforeend', blueprint);
}

export const deleteLoader = () => {
    const loader = document.querySelector('.loader-wrap');
    if (loader) loader.parentElement.removeChild(loader);
};