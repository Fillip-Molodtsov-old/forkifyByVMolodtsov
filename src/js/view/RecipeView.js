import { elements } from './Elements';
import { Fraction } from 'fractional';

const createFraction = count => {
    let [integer, decimal] = (count + '').split('.').map(el => +el);
    if (!decimal) {
        return count;
    } else if (decimal && integer == 0) {
        const fraction = new Fraction(count);
        return `${fraction.numerator}/${fraction.denominator}`;
    } else if (decimal && integer != 0) {
        const fraction = new Fraction(count - integer);
        return `${integer} ${fraction.numerator}/${fraction.denominator}`;
    }
};

const createIngredient = obj => `
    <div class="ingredient">
        ${obj.description?'<i class="far fa-circle"></i>':''}
        <div class="recipe-count">${obj.count == -1 ? '' : createFraction(obj.count)}</div>
        <div class="recipe-unit">${obj.count == -1 || obj.unit == -1 ? '' : obj.unit}</div>
        <div class="recipe-ingredient">${obj.description ?obj.description:''}</div>
    </div>
`;

export const focusElectedTab = id => {
    if (document.querySelectorAll('.results-links').length) {
        Array.from(document.querySelectorAll('.results-links')).forEach(el => el.style.background = '#fff');
    }
    if (document.querySelector(`a[href="#${id}"]`)) {
        document.querySelector(`a[href="#${id}"]`).style.background = '#d8d8d8';
    }
}
export const cleanMain = () => {
    elements.mainBody.innerHTML = '';
};
export const renderRecipe = (recipe, isLiked) => {
    const blueprint = `
        <div class="top-of-main">
            <div class="img-main">
                <img src="${recipe.image}" alt="${recipe.title}">
            </div>
            <h1>
                <span class="title-main">${recipe.title}</span>
            </h1>
        </div>
        <div class="info-of-main">
            <div class="info-board info-time">
                <i class="fas fa-stopwatch"></i>
                <span class = "recipe-time">${recipe.time} minutes</span>
            </div>
            <div class="info-board info-people">
                <i class="fas fa-user"></i>
                <span class ="recipe-servings">${recipe.servings} serving(s)</span>
            </div>
            <div class="info-board rounded-but change-servings info-plus">
                <i class="fas fa-plus"></i>
            </div>
            <div class="info-board rounded-but change-servings info-minus">
                <i class="fas fa-minus"></i>
            </div>
            <div class="info-board rounded-but like-but ${isLiked ? 'white-likeBut-active' : ''}">
                <i class="${isLiked ? 'fas' : 'far'} fa-heart heart-header"></i>
            </div>
        </div>
        <div class="ingredients-main">
            <div class="ingredients-list">
            ${recipe.ingredients.map(createIngredient).join('')}
            </div>
            <div class="add-to-shop-list">add to the shopping list</div>
        </div>
        <div class="how-to-cook-it">
            <h3>How to cook it?</h3>
            <p>This recipe was carefully designed and tested by <span>${recipe.publisher}</span>. Please check out directions at their website.</p>
            <a class="directions" target="_blank" href="${recipe.source}">Directions</a>
        </div>
    `;
    elements.mainBody.insertAdjacentHTML('afterbegin', blueprint);
}
export const refreshIngredients = recipe => {
    document.querySelector('.recipe-time').textContent = `${recipe.time} minutes`;
    document.querySelector('.recipe-servings').textContent = `${recipe.servings} serving(s)`;
    Array.from(document.querySelectorAll('.recipe-count')).forEach((el, i) => {
        const count = recipe.ingredients[i].count;
        el.textContent = count == -1 ? '' : createFraction(count);
    });
};