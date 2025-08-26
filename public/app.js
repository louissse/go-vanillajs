import { API } from "./services/api.js";
import { HomePage } from "./components/HomePage.js";
import './components/AnimatedLoading.js';
import './components/YouTubeEmbed.js';
import { MovieDetailsPage } from "./components/MovieDetailsPage.js";
import { Router } from "./services/Router.js";
import Store from "./services/Store.js";

window.addEventListener('DOMContentLoaded', event => {
   //document.querySelector('main').appendChild(new HomePage());
   app.Router.init();
   //document.querySelector('main').appendChild(new MovieDetailsPage());
});

window.app = {
    Router,
    Store,
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
        const q = document.querySelector('input[type="search"]').value;
        console.log("Searching for:", q);  
        app.Router.go("/movies?q=" + q);
    },
    searchOrderChange: (order) => {
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get("q");
        const genre = urlParams.get("genre") ?? "";
        app.Router.go(`/movies?q=${q}&order=${order}&genre=${genre}`, false);
    },
    searchFilterChange: (genre) => {
        const urlParams = new URLSearchParams(window.location.search);
        const q = urlParams.get("q");
        const order = urlParams.get("order") ?? "";
        app.Router.go(`/movies?q=${q}&order=${order}&genre=${genre}`, false);
    },
    saveToCollection: async (movie_id, collection) => {
        if (app.Store.loggedIn) {
            try {
                const response = await API.saveToCollection(movie_id, collection);
                if (response.success) {
                    switch(collection) {
                        case "favorite":
                            app.Router.go("/account/favorites")
                        break;
                        case "watchlist":
                            app.Router.go("/account/watchlist")
                    }
                } else {
                    app.showError("We couldn't save the movie.")
                }
            } catch (e) {
                console.log(e)
            }
        } else {
            app.Router.go("/account/");
        }
    },
    register: async (event) => {
        event.preventDefault();
        const name = document.getElementById("register-name").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
        const confirmPassword = document.getElementById("register-password-confirmation").value;

        const errors = [];
        if (name.length<3) errors.push("Name must be at least 3 characters long");
        if (!email.includes("@")) errors.push("Email must be valid");
        if (password.length<6) errors.push("Password must be at least 6 characters long");
        if (password!==confirmPassword) errors.push("Password and confirmation must match");

        if (errors.length>0) {
            app.showError(errors.join(". "), false);
            return;
        }
        if (errors.length==0) {
            const response = await API.register(name, email, password);
            if (response.success) {
                alert("Registration successful. You are now logged in.");
                app.Store.jwt = response.jwt;
                app.Router.go("/account/");
            } else {
                app.showError(response.message ?? "Could not register user", false);
            }
        }
    },
    login: async (event) => {
        event.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        const errors = [];
        if (!email.includes("@")) errors.push("Email must be valid");
        if (password.length<6) errors.push("Password must be at least 6 characters long");

        if (errors.length>0) {
            app.showError(errors.join(". "), false);
            return;
        }
        if (errors.length==0) {
            const response = await API.login(email, password);
            if (response.success) {
                app.Store.jwt = response.jwt;
                app.Router.go("/account/");
            } else {
                app.showError(response.message ?? "Could not log in", false);
            }
        }
    },logout: () => {
        app.Store.jwt = null;
        app.Router.go("/");
    },
    api: API
}