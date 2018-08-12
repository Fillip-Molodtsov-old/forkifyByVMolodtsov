import axios from 'axios';
import { config } from '../config';

export class Recipe {
    constructor(id) {
        this.id = id;
        this.servings = 4;
        this.ingredients = [];
    }

    async getRecipe() {
        try {
            const recipeInfo = await axios(`${config.corsProxy}${config.searchAPI}get?key=${config.key2}&rId=${this.id}`);
            this.image = recipeInfo.data.recipe.image_url;
            this.title = recipeInfo.data.recipe.title;
            this.source = recipeInfo.data.recipe.source_url;
            this.publisher = recipeInfo.data.recipe.publisher;
            this.ingredients = recipeInfo.data.recipe.ingredients;
        } catch (er) {
            console.log(er);
        }
    }

    calcTime(servings = this.servings) {
        const amountOfIngredients = this.ingredients.length;
        const partsOfTheProcess = Math.ceil(amountOfIngredients / 3);
        this.time = partsOfTheProcess * 15 * servings / 4;
    }

    changeServings(type) {
        //change servings
        let newServings;
        if (this.servings > 1 && type == 'dec') {
            newServings = this.servings - 1;
        } else if (type == 'inc' && this.servings < 8) {
            newServings = this.servings + 1;
        }
        //change ingredients
        if (newServings) {
            this.calcTime(newServings);
            this.ingredients.forEach(el => {
                if (el.count != -1) {
                    el.count = (el.count * (newServings / this.servings));
                    if (Math.trunc(el.count) != el.count) {
                        el.count = +el.count.toFixed(1);
                    }
                }
            });
            this.servings = newServings;
        };
    }

    parseIngredients() {
        //standartize the units
        const unitLgName = ['tablespoons', 'tablespoon', 'teaspoons', 'teaspoon', 'ounces', 'ounce', 'pinches', 'pounds', 'packages', 'cups', 'jars'];
        const unitSName = ['tbsp', 'tbsp', 'tsp', 'tsp', 'oz', 'oz', 'pinch', 'pound', 'package', 'cup', 'jar']

        let newIngredients = this.ingredients.map(el => {
            el.toLowerCase();
            //get rid of the parentheses
            el = el.replace(/ *\([^()]+\) */g, ' ');
            unitLgName.forEach((unit, i) => {
                el = el.replace(unit, unitSName[i])
            });
            return el;
        });
        //make an ingredient obj
        const reg = /\d*[ -]?\d*\/?\d* ?/; // regular expression on finding the amount of ingredients
        let ingredientsObj = newIngredients.map(ingr => {
            let obj = {};
            let partwithDigits = ingr.match(reg)[0]; //taking the part of count
            partwithDigits = partwithDigits.replace(/\s+$/, '');// deleting spaces
            if (partwithDigits) {
                let count;
                ingr = ingr.substring(ingr.match(reg)[0].length); //cutting the string an creating a new one without digits
                count = partwithDigits.replace(/[ -]+/, '+'); //(preparing) adding the fraction to the digits
                count = eval(count);//adding
                if (Math.trunc(count) !== count) { //round if has fraction
                    count = +count.toFixed(1);
                }
                obj.count = count;
            } else {
                obj.count = -1;
            }
            let arrayOfWords = ingr.split(' ');
            arrayOfWords.forEach((e, i) => { // deleting parts that are only spaces
                if (!e) {
                    arrayOfWords.splice(i, 1)
                }
            });
            arrayOfWords[0] = arrayOfWords[0].replace(',', ''); // check for comas after the unit
            let indexOfUnit = arrayOfWords.findIndex(word => unitSName.includes(word));
            if (indexOfUnit != -1) {
                const unit = arrayOfWords[indexOfUnit] + ' of ';
                obj.unit = unit;
                obj.description = arrayOfWords.slice(indexOfUnit + 1).join(' ');
            } else {
                obj.unit = -1;
                obj.description = arrayOfWords.join(' ');
            }

            return obj;
        })
        this.ingredients = ingredientsObj;
    }
}