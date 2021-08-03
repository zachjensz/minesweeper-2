import { GRID_SIZE, generateGrid, revealTile } from './logic.js'

let gameInteractable = false
const gridElement = document.querySelector('#grid')
const tileTemplate = document.querySelector('#tile-template')

document.body.style.setProperty('--grid-size', GRID_SIZE)

let grid = generateGrid()
function createGrid() {
  grid.forEach((row) => {
    row.forEach((tile) => {
      const tileElement = tileTemplate.content
        .cloneNode(true)
        .querySelector('.tile')
      tileElement.dataset.x = tile.x
      tileElement.dataset.y = tile.y
      gridElement.append(tileElement)
    })
  })
  gameInteractable = true
}
createGrid()

gridElement.onclick = (event) => {
  if (!gameInteractable) resetLevel()
  if (!isCoveredTile(event.target)) return
  if (event.target.dataset.flagged) return
  uncoverTiles(
    revealTile(grid, grid[+event.target.dataset.y][+event.target.dataset.x])
  )
}

gridElement.oncontextmenu = (event) => {
  event.preventDefault()
  if (!isCoveredTile(event.target)) return
  event.target.toggleAttribute('data-flagged')
}

function isCoveredTile(tileElement) {
  if (!tileElement.classList.contains('tile')) return false
  if (tileElement.dataset.uncovered) return false
  return true
}

function uncoverTiles(tiles) {
  tiles.forEach((tile) => {
    if (tile.mine) {
      gameOver()
      return
    }
    const tileElement = document.querySelector(
      `[data-y="${tile.y}"][data-x="${tile.x}"]`
    )
    tileElement.dataset.uncovered = true
    tileElement.dataset.value = tile.value
    if (tile.mine) tileElement.dataset.mine = true
    if (tile.value > 0 && !tile.mine) tileElement.textContent = tile.value
  })
}

function gameOver() {
  gameInteractable = false
  grid.forEach((row) => {
    row.forEach((tile) => {
      if (tile.mine)
        document.querySelector(
          `[data-y="${tile.y}"][data-x="${tile.x}"]`
        ).dataset.mine = true
    })
  })
}

function resetLevel() {
  gridElement.textContent = ''
  grid = generateGrid()
  createGrid()
}
