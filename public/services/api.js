export const API = {
    baseURL: '/api/',
    getTopMovies: async () => {
        return await API.fetch('movies/top/');
    },
    getRandomMovies: async () => {
        return await API.fetch('movies/random/');
    },
    getGenres: async () => {
        return await API.fetch('genres/');
    },
    getMovieByID: async (id) => {
        return await API.fetch(`movies/${id}`);
    },
    searchMovies: async (query, order, genre) => {
        return await API.fetch(`movies/search/`, {query, order, genre});
    },
    register: async (name, email, password) => {
        return await API.send('account/register/', {name, email, password});
    },
    login: async (email, password) => {
        return await API.send('account/login/', {email, password});
    },
    getFavorites: async () => {
        try {
            return await API.fetch("account/favorites");
        } catch (e) {
            app.Router.go("/account/")
        }
    },     
    getWatchlist: async () => {
        try {
            return await API.fetch("account/watchlist");
        } catch (e) {
            app.Router.go("/account/")
        }
    
    },     
    saveToCollection: async (movie_id, collection) => {
        return await API.send("account/save-to-collection/", {
            movie_id, collection
        });
    },
    // Helper methods
    send: async (serviceName, data) => {
        try {
            const response = await fetch(API.baseURL + serviceName, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': app.Store.jwt ? `Bearer ${app.Store.jwt}` : null
                },
                body: JSON.stringify(data)
            });
            const result = await response.json();
            return result;
        } catch (error) {
            console.error("API fetch error:", error);
            throw error;
        }
    },
    fetch: async (serviceName, args) => {
        try {
            const queryString = args ? '?' + new URLSearchParams(args).toString() : '';
            const response = await fetch(API.baseURL + serviceName + queryString , {
                headers: {
                    'Authorization': app.Store.jwt ? `Bearer ${app.Store.jwt}` : null
                }
            });
            const result = await response.json();
            return result;
        } catch (error) {
            console.error("API fetch error:", error);
            throw error;
        }

    }
}