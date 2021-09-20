class Conway {
	constructor(row, col, updateFreq = 500) {
		this.row = row
		this.col = col
		this.world = new Array(row)
		this.updateFreq = updateFreq
		this.timeId = null
		this.stop = null

		for (let i = 0; i < row; i++) {
			this.world[i] = new Array(col).fill(0)
		}
	}

	inWorld(rowIndex, colIndex) {
		return (
			0 <= rowIndex &&
			rowIndex < this.row &&
			0 <= colIndex &&
			colIndex < this.col
		)
	}

	get(rowIndex, colIndex) {
		if (this.inWorld(rowIndex, colIndex)) {
			return this.world[rowIndex][colIndex]
		}
	}

	set(rowIndex, colIndex, value) {
		if (this.inWorld(rowIndex, colIndex)) {
			this.world[rowIndex][colIndex] = value
		}
	}

	getArround(rowIndex, colIndex) {
		let count = 0
		for (let i = rowIndex - 1; i <= rowIndex + 1; i++) {
			for (let j = colIndex - 1; j <= colIndex + 1; j++) {
				if (this.get(i, j) === 1) {
					count++
				}
			}
		}
		return count - parseInt(this.get(rowIndex, colIndex))
	}

	judge(rowIndex, colIndex) {
		let count = this.getArround(rowIndex, colIndex)
		if (this.get(rowIndex, colIndex) === 1) {
			if (count < 2 || count > 3) {
				return 0
			}
		} else {
			if (count === 3) {
				return 1
			}
		}
	}

	next() {
		for (let i = 0; i < this.row; i++) {
			for (let j = 0; j < this.col; j++) {
				let val = this.judge(i, j)
				let originVal = this.get(i, j)
				if (val != undefined && val !== originVal) {
					this.set(i, j, val)
					let td = table.rows[i].cells[j]
					if (val === 1) {
						td.classList.add("selected")
					} else {
						td.classList.remove("selected")
					}
				}
			}
		}
	}

	start() {
		if (this.stop === true || this.stop === null) {
			this.timeId = setInterval(this.next.bind(this), this.updateFreq)
			this.stop = false
		}
	}

	pause() {
		if (this.stop === false) {
			clearInterval(this.timeId)
			this.stop = true
		}
	}

	getPosition(elem) {
		let tdWidth = parseInt(getComputedStyle(table.rows[0].cells[0]).width) + 2 //最后加上单元格边框的宽度
		let targetRect = elem.getBoundingClientRect(),
			tableRect = table.getBoundingClientRect()
		let colIndex = Math.ceil((targetRect.left - tableRect.left) / tdWidth) - 1,
			rowIndex = Math.ceil((targetRect.top - tableRect.top) / tdWidth) - 1
		return [rowIndex, colIndex]
	}
}

let table = document.querySelector("table")

let trNum = table.rows.length,
	tdNum = table.rows[1].cells.length

let conway = new Conway(trNum, tdNum)

let start = conway.start.bind(conway),
	pause = conway.pause.bind(conway),
	next = conway.next.bind(conway)

table.onclick = function (event) {
	let target = event.target
	if (target.tagName === "TD") {
		target.classList.add("selected")
		let [rowIndex, colIndex] = conway.getPosition(target)
		conway.set(rowIndex, colIndex, 1)
	}
}
