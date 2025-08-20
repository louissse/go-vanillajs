export class MovieItem extends HTMLElement {
    constructor(movie) {
        super();
        this.movie = movie;
    }

    connectedCallback() {
        const url = "/movies/" + this.movie.id;
        this.innerHTML = `
            <a href="#">
            <article style="view-transition-name: movie-${this.movie.id};">
                <img src="${this.movie.poster_url}" alt="${this.movie.title} Poster">
                <p>${this.movie.title} (${this.movie.release_year})</p>
            </article>
            </a>
        `;

        this.querySelector('a').addEventListener('click', (e) => {
            e.preventDefault();
            app.Router.go(url);
        });
    }
}

customElements.define('movie-item', MovieItem);