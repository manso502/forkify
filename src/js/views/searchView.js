import {elements} from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}

const limitRecipeTitle = (title, limit = 17) => {

    const newTitle = [];
    if(title.length > limit) {
        
        title.split(' ').reduce((acc, cur)=>{
            if(acc + cur.length <= limit){
                newTitle.push(cur);
                
            }
            return acc + cur.length;
        },0);

        return `${newTitle.join(' ')}...`
    }
    
    return title;
}

const renderRecipe = recipes => {
    const markUp = 
    `
    <li>
        <a class="results__link" href="#${recipes.recipe_id}">
            <figure class="results__fig">
                <img src="${recipes.image_url}" alt=${recipes.title}>
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipes.title)}</h4>
                <p class="results__author">${recipes.publisher}</p>
            </div>
        </a>
    </li>
    `;

    elements.searchResultList.insertAdjacentHTML("beforeend",markUp);
}

const  createButtons = (page, type) => `

                <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page -1 : page + 1}>
                    <span>Page ${type === 'prev' ? page -1 : page + 1}</span>
                    <svg class="search__icon">
                        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
                    </svg>
                    
                </button>
                `

const renderButtons = (page, numResults, resPerPage) => {

    let button;
    const pages = Math.ceil(numResults/resPerPage);

    if(page === 1 && pages > 1){
        //only button to go to next page
       button = createButtons(page, 'next');

    } else if (page < pages){
        //both buttons

        button = `
        ${createButtons(page, 'prev')}
        ${createButtons(page, 'next')}
        `;
        
    } else if (page === pages && pages > 1){
        // only button to go to prev page

        button = createButtons(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
}
export const renderResults = (recipes, page = 1, resPerPage = 10)  => {
    //render results of current page
    const start = (page - 1) * resPerPage; //2*10=20
    const end = page * resPerPage; //3*10=30

    recipes.slice(start, end).forEach(renderRecipe);

    //render buttons for paging
    renderButtons(page, recipes.length, resPerPage);



}

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};