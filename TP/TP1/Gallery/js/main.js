

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

	let imagesPath = []
	imagesPath.push("images/image1.jpg")
	imagesPath.push("images/image5.jpg")
	imagesPath.push("images/image2.jpg")
	imagesPath.push("images/image4.png")
	imagesPath.push("images/image3.jpg")


	Animation.init(myCanvas, imagesPath)

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
	
	static #actualIndex = 0
	static #allImage = []

	static #centerOffset = 0
	static #lastIncrement = 0


	//This method must be called once to initialize all the images
	static init(canvas, allImagesPath){

		//Load all images
		allImagesPath.forEach(element =>{
			Animation.addImage(element)
		});

	}

	//To update the animation with the elapsed time
	static update(canvas, elapsedTime){

		if(moving == false){
			if(Math.abs(this.#lastIncrement) > slipperyMaxValue){

				let step
				if(this.#lastIncrement < 0){
				
					this.#lastIncrement += slipperyResistance * elapsedTime
					if(this.#lastIncrement > 0) this.#lastIncrement = 0
					this.#centerOffset += this.#lastIncrement
				
				}
				else{
				
					this.#lastIncrement -= slipperyResistance * elapsedTime
					if(this.#lastIncrement < 0) this.#lastIncrement = 0
					this.#centerOffset += this.#lastIncrement
				
				}

				if(this.#actualIndex == 0 && this.#centerOffset > 0){
					this.#centerOffset = 0
				}
				else if(this.#actualIndex == this.#allImage.length-1 && this.#centerOffset < 0){
					this.#centerOffset = 0
				}

			}
			
			if(this.#centerOffset != 0){

				if(Math.abs(this.#centerOffset) > canvas.width/2){

					let step
					if(this.#centerOffset < 0){
						step = 1
					}
					else{
						step = -1
					}

					this.#centerOffset += canvas.width * step
					this.#actualIndex += step

				}

			}

			if(Math.abs(this.#lastIncrement) <= slipperyMaxValue){

				//(elapsedTime/0.016667) is a calcul to get how much frame have passed since the last update
				this.#centerOffset *= refocusingSpeed / (elapsedTime/0.016667)

				if(Math.abs(this.#centerOffset) < 1) this.#centerOffset = 0


			}

		}


	}

	//The main drawing function
	static draw(canvas){


		let canvas2dContext = canvas.getContext("2d")

		canvas2dContext.clearRect(0, 0, canvas.width, canvas.height);
		
		Animation.drawImage(canvas, this.#actualIndex, 	this.#centerOffset)
		Animation.drawImage(canvas, this.#actualIndex - 1,	this.#centerOffset - canvas.width)
		Animation.drawImage(canvas, this.#actualIndex + 1,	this.#centerOffset + canvas.width)

	}

	/*
		This function draw an image from the allImage array at the index "index"
		on the canvas "canvas"with an X offset of "generalOffset".
	*/
	static drawImage(canvas, index, generalOffset){

		if(index < 0) return;
		if(index == this.#allImage.length) return;

		let tempoImage = this.#allImage[index]

		let windowWidth = canvas.width
		let windowHeight = canvas.height

		let imageWidth = tempoImage.naturalWidth
		let imageHeight = tempoImage.naturalHeight


		let diff = windowWidth / imageWidth
		let ratio = imageWidth / imageHeight

		let finalWidth = windowWidth
		///To add black edge
		//let finalWidth = windowWidth * 0.87
		let finalHeight = imageHeight * finalWidth / imageWidth

		let offsetX
		let offsetY

		if(finalHeight > windowHeight){

			finalHeight = windowHeight
			finalWidth = imageWidth * finalHeight / imageHeight

			offsetY = 0

			offsetX = (windowWidth - finalWidth) / 2

		}
		else{

			offsetX = 0
			///To add black edge
			//offsetX = (windowWidth * 0.13)/2.0


			offsetY = (windowHeight - finalHeight) / 2


		}

		canvas.getContext("2d").drawImage(tempoImage, 	0, 0, tempoImage.naturalWidth, tempoImage.naturalHeight,
												offsetX + generalOffset, offsetY, finalWidth, finalHeight)

	}

	//To add an image, there is not limit
	static addImage(pathToImage){

		var newImage = document.createElement("img")
		newImage.src = pathToImage;

		this.#allImage.push(newImage)

	}

	//When the mouse move, get the offset
	static movingMouse(canvas, offsetX){

		let increment

		//The next two if statement are for the elasticity effect on edge
		if(this.#actualIndex == 0 && this.#centerOffset > 0){
			
			let dist = ((canvas.width/4) - Math.abs(this.#centerOffset))/(canvas.width/4)

			increment = offsetX * dist

		}
		else if(this.#actualIndex == this.#allImage.length-1 && this.#centerOffset < 0){
			
			let dist = ((canvas.width/4) - Math.abs(this.#centerOffset))/(canvas.width/4)

			increment = offsetX * dist

		}
		else{
			increment = offsetX
		}


		this.#centerOffset += increment
		this.#lastIncrement = increment

	}
	

} //End Class Animation