import axios from 'axios';
import {config} from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
        this.recipes = [];
        this.iterator = 1;
    }

    async getSearchResults() { 
        try {
            if(this.iterator != -1){
                const result = await axios(`${config.corsProxy}${config.searchAPI}search?key=${config.key2}&q=${this.query}&page=${this.iterator}`);
                this.recipes.push(...result.data.recipes);
                if (result.data.count == 30) {
                    this.iterator++;
                } else {
                    this.iterator = -1;
                }
            }else{
                console.log(`the total amount of recipes is ${this.recipes.length}`);
            }
        } catch (error) {
            console.log(error);
        }
    }
}



