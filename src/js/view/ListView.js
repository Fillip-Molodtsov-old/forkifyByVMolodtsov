import { elements } from './Elements';

export const renderItem = item =>{
    const blueprint =`
    <div class="point-of-the-list" data-uniqid ="${item.id}">
        ${item.count != -1 ? `<input type="number" class="count-shopping" value="${item.count}" step="${item.count}">` : ''}       
        <span class="unit-shopping">${item.unit != -1 ? item.unit:''}</span>
        <p class="ingredients-shopping">${item.description}</p>
        <i class="fas delete-item fa-times"></i>
    </div>
    `;
    elements.shoppingContainer.insertAdjacentHTML('beforeend',blueprint);
}

export const delItem = id =>{
    const item = document.querySelector(`[data-uniqid ="${id}"]`);
    item.parentElement.removeChild(item);
};