import {API} from "../services/api.js";
import { CollectionPage } from "./CollectionPage.js";

export class FavoritePage extends CollectionPage {

    constructor() {
        super(API.getFavorites, "Favorite Movies")
    }

}
customElements.define("favorite-page", FavoritePage);