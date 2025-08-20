import { API } from "./services/api.js";
import { HomePage } from "./components/HomePage.js";
import './components/AnimatedLoading.js';
import './components/YouTubeEmbed.js';
import { MovieDetailsPage } from "./components/MovieDetailsPage.js";
import { Router } from "./services/Router.js";

window.addEventListener('DOMContentLoaded', event => {
   //document.querySelector('main').appendChild(new HomePage());
   app.Router.init();
   //document.querySelector('main').appendChild(new MovieDetailsPage());
});

window.app = {
    Router,
    showError: (message="There was an error", goToHome=true) => {
        document.getElementById("alert-modal").showModal();
        document.querySelector("#alert-modal p").textContent = message;
        if (goToHome) app.Router.go('/');
    },
    closeError: () => {
        document.getElementById("alert-modal").close();
    },
    search: function(event) {
        event.preventDefault();
        const query = document.querySelector('input[type="search"]').value;
        console.log("Searching for:", query);
        // TODO: Implement search functionality
    }, 
    api: API
}