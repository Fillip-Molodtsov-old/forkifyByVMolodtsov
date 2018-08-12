import { elements } from './Elements';

export const getQuery = () => elements.searchRecipe.value;

export const deleteResults = () => {
    elements.resultList.innerHTML = '';
    elements.turnPage.innerHTML = '';
    elements.face.innerHTML = '';
};

export const controlTitleWrap = (title) => {
    let limit; //не считая "..."
    let transformedTitle = [];
    if (screen.width >= 1981) {
        limit = 35;
    }
    else if (screen.width >= 1441 && screen.width < 1981) {
        limit = 21;
    }
    else if (screen.width >= 1200 && screen.width < 1441) {
        limit = 17;
    }
    else if (screen.width >= 992 && screen.width < 1200) {
        limit = 15;
    };
    /*if (title.length > limit) {
        title.split(' ').reduce((prev, cur) => {
            const wordWithSpace = cur.length + 1;
            if (prev + wordWithSpace <= limit) { 
                transformedTitle.push(cur,' ');
            }
            prev += wordWithSpace;
            return prev;
        }, 0)
        title = `${transformedTitle.join('')}...`;
    }*/

    return title.length > limit ? `${title.substring(0, title.substring(0, limit).lastIndexOf(' '))}...` : title; // отрезаем кусок размером с лимит,там ищем последний пробел и индекс этого пробела будет концом строки
};
const renderRecipes = el => {
    const blueprint = `
    <a href="#${el.recipe_id}" class="results-links">
        <img class="results" src="${el.image_url}" alt="">
        <div class="results-data">
            <h4 class="result-name">${controlTitleWrap(el.title)}</h4>
            <p class="result-info">${el.publisher}</p>
        </div>
    </a>
    `;
    elements.resultList.insertAdjacentHTML('beforeend', blueprint)
};

const renderBlueprintForButton = (page, type) =>
    `
    <button class="but-page ${type}-but" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        ${type === 'prev' ? `<i class="fas fa-arrow-left"></i>` : ``}
        <span>page ${type === 'prev' ? page - 1 : page + 1}</span>
        ${type === 'next' ? `<i class="fas fa-arrow-right"></i>` : ``}
    </button>
    `;

const renderBut = (page, pages) => {
    let blueprint;
    if (page == 1 && pages > 1) {
        blueprint = renderBlueprintForButton(page, 'next');
    } else if (page < pages) {
        blueprint =
            `
        ${renderBlueprintForButton(page, 'prev')}
        ${renderBlueprintForButton(page, 'next')}
        `
    } else if (page == pages && pages > 1) {
        blueprint = renderBlueprintForButton(page, 'prev');
    };
    if (blueprint) elements.turnPage.insertAdjacentHTML('afterbegin', blueprint);
};

const renderFace = () => {
    elements.face.innerHTML = `
    <h3 class="text-face">ರ_ರ</h3>
    <span> nothing found</span >
    `;
};

export const renderResults = (recipes, page = 1, recipesPerPage = 10) => {
    const start = (page - 1) * recipesPerPage;
    const end = page * recipesPerPage;
    const amountOfRecipes = recipes.length;
    const pages = Math.ceil(amountOfRecipes / recipesPerPage);
    page = +page;
    //render recipes
    if (recipes.length !== 0) {
        recipes.slice(start, end).forEach(renderRecipes);
        //render buttons
        renderBut(page, pages);
    } else {
        renderFace();
    }
}