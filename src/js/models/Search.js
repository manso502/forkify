import axios from 'axios';
import { baseUrl } from '../Config';

export default class Search{

   

    constructor(query){
        this.query = query;  
    }

    async getResults(){
   const url = baseUrl.url;
    try{
        const res = await axios(`${url}/search?&q=${this.query}`);
        this.result = res.data.recipes;
        //console.log(this.result);
    }catch(error){
        console.log(error);
        alert(error);
    }
    }
}


