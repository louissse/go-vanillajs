import { API } from "../services/api.js";
import { MovieItem } from "./MovieItem.js";


//Expose for JavaScript usage
export class HomePage extends HTMLElement{

    constructor() {
        super();
        fetch('/templates/homepage.html')
    }
    

    async render(){
        const topMovies = await API.getTopMovies()
        renderMoviesInList(topMovies, document.querySelector('#top-10 ul'));

        const randomMovies = await API.getRandomMovies()
        renderMoviesInList(randomMovies, document.querySelector('#random ul'));

    
        function renderMoviesInList(movies, ul){
            ul.innerHTML = ''; // Clear existing content
            movies.forEach(movie => {
                const li = document.createElement('li');
                li.appendChild(new MovieItem(movie));
                ul.appendChild(li);
            });
        }
    }

    connectedCallback() {
        const template = document.getElementById('template-home');
        const content = template.content.cloneNode(true);
        this.appendChild(content);
        this.render();
    }
}
//Expose for HTML usage
customElements.define('home-page', HomePage);