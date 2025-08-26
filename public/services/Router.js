import { routes } from "./Routes.js";

export const Router = {
    init: () => {
        document.querySelectorAll("a.navlink").forEach(a => {
            a.addEventListener("click", event => {
                event.preventDefault();
                const href = a.getAttribute("href");
                Router.go(href);
            });
        });  
        window.addEventListener("popstate", () => {
            Router.go(location.pathname, false);
        });      
        // Process initial URL   
        Router.go(location.pathname + location.search);
    }, 
    go: (route, addToHistory=true) => {
        if (addToHistory) {
            history.pushState(null, "", route);
        } else {
            // Update URL without adding to history (replace current entry)
            history.replaceState(null, "", route);
        }
        const routePath = route.includes('?') ? route.split('?')[0] : route;
        let pageElement = null;

        let needsLogin = false;

        for (const r of routes) {
            if (typeof r.path === "string" && r.path === routePath) {
                pageElement = new r.component();
                needsLogin = r.loggedIn == true;
                break;
            } else if (r.path instanceof RegExp) {
                const match = r.path.exec(route);
                if (match) {
                    const params = match.slice(1);
                    pageElement = new r.component();
                    pageElement.params = params;
                    needsLogin = r.loggedIn == true;                    
                    break;
                }
            }
        }

        if (pageElement){
            // We have a page element from routes
            if (needsLogin && app.Store.loggedIn == false){
                //app.showError("You must be logged in to access this page");
                Router.go("/account/login");
                return;
            }
        }

        if (pageElement==null) {
            pageElement = document.createElement("h1");
            pageElement.textContent = "Page not found";
        }       

        //Inserting the new page in the UI

        const oldPage = document.querySelector("main").firstElementChild;
        if (oldPage) oldPage.style.viewTransitionName = "page-old";
        pageElement.style.viewTransitionName = "page-new";

        function updatePage() {
            document.querySelector("main").innerHTML = "";
            document.querySelector("main").appendChild(pageElement);
        }

        if(!document.startViewTransition) {
            updatePage();
            return;
        }else{
            document.startViewTransition(() => {
                updatePage();
            });
        }


    }
}
export default Router;