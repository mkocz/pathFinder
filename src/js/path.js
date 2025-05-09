import { classNames } from './settings.js';

class Path {
    static findNeighbours([x, y], array) {
        const neighbours = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];

        const foundNeighbours = neighbours.filter(([x, y]) =>
            array.some(([gx, gy]) => gx === x && gy === y)
        );

        return foundNeighbours;
    }

    static createPaths(path, newNeighbours) {

        return newNeighbours
            .filter(point => !path.some(([x, y]) => x === point[0] && y === point[1]))
            .map(point => [...path, point]);
    }

    static checkAndCreateNewPaths(paths, stopTile, selectedTiles) {
        const thisPath = this;

        const allNewPaths = [];
        for (let path of paths) {
            const newNeighbours = thisPath.findNeighbours(path[path.length - 1], selectedTiles);
            if (newNeighbours.some(([x, y]) => x === stopTile[0] && y === stopTile[1])) {
                return [...path, stopTile];
            }
            const newPaths = thisPath.createPaths(path, newNeighbours);
            if (newPaths.length > 0) allNewPaths.push(...newPaths);
        }
        if (allNewPaths.length === 0) return;
        return thisPath.checkAndCreateNewPaths(allNewPaths, stopTile, selectedTiles);
    }

    static validateTileToRemove(point, selectedTiles) {
        const thisPath = this;
        const index = selectedTiles.findIndex(item => item[0] === point[0] && item[1] === point[1]);
        const testTiles = selectedTiles.filter((_, i) => i !== index);
        const tileToRemoveNeighbours = thisPath.findNeighbours(point, testTiles);
        let bestPath = undefined;

        if (tileToRemoveNeighbours.length === 1) return true;
        if (tileToRemoveNeighbours.length > 1) {
            const pairs = [];
            for (let i = 0; i < tileToRemoveNeighbours.length - 1; i++) {
                for (let j = i + 1; j < tileToRemoveNeighbours.length; j++) {
                    pairs.push([tileToRemoveNeighbours[i], tileToRemoveNeighbours[j]]);
                }
            }

            for (let pair of pairs) {
                const validNeighbours = thisPath.findNeighbours(pair[0], testTiles);
                if (validNeighbours.some(([x, y]) => x === pair[1][0] && y === pair[1][1])) {
                    bestPath = [pair[0], pair[1]];
                } else {
                    const paths = thisPath.createPaths([pair[0]], validNeighbours);
                    bestPath = thisPath.checkAndCreateNewPaths(paths, pair[1], testTiles);
                    if (!bestPath) return false;
                }
            }
        }

        if (bestPath) return true;
        return false;
    }

    static addTile(event, selectedTiles) {
        const thisPath = this;
        const x = parseInt(event.target.dataset.x);
        const y = parseInt(event.target.dataset.y);

        if (selectedTiles.length == 0) {
            selectedTiles.push([x, y]);
            event.target.classList.add(classNames.tile.selected);
        } else if (selectedTiles.some(([gx, gy]) => gx === x && gy === y)) {
            if (thisPath.validateTileToRemove([x, y], selectedTiles)) {
                const index = selectedTiles.findIndex(item => item[0] === x && item[1] === y);
                if (index !== -1) {
                    selectedTiles.splice(index, 1);
                }
                event.target.classList.remove(classNames.tile.selected);
            } else {
                alert('Can not break the path');
            }
        } else {
            const neighbours = thisPath.findNeighbours([x, y], selectedTiles);
            if (neighbours.length > 0) {
                selectedTiles.push([x, y]);
                event.target.classList.add(classNames.tile.selected);
            } else {
                alert('Fields should make a path');
            }
        }

        return selectedTiles;
    }
}

export default Path;
