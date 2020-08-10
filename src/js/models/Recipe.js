import axios from 'axios';
import {baseUrl} from '../Config';

export default class Recipe {
    constructor(id) {
        this.id =id;
    }


    async getRecipe(){

        const url = baseUrl.url;

        try {
            const res = await axios(`${url}/get?rId=${this.id}`);
           
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img =      res.data.recipe.image_url;
            this.ingredients = res.data.recipe.ingredients;
            this.sourceUrl = res.data.recipe.source_url;
            
        } catch (error) {
            alert('Something went wrong :-(');
            

        }
    }

    calcTime(){

        //assuming that we need 15  min for every three ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calServing(){
        this.serving = 4;
    }

    parseIngredients(){

        const unitsLong = ['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];
        const unitShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];

        const newIngredients = this.ingredients.map(el => { 
        
            //Uniform units
            let ingredients = el.toLowerCase();

            unitsLong.forEach((unit, i) => {
                ingredients = ingredients.replace(unit, unitShort[i]);
            });
            
            //Remove parenthesis
            ingredients = ingredients.replace(/ *\([^)]*\) */g, ' ');
            
            const arrIng = ingredients.split(' ');
            const unitIndex = arrIng.findIndex(el2 => unitShort.includes(el2));
            
            let objIngredient;

            // if there is a unit
            //ex. 4 1/2 cups, arrcount is [4, 1/2]
            //ex 4 cups, arraycpunt is [4]
            if(unitIndex > -1){

                const arrCount = arrIng.slice(0,unitIndex);
                let count;

                if(arrCount.length === 1){

                    count   = eval(arrIng[0].replace('-','+'));

                }else{
                    count = eval(arrIng.slice(0,unitIndex).join('+'));
                }
                objIngredient = {
                    count,
                    unit: arrIng[unitIndex] ,
                    ingredients: arrIng.slice(unitIndex + 1).join(' ')
             }

            } else if (parseInt(arrIng[0],10)){
                //there is no unit but the first element is the number
                objIngredient = {
                    count: parseInt(arrIng[0],10),
                    unit: '',
                    ingredients
             }
             } else if (unitIndex === -1){
                //there is no unit no number in first position

                objIngredient = {
                    count: 1,
                    unit: '',
                    ingredients:  arrIng.slice([1]).join(' ') 
                }
                
            }

            //Parse ingredients into count, unit, ingredient
            
            return objIngredient;
        });

        this.ingredients = newIngredients;
        
         
        
    }

    updateServings(type){

        const newServings = type === 'dec' ? this.serving -1 : this.serving + 1;

        //ingredients
        this.ingredients.forEach(ing => {
            ing.count *=  (newServings/this.serving); 
        })

        this.serving = newServings;

    }
    
}