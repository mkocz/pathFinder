import { select, classNames } from './settings.js';
import Path from './path.js';

class Finder {
    constructor(element) {
        const thisFinder = this;

        thisFinder.setInitialValues();
        thisFinder.getElements(element);
        thisFinder.initActions();
    }

    setInitialValues() {
        const thisFinder = this;

        thisFinder.stage = 0;
        thisFinder.selectedTiles = [];
        thisFinder.startTile = [];
        thisFinder.stopTile = [];
    }

    getElements(element) {
        const thisFinder = this;

        thisFinder.dom = {};
        thisFinder.dom.wrapper = element;
        thisFinder.dom.grid = thisFinder.dom.wrapper.querySelector(select.containerOf.grid);
        thisFinder.dom.calculateBtn = thisFinder.dom.wrapper.querySelector(select.finder.calculateBtn);
        thisFinder.dom.finishBtn = thisFinder.dom.wrapper.querySelector(select.finder.finishBtn);
        thisFinder.dom.restartBtn = thisFinder.dom.wrapper.querySelector(select.finder.restartBtn);
        thisFinder.dom.textStage_0 = thisFinder.dom.wrapper.querySelector(select.finder.textStage_0);
        thisFinder.dom.textStage_1 = thisFinder.dom.wrapper.querySelector(select.finder.textStage_1);
        thisFinder.dom.textStage_2 = thisFinder.dom.wrapper.querySelector(select.finder.textStage_2);
        thisFinder.dom.allTiles = thisFinder.dom.wrapper.querySelectorAll(select.finder.tile);
    }

    calculatePath(event) {
        const thisFinder = this;

        let bestPath = undefined;
        const validNeighbours = Path.findNeighbours(thisFinder.startTile, thisFinder.selectedTiles);
        if (validNeighbours.some(([x, y]) => x === thisFinder.stopTile[0] && y === thisFinder.stopTile[1])) {
            bestPath = [thisFinder.startTile, thisFinder.stopTile];
        } else {
            const paths = Path.createPaths([thisFinder.startTile], validNeighbours);
            bestPath = Path.checkAndCreateNewPaths(paths, thisFinder.stopTile, thisFinder.selectedTiles);
        }

        bestPath.forEach(element => {
            const tile = document.querySelector(`[data-x="${element[0]}"][data-y="${element[1]}"]`);
            tile.classList.add(classNames.tile.highlighted);
        });

        thisFinder.dom.textStage_1.classList.remove(classNames.general.visible);
        thisFinder.dom.textStage_2.classList.add(classNames.general.visible);
        event.target.classList.remove(classNames.general.visible);
        thisFinder.dom.restartBtn.classList.add(classNames.general.visible);
    }

    selectTile(event) {
        const thisFinder = this;

        if (thisFinder.stage == 0) {
            thisFinder.selectedTiles = Path.addTile(event, thisFinder.selectedTiles);
            if (thisFinder.selectedTiles.length > 1) {
                thisFinder.dom.finishBtn.classList.add(classNames.general.visible);
            } else {
                thisFinder.dom.finishBtn.classList.remove(classNames.general.visible);
            }
        } else if (thisFinder.startTile.length == 0) {
            thisFinder.startTile[0] = parseInt(event.target.dataset.x);
            thisFinder.startTile[1] = parseInt(event.target.dataset.y);
            event.target.classList.add(classNames.tile.highlighted);
        } else if (thisFinder.stopTile.length == 0) {
            thisFinder.stopTile[0] = parseInt(event.target.dataset.x);
            thisFinder.stopTile[1] = parseInt(event.target.dataset.y);
            event.target.classList.add(classNames.tile.highlighted);
            thisFinder.dom.calculateBtn.classList.add(classNames.general.visible);
        } else {
            alert('Points have been selected');
        }
    }

    initActions() {
        const thisFinder = this;
        thisFinder.dom.textStage_0.classList.add(classNames.general.visible);

        thisFinder.dom.grid.addEventListener('click', function (event) {
            thisFinder.selectTile(event);
        });

        thisFinder.dom.finishBtn.addEventListener('click', function (event) {
            thisFinder.stage = 1;
            thisFinder.dom.textStage_0.classList.remove(classNames.general.visible);
            thisFinder.dom.textStage_1.classList.add(classNames.general.visible);
            event.target.classList.remove(classNames.general.visible);
        });

        thisFinder.dom.calculateBtn.addEventListener('click', function (event) {
            thisFinder.calculatePath(event);
        });

        thisFinder.dom.restartBtn.addEventListener('click', function (event) {
            thisFinder.setInitialValues();
            thisFinder.dom.textStage_0.classList.add(classNames.general.visible);
            thisFinder.dom.textStage_2.classList.remove(classNames.general.visible);
            event.target.classList.remove(classNames.general.visible);
            thisFinder.dom.allTiles.forEach(tile => {
                tile.classList.remove(classNames.tile.selected);
                tile.classList.remove(classNames.tile.highlighted);
            });
        });
    }
}

export default Finder;
