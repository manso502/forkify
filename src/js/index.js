// Global app controller
import Search from './models/Search';
import List from './models/List';
import Likes from './models/Likes';
import {elements, renderLoader, clearLoader} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import Recipe from '../js/models/Recipe';


/** Global state of the app
 * - search object
 * -  current recipe object
 * - shopping list object
 * - liked recipes
 */
 const state = {};

 /**
  * - Search controller
  * - and 
  * - Recipe conroller
  */
const controlSearch = async () => {

    //1 get the query from the view
    const query = searchView.getInput();

    if(query){

        //2 new search object and add to state
        state.search = new Search(query);

        //3 clean previous result and load new
        searchView.clearInput();

        searchView.clearResults();

        renderLoader(elements.searchRes);

        try {
        //4 search for recipes
        await state.search.getResults();
       
        
        //5 render results on ui
        clearLoader();
        searchView.renderResults(state.search.result);
        
        } catch (error) {
            alert('something went wrong');
            clearLoader();
        }
        
    }

}


elements.searchForm.addEventListener('submit', e => {
     e.preventDefault();
     controlSearch();
 });

 elements.searchResPages.addEventListener('click', e => {
     const btn = e.target.closest('.btn-inline');
     if(btn){
         const goToPage = parseInt(btn.dataset.goto, 10);
         searchView.clearResults();
         searchView.renderResults(state.search.result, goToPage);
     }
 })

/**
 * Recipe controller
*/
const controlRecipe = async () => {
    const id = window.location.hash.replace('#','');
    
    if(id){
        
        //prepare ui for the changes
        recipeView.clearRecipeResults();
        renderLoader(elements.recipe);

        //highlight selected
        if(state.search) searchView.highlightSelected(id);  

        //create new recipe object
        state.recipe = new Recipe(id);

        try {
            await state.recipe.getRecipe();

            //calc servings and time
            state.recipe.calcTime();
            state.recipe.calServing();
            
            state.recipe.parseIngredients();
            
    
            //Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
            
        } catch (error) {
            alert('error getting the recipe');
            clearLoader();
            
        }
    
    }
};

const controlList = () => {
    // Create a new list IF there in none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredients);
        listView.renderItem(item);
    });
}
//  window.addEventListener('hashchange', controlRecipe);
//  window.addEventListener('load', controlRecipe);

['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe));


//handling recipes button click
elements.recipe.addEventListener('click', e => {

    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        if(state.recipe.serving > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingIngredients(state.recipe);
        }
        
    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc');
        recipeView.updateServingIngredients(state.recipe);
        
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();
    }  else if (e.target.matches('.recipe__love, .recipe__love *')){
        //Control likes
        controlLikes();
    }
});

elements.shopping.addEventListener('click', e => {

    const id = e.target.closest('.shopping__item').dataset.itemid;

    //handle the  delete button 
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        
        state.list.deleteItem(id);

        listView.deleteItem(id);
    }else if(e.target.matches('.shopping__count-value')){

       const val = parseFloat(e.target.value, 10);
       state.list.updateCount(id, val);

    }
});


/**
 * Likes controller
 */
const controlLikes = () => {

    const currentId = state.recipe.id;
    if(!state.likes) state.likes = new Likes();

    if(!state.likes.isLiked(currentId)){
        
        //Add likes to the state
        const newLike = state.likes.addLikes(
            currentId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        )
        
        //toggle the likes button
        likesView.toggleLikesButton(true);
        // add like to ui list
        likesView.renderLikesList(newLike);
        
    } else{
             //Remove likes to the state
             state.likes.deleteLike(currentId);

            //toggle the likes button
            likesView.toggleLikesButton(false);
            
            // remove like to from ui list
            likesView.deleteLiked(currentId);
    }

    likesView.toggleLikedMenu(state.likes.getNumOfLikes());

    //Add likes to the state

    //  
}

//restore liked recipe when page reloads

window.addEventListener('load', () => {
    state.likes = new Likes();

    //restore likes
    state.likes.readStorage();

    //toggle likes menu button
    likesView.toggleLikedMenu(state.likes.getNumOfLikes());

    //render the existing liked

    state.likes.likes.forEach(like => {
        likesView.renderLikesList(like)
    })
});

