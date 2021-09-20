function setScroll() {
	let scrollTop = matchText.scrollTop 
    matchResult.scrollTop = scrollTop
}

function init() {
	matchInput.value = "re."
    replaceInput.value = "666"
	matchRegex()
}

function getFlags() {
	let flags = ""
	if (ignoreCase.checked) {
		flags += "i"
	}
	if (global.checked) {
		flags += "g"
	}
	if (mutiple.checked) {
		flags += "m"
	}
	if (sticky.checked) {
		flags += "y"
	}
	if (unicode.checked) {
		flags += "u"
	}
	if (dotAll.checked) {
		flags += "s"
	}
	return flags
}

function matchRegex() {
	let flags = getFlags()
	let regexValue = matchInput.value
	if (regexValue === "") {
		matchResult.innerHTML = ""
		return
	}
	let regex = new RegExp(regexValue, flags)
	const inputText = matchText.value
	let matchResultHTML = ""
	let replaceResultHTML = ""
	let lastIndex = 0
	let match = null
	while ((match = regex.exec(inputText))) {
		let text = inputText.slice(lastIndex, match.index)
		matchResultHTML += text
		matchResultHTML += "<em>" + match[0] + "</em>"
		if (replaceInput.value !== "") {
			replaceResultHTML += text
			replaceResultHTML += "<em>" + replaceInput.value + "</em>"
		}
		lastIndex = match.index + match[0].length
		if (match[0] === "") {
			regex.lastIndex++
			lastIndex = regex.lastIndex - 1
		}
		if (!regex.global) {
			break
		}
	}
	let lastText = inputText.slice(lastIndex)
	matchResultHTML += lastText
	matchResult.innerHTML = matchResultHTML + "\n" // 多加一个回车是为了处理div元素比textarea元素少一个回车
	if (replaceResultHTML !== "") {
		replaceResultHTML += lastText
		replaceResult.innerHTML = replaceResultHTML + "\n"
	} else {
		replaceResult.innerHTML = matchText.innerHTML
	}
}

let matchInput = document.querySelector("#matchInput")
let matchText = document.querySelector("#matchText")
let matchResult = document.querySelector("#matchResult")
let replaceInput = document.querySelector("#replaceInput")
let replaceResult = document.querySelector("#replaceResult")

init()


