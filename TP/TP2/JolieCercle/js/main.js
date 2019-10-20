

//Constant Value for the whole program
const speed = 0.9

//Default value = 40, you can cut the slipping effect by puttin a very big value like 10000
const slipperyMaxValue = 40

//Default value = 120
const slipperyResistance = 120

//Default value = 0.85, this value must be bewteen 0 and 1.
//Nearer it get from 0, faster it go
const refocusingSpeed = 0.85


//Global variable
let myCanvas = document.createElement("canvas")
let lastTime = 0

let moving = false
let actualPositionX = 0


//When the page is loaded start main
window.addEventListener("load", event => {

	window.addEventListener("resize", resize)
	main();

});


//For the tactile compatibility we have to do two mouse down/touch start event
const onMouseDown = event => {

	event.preventDefault()

	moving = true

	actualPositionX = event.clientX

}

const onTouchStart = event => {

	event.preventDefault()

	moving = true

	actualPositionX = event.changedTouches[0].clientX

}

const onMouseUp = event => {

	moving = false

}

//For the tactile compatibility we have to do two move event function
const onMouseMoving = event => {

	event.preventDefault()

	if(moving){

		Animation.movingMouse(myCanvas, event.clientX - actualPositionX)

		actualPositionX = event.clientX

	}

}

const onTouchMoving = event => {

	event.preventDefault()

	if(moving){

		Animation.movingMouse(myCanvas, event.changedTouches[0].clientX - actualPositionX)

		actualPositionX = event.changedTouches[0].clientX

	}

}


const resize = event => {

	myCanvas.width = window.innerWidth
	myCanvas.height = window.innerHeight

}

const findCircle = (x1, y1, x2, y2, x3, y3) =>{

	let finalX = 0
	let finalY = 0


	let top = (x3*x3 - x2*x2 + y3*y3 - y2*y2) / (2*(y3 - y2)) - (x2*x2 - x1*x1 + y2*y2 - y1*y1) / (2*(y2 - y1))

	let bot = ((x3 - x2) / (y3 - y2)) - ((x2 - x1) / (y2 - y1))

	finalX = (top / bot)

	finalY = -((x2 - x1)/(y2 - y1))*finalX + ( (x2*x2 - x1*x1 + y2*y2 - y1*y1) / (2*(y2 - y1)) )


	let finalRayon = Math.sqrt((x1 - finalX)*(x1 - finalX) + (y1 - finalY)*(y1 - finalY))

	//console.log("X : ", finalX, " Y : ", finalY, " Rayon : ", finalRayon)
	return [finalX, finalY, finalRayon]

}


const main = event => {

	document.body.appendChild(myCanvas)
	myCanvas.width = window.innerWidth
	myCanvas.height = window.innerHeight
	myCanvas.style.backgroundColor = "#000000"

	//Cumputer with mouse
	myCanvas.addEventListener("mousedown", onMouseDown)
	myCanvas.addEventListener("mouseup", onMouseUp)
	myCanvas.addEventListener("mousemove", onMouseMoving)

	//Tactile device
	myCanvas.addEventListener("touchstart", onTouchStart)
	myCanvas.addEventListener("touchend", onMouseUp)
	myCanvas.addEventListener("touchmove", onTouchMoving)


	Animation.init(myCanvas)

	let circleValue = findCircle(0, 10, 5, -6, 7, 63)

	Animation.setCircle(circleValue[0], circleValue[1], circleValue[2])


	//I don't give 0 as the first time avoid a division by 0
	graphicLoop(0.0001);

}


//Animation part

const graphicLoop = time => {

	let elapsedTime = (time - lastTime)/1000.0
	lastTime = time

	requestAnimationFrame(graphicLoop)

	Animation.update(myCanvas, elapsedTime)
	Animation.draw(myCanvas)

} 

class Animation {

	static #circleX = 0
	static #circleY = 0
	static #rayon = 0
	

	//This method must be called once to initialize all the images
	static init(canvas){


	}

	//To update the animation with the elapsed time
	static update(canvas, elapsedTime){



	}

	static setCircle(cX, cY, r){

		this.#circleX = cX
		this.#circleY = cX
		this.#rayon = r

	}

	//The main drawing function
	static draw(canvas){


		let canvas2dContext = canvas.getContext("2d")

		canvas2dContext.clearRect(0, 0, canvas.width, canvas.height);

		canvas2dContext.fillStyle = "rgb(200,0,0)"
		canvas2dContext.strokeStyle = "rgb(200,0,0)"

		canvas2dContext.beginPath()

		canvas2dContext.arc(this.#circleX, this.#circleY, this.#rayon, 0, 2 * Math.PI, false);
	
		canvas2dContext.closePath()

		canvas2dContext.stroke()

	}


	//When the mouse move, get the offset
	static movingMouse(canvas, offsetX){

	}
	

} //End Class Animation