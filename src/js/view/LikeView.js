import { elements } from './Elements';
import { controlTitleWrap } from './SearchView';

export const changeBUT = (likeBut, isLiked) => {
    const innerhtml =  `<i class="${!isLiked ? 'fas':'far'} fa-heart heart-header"></i>` ;
    likeBut.innerHTML = innerhtml;
    likeBut.classList.toggle('white-likeBut-active');
};

export const ChangeHeartVisibility = amount =>{
    if(!amount) elements.heart.classList.toggle('visibility-none')
}

export const renderLikes = newLike =>{
    const blueprint =`
        <a href="#${newLike.id}" class="results-links fav-links">
            <img class="results" src="${newLike.image}" alt="${newLike.publisher}">
            <div class="results-data">
                <h4 class="result-name">${controlTitleWrap(newLike.title)}</h4>
                <p class="result-info">${newLike.publisher}</p>
            </div>
        </a>
    `;
    elements.favList.insertAdjacentHTML('beforeend',blueprint);
}

export const delLikes =  id =>{
    const el = document.querySelector(`.fav-links[href="#${id}"]`);
    el.parentElement.removeChild(el);
};