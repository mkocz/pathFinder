import { select, classNames } from './settings.js';
import Finder from './finder.js';


const app = {
    initPages: function () {
        const thisApp = this;

        thisApp.pages = document.querySelector(select.containerOf.pages).children;
        thisApp.navLinks = document.querySelectorAll(select.nav.links);
        thisApp.fidnerContainer = document.querySelector(select.containerOf.finder);

        const idFromHash = window.location.hash.replace('#/', '');
        let pageMatchingHash = thisApp.pages[0].id;

        for (let page of thisApp.pages) {
            if (page.id == idFromHash) {
                pageMatchingHash = page.id;
                break;
            }
        }

        thisApp.activatePage(pageMatchingHash);

        for (let link of thisApp.navLinks) {
            link.addEventListener('click', function (event) {
                const clickedElement = this;
                event.preventDefault();
                const id = clickedElement.getAttribute('href').replace('#', '');
                thisApp.activatePage(id);
                window.location.hash = '#/' + id;
            });
        }
    },

    activatePage: function (pageId) {
        const thisApp = this;

        for (let page of thisApp.pages) {
            page.classList.toggle(classNames.pages.active, page.id == pageId);
        }

        for (let link of thisApp.navLinks) {
            link.classList.toggle(
                classNames.nav.active,
                link.getAttribute('href') == '#' + pageId
            );
        }
    },

    createGrid: function () {
        const container = document.querySelector(select.containerOf.grid);

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const div = document.createElement('div');
                div.className = 'tile';
                div.dataset.x = j;
                div.dataset.y = i;
                container.appendChild(div);
            }
        }
    },

    init: function () {
        const thisApp = this;

        // eslint-disable-next-line no-undef
        AOS.init();
        thisApp.initPages();
        thisApp.createGrid();
        new Finder(thisApp.fidnerContainer);
    }
};

app.init();
