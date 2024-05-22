// Select Element

let countSpan = document.querySelector(".count span")

let spansContainer = document.querySelector(".spans-contanier")

let quizArea = document.querySelector(".quiz-area")

let answerArea = document.querySelector(".answer-area")

let submitButton = document.querySelector(".submit-button")

let resultsContainer = document.querySelector(".result")

let bullets = document.querySelector(".bullets")


let countDownElement = document.querySelector(".count-down")
// Setting Option

let currentIndex = 0

let rightAnswer = 0

let countDownInterval;

function getQuestion() {

	let myRequest = new XMLHttpRequest()

	myRequest.onreadystatechange = function () {
		if (this.readyState === 4 && this.status === 200) {
			// console.log(this.responseText)
			let questionObject = JSON.parse(this.responseText)
			console.log(questionObject)
			let qCount = questionObject.length
			createBullets(qCount)

			// Add Question  Data
			addQuestionData(questionObject[currentIndex], qCount)

			countDown(3, qCount)

			submitButton.onclick = function () {


				let theRightAnswer = questionObject[currentIndex].right_answer
				// console.log(rightAnswer)

				currentIndex++


				checkAnswer(theRightAnswer, qCount)

				quizArea.innerHTML = ""

				answerArea.innerHTML = ""


				addQuestionData(questionObject[currentIndex], qCount)

				handleBullets()
				clearInterval(countDownInterval)
				countDown(3, qCount)
				showResult(qCount)
			}
		}
	}
	myRequest.open("Get", "html_question.json", true)
	myRequest.send()
}

getQuestion()


// Create Bullets Depend questionObject.length

function createBullets(num) {
	countSpan.innerHTML = num

	for (let i = 0; i < num; i++) {
		let theBullets = document.createElement("span")

		if (i === 0) {
			theBullets.className = "on"
		}
		spansContainer.appendChild(theBullets)
	}
}

// Create Function addQuestionData

function addQuestionData(obj, count) {

	if (currentIndex < count) {
		// Create Heading (Title Of Question)

		let title = document.createElement("h2")

		// Create TextTitle Of Question

		let textTitle = document.createTextNode(`${obj.title}`)
		// console.log(tmp)

		title.appendChild(textTitle)

		quizArea.appendChild(title)

		// To Create Answer Area


		for (let i = 1; i <= 4; i++) {

			// Create Div (Answer)
			// console.log(i)

			let mainDiv = document.createElement("div")
			mainDiv.className = "answer"

			let answerInput = document.createElement("input")

			answerInput.type = "radio"
			answerInput.id = `answer_${i}`
			answerInput.name = "question"
			answerInput.dataset.answer = obj[`answer_${i}`]
			mainDiv.appendChild(answerInput)
			// console.log(answerInput)



			if (i === 1) {
				answerInput.checked = true
			}


			// Create Label

			let labelAnswer = document.createElement("label")
			let labelText = document.createTextNode(obj[`answer_${i}`])
			labelAnswer.appendChild(labelText)
			labelAnswer.htmlFor = `answer_${i}`
			mainDiv.appendChild(labelAnswer)

			answerArea.appendChild(mainDiv)

		}
	}
}


function checkAnswer(rAnswer, qCount) {
	let answers = document.getElementsByName("question")
	let chosenAnswer
	for (let i = 0; i < answers.length; i++) {

		if (answers[i].checked) {
			chosenAnswer = answers[i].dataset.answer
			// console.log(chosenAnswer)
		}
	}

	if (chosenAnswer === rAnswer) {
		rightAnswer++
		console.log("Good Answer")
	}
}



function handleBullets() {
	let bulletsSpan = document.querySelectorAll(".bullets span")
	let arrayOfSpan = Array.from(bulletsSpan)

	arrayOfSpan.forEach((span, index) => {
		if (currentIndex === index) {
			span.className = "on"
		}
	})
}



function showResult(count) {
	let theResults;
	if (currentIndex === count) {
		quizArea.remove()
		answerArea.remove()
		submitButton.remove()
		bullets.remove()

		if (rightAnswer > (count / 2) && rightAnswer < count) {

			theResults = `<span class="good">Good</span>, ${rightAnswer} From ${count}`


		} else if (rightAnswer === count) {

			theResults = `<span class ="perfect">Perfect</span>, All Answer Is Good`
		} else {
			theResults = `<span class ="bad">Bad</span>, ${rightAnswer} From ${count}`
		}
		resultsContainer.innerHTML = theResults
	}
}



function countDown(duration, count) {

	if (currentIndex < count) {

		let minutes, seconds

		countDownInterval = setInterval(function () {

			minutes = parseInt(duration / 60)

			seconds = parseInt(duration % 60)

			minutes = minutes < 10 ? `0${minutes}` : minutes
			seconds = seconds < 10 ? `0${seconds}` : seconds


			countDownElement.innerHTML = `${minutes}:${seconds}`

			if (--duration < 0) {
				clearInterval(countDownInterval)
				submitButton.click()
			}
		}, 1000)
	}
}