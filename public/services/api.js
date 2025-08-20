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
    fetch: async (serviceName, args) => {
        try {
            const queryString = args ? '?' + new URLSearchParams(args).toString() : '';
            const response = await fetch(API.baseURL + serviceName + queryString);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error("API fetch error:", error);
            throw error;
        }

    }
}