function onInput() {
	lineTickness.value = lineRange.value
}

function notify(e) {
	if (!saved) {
		return (e.returnValue = "文件还没有保存，确定退出？")
	}
}

function undo() {
	if (paint.children.length) {
		let lastElement = paint.lastElementChild
		nextArray.push([lastElement])
		lastElement.remove()
	} else if (nextArray.length) {
		let elem = nextArray.pop()
		nextArray.push(elem)
		elem.forEach((it) => paint.append(it))
	}
}

function undoByKey(e) {
	if (e.ctrlKey && e.key === "z") {
		undo()
	}
}

function undoByClick(e) {
	if (e.button === 0) {
		undo()
	}
}

function next() {
	if (nextArray.length) {
		let elem = nextArray.pop()
		undoArray.push(elem)
		elem.forEach((it) => paint.append(it))
	}
}

function nextByClick(e) {
	if (e.button === 0) {
		next()
	}
}

function reset(e) {
	if (e.button === 0) {
		try {
			nextArray.push(Array.from(paint.children))
			Array.prototype.forEach.call(paint.children, (it) => it.remove())
			clearAll += 1
		} catch (e) {
			console.log(e.message)
		}
	}
}

function selectTool(e) {
	let target = e.target
	if (target.classList.contains("pan")) {
		currentTool = "pen"
	} else if (target.classList.contains("line")) {
		currentTool = "line"
	} else if (target.classList.contains("zhengfangxing")) {
		currentTool = "square"
	} else if (target.classList.contains("changfangxing")) {
		currentTool = "rect"
	}
}

function selectColor(e) {
	if (e.button === 0 && e.target.tagName === "LI") {
		lastColor = currentColor
		if (lastColor.classList.contains("color-selected")) {
			lastColor.classList.remove("color-selected")
		}
		currentColor = e.target
		currentColor.classList.add("color-selected")
	}
}

function addEventListenerForDraw(tool) {
	function once(e) {
		if (e.button === 0) {
			document.removeEventListener("mousemove", tool)
			document.removeEventListener("mouseup", once)
		}
	}
	document.addEventListener("mousemove", tool)
	document.addEventListener("mouseup", once)
}

function onMouseDown(e) {
	if (e.button === 0 && paint.contains(e.target)) {
		saved = false
		draw()
	}
}

function getMousePoint(e, elem) {
	let box = elem.getBoundingClientRect()
	return {
		x: e.pageX - box.left,
		y: e.pageY - box.top,
	}
}

function draw() {
	if (currentTool === "pen") {
		function drawPolyline(e) {
			let point = getMousePoint(e, paint)
			let svgPoint = " " + point.x + "," + point.y
			points += svgPoint
			polyline.setAttribute("points", `${points}`)
		}
		let points = ""
		let polyline = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"polyline"
		)
		polyline.setAttribute("fill", "none")
		polyline.setAttribute("stroke", currentColor.style.backgroundColor)
		polyline.setAttribute("stroke-width", lineTickness.value)
		polyline.setAttribute("stroke-linecap", "round")
		polyline.setAttribute("stroke-linejoin", "round")
		paint.append(polyline)
		addEventListenerForDraw(drawPolyline)
	} else if (currentTool === "line") {
		function drawLine(e) {
			let point = getMousePoint(e, paint)
            line.setAttribute("x2", point.left)
            line.setAttribute("y2", point.top)
		}
        let startPos = getMousePoint(e, paint)
		let line = document.createElementNS("http://www.w3.org/2000/svg", "line")
        line.setAttribute("x1", startPos.left)
        line.setAttribute("y1", startPos.top)
		line.setAttribute("fill", currentColor.style.backgroundColor)
		line.setAttribute("stroke-width", lineTickness.value)
        paint.append(line)
        addEventListenerForDraw(drawLine)
	} else if (currentTool === "ellipse") {
	} else if (currentTool === "circle") {
	}
}

function openFile() {
	debugger
	let file = fileInput.files[0]
	console.log(file)
	let fr = new FileReader()
	fr.addEventListener("load", () => {
		paintContainer.innerHTML = fr.result
		console.log(paintContainer.innerHTML)
		paint = paintContainer.querySelector("svg")
		paint.setAttribute("version", "1.1")
		paint.setAttribute("xmlns", "http://www.w3.org/2000/svg")
	})
	fr.readAsText(file)
}

function upload() {
	if (!saved) {
		let answer = confirm("文件还没有保存，确定要打开新文件？")
		if (!answer) {
			return
		}
	}
	fileInput.click()
}

function download(e) {
	if (e.button === 0) {
		let svgSrc = paint.outerHTML
		let blob = new Blob(["<?xml version='1.0' encoding='utf-8'?>", svgSrc], {
			type: "image/xml+svg",
		})
		let url = URL.createObjectURL(blob)
		let anchor = document.createElement("a")
		anchor.download = "paint.svg"
		anchor.href = url
		anchor.click()
		saved = true
	}
}

let lineRange = document.querySelector("#range")
let lineTickness = document.querySelector("#tickness")
let tools = document.querySelector(".tools")
let undoBtn = document.querySelector(".icon-fanhui")
let nextBtn = document.querySelector(".icon-xiayibu")
let penBtn = document.querySelector(".icon-pan_icon-copy")
let colorscheme = document.querySelector(".colorscheme")
let resetBtn = document.querySelector(".icon-huifu")
let fileInput = document.querySelector("input[type='file']")
let uploadBtn = document.querySelector(".icon-shangchuan")
let downloadBtn = document.querySelector(".icon-xiazai")
let header = document.querySelector("header")
let aside = document.querySelector("aside")
let paint = document.querySelector("svg")
let paintContainer = document.querySelector(".paint-container")

let lastTool = "pen"
let currentTool = "pen"
let lastColor = colorscheme.lastElementChild
let currentColor = lastColor
let undoArray = []
let nextArray = []
let clearAll = 0
let saved = true

paint.setAttribute("version", "1.1")
paint.setAttribute("xmlns", "http://www.w3.org/2000/svg")

window.addEventListener("beforeunload", notify)
document.addEventListener("keydown", undoByKey)
lineRange.addEventListener("input", onInput)
tools.addEventListener("click", selectTool)
colorscheme.addEventListener("click", selectColor)
paintContainer.addEventListener("mousedown", onMouseDown)
undoBtn.addEventListener("click", undoByClick)
nextBtn.addEventListener("click", nextByClick)
resetBtn.addEventListener("click", reset)
fileInput.addEventListener("change", openFile)
uploadBtn.addEventListener("click", upload)
downloadBtn.addEventListener("click", download)
