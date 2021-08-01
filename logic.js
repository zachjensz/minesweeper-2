export const GRID_SIZE = 16
export const GRID_MINES = 40

export function generateGrid() {
  const grid = []
  for (let i = 0; i < GRID_SIZE; i++) {
    const row = []
    for (let j = 0; j < GRID_SIZE; j++) {
      const tile = {
        x: j,
        y: i,
        mine: false,
        revealed: false
      }
      row.push(tile)
    }
    grid.push(row)
  }
  return populateGrid(grid, GRID_MINES)
}

export function revealTile(grid, tile) {
  const tiles = []
  tile.revealed = true

  tile.value = 0
  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const checkTile = grid[tile.y + yOffset]?.[tile.x + xOffset]
      if (checkTile === undefined) continue
      if (checkTile.mine) tile.value++
    }
  }
  if (!tile.value) {
    for (let xOffset = -1; xOffset <= 1; xOffset++) {
      for (let yOffset = -1; yOffset <= 1; yOffset++) {
        const checkTile = grid[tile.y + yOffset]?.[tile.x + xOffset]
        if (checkTile === undefined) continue
        if (checkTile.revealed) continue
        tiles.push(...revealTile(grid, checkTile))
      }
    }
  }
  tiles.push(tile)
  return tiles
}

function populateGrid(grid, mines) {
  for (let i = mines; i > 0; i--) {
    const row = randomIntegerRange(0, grid.length - 1)
    const tile = randomIntegerRange(0, grid.length - 1)
    const isAlreadyMine = grid[row][tile].mine === true
    isAlreadyMine ? i++ : (grid[row][tile].mine = true)
  }
  return grid
}

function randomIntegerRange(min, max) {
  return Math.floor(Math.random() * max + min)
}
