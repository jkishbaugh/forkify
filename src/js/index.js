import Search from './models/Search';
import Recipe from "./models/Recipe";
import List from  "./models/List";
import {elements, renderLoader, clearLoader} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView'
import * as listView from "./views/listView";
import Likes from "./models/Likes";
import * as likesView from "./views/likesView";
const state = {};

/*
███████╗███████╗ █████╗ ██████╗  ██████╗██╗  ██╗     ██████╗ ██████╗ ███╗   ██╗████████╗██████╗  ██████╗ ██╗     ██╗     ███████╗██████╗
██╔════╝██╔════╝██╔══██╗██╔══██╗██╔════╝██║  ██║    ██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔═══██╗██║     ██║     ██╔════╝██╔══██╗
███████╗█████╗  ███████║██████╔╝██║     ███████║    ██║     ██║   ██║██╔██╗ ██║   ██║   ██████╔╝██║   ██║██║     ██║     █████╗  ██████╔╝
╚════██║██╔══╝  ██╔══██║██╔══██╗██║     ██╔══██║    ██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██╗██║   ██║██║     ██║     ██╔══╝  ██╔══██╗
███████║███████╗██║  ██║██║  ██║╚██████╗██║  ██║    ╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╔╝███████╗███████╗███████╗██║  ██║
╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝     ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝

*/
const controlSearch = async () => {
    //get query from view
    const query = searchView.getInput();

    if(query){
        //new search object and add to state
        state.search = new Search(query);
        // Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.results);
        // Search for recipes
        try {
            await state.search.getResults();
            // render results to the UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (e) {
            console.log(e);
            clearLoader();
        }
    }

};

window.addEventListener('submit', e=> {
   e.preventDefault();
   controlSearch();
});
//Testing

elements.searchForm.addEventListener('load', e=> {
    e.preventDefault();
    controlSearch();
});
elements.searchResPages.addEventListener('click', e => {
    const btn =  e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        console.log(goToPage);
    }
});
/*
██████╗ ███████╗ ██████╗██╗██████╗ ███████╗     ██████╗ ██████╗ ███╗   ██╗████████╗██████╗  ██████╗ ██╗     ██╗     ███████╗██████╗
██╔══██╗██╔════╝██╔════╝██║██╔══██╗██╔════╝    ██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔═══██╗██║     ██║     ██╔════╝██╔══██╗
██████╔╝█████╗  ██║     ██║██████╔╝█████╗      ██║     ██║   ██║██╔██╗ ██║   ██║   ██████╔╝██║   ██║██║     ██║     █████╗  ██████╔╝
██╔══██╗██╔══╝  ██║     ██║██╔═══╝ ██╔══╝      ██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██╗██║   ██║██║     ██║     ██╔══╝  ██╔══██╗
██║  ██║███████╗╚██████╗██║██║     ███████╗    ╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╔╝███████╗███████╗███████╗██║  ██║
╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝╚═╝     ╚══════╝     ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝


*/


const controlRecipe = async () => {
    const id = window.location.hash.replace("#", "");

    if (id) {
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        if (state.search) searchView.highlightSelected(id);

        state.recipe = new Recipe(id);

        try {
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            state.recipe.calcTime();
            state.recipe.calcServings();

            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } catch (e) {
            console.log(e);
        }
    }
};

['hashchange', "load"].forEach(event => window.addEventListener(event, controlRecipe));
/*
██╗     ██╗███████╗████████╗     ██████╗ ██████╗ ███╗   ██╗████████╗██████╗  ██████╗ ██╗     ██╗     ███████╗██████╗
██║     ██║██╔════╝╚══██╔══╝    ██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔═══██╗██║     ██║     ██╔════╝██╔══██╗
██║     ██║███████╗   ██║       ██║     ██║   ██║██╔██╗ ██║   ██║   ██████╔╝██║   ██║██║     ██║     █████╗  ██████╔╝
██║     ██║╚════██║   ██║       ██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██╗██║   ██║██║     ██║     ██╔══╝  ██╔══██╗
███████╗██║███████║   ██║       ╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╔╝███████╗███████╗███████╗██║  ██║
╚══════╝╚═╝╚══════╝   ╚═╝        ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝

*/

const controlList = () => {
    if(!state.list) state.list = new List();

    state.recipe.ingredients.forEach(el => {
        const item = state.list.additem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if(e.target.matches('.shopping__delete , .shopping__delete *')){
        state.list.deleteItem(id);
        listView.deleteItem(id);
    }else if(e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    }
});
/*
██╗     ██╗██╗  ██╗███████╗███████╗     ██████╗ ██████╗ ███╗   ██╗████████╗██████╗  ██████╗ ██╗     ██╗     ███████╗██████╗
██║     ██║██║ ██╔╝██╔════╝██╔════╝    ██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔═══██╗██║     ██║     ██╔════╝██╔══██╗
██║     ██║█████╔╝ █████╗  ███████╗    ██║     ██║   ██║██╔██╗ ██║   ██║   ██████╔╝██║   ██║██║     ██║     █████╗  ██████╔╝
██║     ██║██╔═██╗ ██╔══╝  ╚════██║    ██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██╗██║   ██║██║     ██║     ██╔══╝  ██╔══██╗
███████╗██║██║  ██╗███████╗███████║    ╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╔╝███████╗███████╗███████╗██║  ██║
╚══════╝╚═╝╚═╝  ╚═╝╚══════╝╚══════╝     ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚══════╝╚═╝  ╚═╝

*/
//testing


const controlLike = () => {
    if(!state.likes) state.likes =  new Likes();
    const currentId = state.recipe.id;
    if(!state.likes.isLiked(currentId)){
        const newLike = state.likes.addLike(
            state.recipe.id,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img);

            likesView.toggleLikeBtn(true);
            likesView.renderLike(newLike);
    }else{
        state.likes.deleteLike(currentId);
        likesView.toggleLikeBtn(false);
        likesView.deleteLike(currentId);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};
window.addEventListener('load', ()=>{
    state.likes =  new Likes();
    state.likes.readStorage();
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

elements.recipe.addEventListener('click', e => {

    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if(e.target.matches('.btn-increase, .btn-increase *')){
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }else if(e.target.matches('.recipe__button--add, .recipe__button--add *')){
        controlList();
    }else if(e.target.matches('.recipe__love , .recipe__love *')){
        controlLike();
    }
});
