class Point {
	constructor(rowIdx, colIdx) {
		this.rowIdx = rowIdx
		this.colIdx = colIdx
	}
}

class World {
	constructor(row = 32, col = 32) {
		this.row = row
		this.col = col
		this.worldArray = new Array(row)
			.fill(0)
			.map((it) => (it = new Array(col).fill(" ")))
		this.init()
	}

	init() {
		for (let i = 0; i < this.row; i++) {
			for (let j = 0; j < this.col; j++) {
				if (i === 0 || j === 0 || i === this.row - 1 || j === this.col - 1) {
					this.worldArray[i][j] = "#"
				}
			}
		}
	}

	getWorld(rowIdx, colIdx) {
		return this.worldArray[rowIdx][colIdx]
	}

	setWorld(rowIdx, colIdx, value) {
		this.worldArray[rowIdx][colIdx] = value
	}
}

class Food {
	constructor(world) {
		this.rowIdx = null
		this.colIdx = null
		this.world = world
        this.init()
	}

	init() {
		this.setFood()
	}

	setFood() {
		while (99) {
			let randomX = parseInt(Math.random() * (this.world.row - 1)),
				randomY = parseInt(Math.random() * (this.world.col - 1))
			this.rowIdx = randomX
			this.colIdx = randomY
			if (this.world.getWorld(randomX, randomY) === " ") {
				this.world.setWorld(randomX, randomY, "*")
				break
			}
		}
	}

	removeFood() {
		this.world.setWorld(this.rowIdx, this.colIdx, " ")
	}

	reset() {
		this.removeFood()
		this.setFood()
	}
}

class Snake {
	constructor(world, food) {
		this.world = world
		this.food = food
		this.snakeArray = []
		this.init()
	}

	init() {
		let rowIdx = this.world.row >> 1
		let colIdx = this.world.col >> 1
		this.snakeArray.push(new Point(rowIdx, colIdx))
		this.snakeArray.push(new Point(rowIdx, colIdx - 1))
		this.snakeArray.push(new Point(rowIdx, colIdx - 2))
		this.world.setWorld(rowIdx, colIdx, "@")
		this.world.setWorld(rowIdx, colIdx - 1, "=")
		this.world.setWorld(rowIdx, colIdx - 2, "=")
	}

	addPoint(rowIdx, colIdx) {
		let snakeHead = this.snakeArray[0]
		let newSnakeHead = new Point(rowIdx, colIdx)
		this.snakeArray.unshift(newSnakeHead)
		this.world.setWorld(newSnakeHead.rowIdx, newSnakeHead.colIdx, "@")
		this.world.setWorld(snakeHead.rowIdx, snakeHead.colIdx, "=")
	}

	removePoint() {
		let tail = this.snakeArray.pop()
		this.world.setWorld(tail.rowIdx, tail.colIdx, " ")
	}

	move(action) {
		let snakeHead = this.snakeArray[0]
		let rowIdx = snakeHead.rowIdx,
			colIdx = snakeHead.colIdx
		if (action === "Up") {
			rowIdx--
		} else if (action === "Down") {
			rowIdx++
		} else if (action === "Left") {
			colIdx--
		} else if (action === "Right") {
			colIdx++
		}
		let nextPointValue = this.world.getWorld(rowIdx, colIdx)
		if (nextPointValue === "#" || nextPointValue === "=") {
			return false
		} else if (nextPointValue === "*") {
			this.food.setFood()
		} else {
			this.removePoint()
		}
		this.addPoint(rowIdx, colIdx)
		return true
	}
}

class SnakeGame {
	constructor(world, snake, food) {
		this.world = world
		this.snake = snake
		this.food = food
		this.action = "Right"
	}

	setFood() { this.food.setFood()
	}

	setAction(action) {
		this.action = action
	}

	next() {
		return this.snake.move(this.action)
	}

	reset() {
		this.world.init()
		this.food.setFood()
		this.snake.init()
	}

	toString() {
		return this.world.worldArray
			.map((row) => {
				return row.join("")
			})
			.join("\n")
	}

	print() {
		console.log(this.toString())
	}
}

function whatKey(e) {
	if (
		e.key === "ArrowUp" ||
		e.key === "ArrowDown" ||
		e.key === "ArrowLeft" ||
		e.key === "ArrowRight"
	) {
		game.setAction(e.key.slice(5))
	}
}

function render() {
	snakeArray = Array.from(game.snake.snakeArray)
	curFoodPos = new Point(game.food.rowIdx, game.food.colIdx)

	table.rows[lastFoodPos.rowIdx].cells[lastFoodPos.colIdx].classList.remove("food")
	lastSnakeArray.forEach((it) => {
		let td = table.rows[it.rowIdx].cells[it.colIdx]
		td.classList.remove("snake")
	})

	snakeArray.forEach((it) => {
		let td = table.rows[it.rowIdx].cells[it.colIdx]
		td.classList.add("snake")
	})
	table.rows[food.rowIdx].cells[food.colIdx].classList.add("food")

	lastFoodPos = curFoodPos
	lastSnakeArray = snakeArray
}

function startGame() {
	console.log("start game")
	game.setFood()
	timeId = setInterval(() => {
		let val = game.next.bind(game)()
		if (!val) {
			stopGame()
            alert('game over')
			throw new Error("game over")
		}
		render()
		// game.print()
	}, 500)
}

function stopGame() {
	clearInterval(timeId)
}

function setWall() {
    let row = world.row
    let col = world.col
    Array.prototype.forEach.call(table.rows[0].cells, it => it.classList.add('wall'))
    Array.prototype.forEach.call(table.rows[row - 1].cells, it => it.classList.add('wall'))
    Array.prototype.forEach.call(table.rows, it => {
        it.cells[0].classList.add('wall')
        it.cells[col - 1].classList.add('wall')
    })
}

let world = new World()
let food = new Food(world)
let snake = new Snake(world, food)
let game = new SnakeGame(world, snake, food)
let timeId = null
let table = document.querySelector("table")
let lastFoodPos = new Point(food.rowIdx, food.colIdx)
let curFoodPos = lastFoodPos
let lastSnakeArray = Array.from(snake.snakeArray);
let curSnakeArray = lastSnakeArray

document.addEventListener("keydown", whatKey)
setWall()
startGame()
