

//Constant Value for the whole program
const numberOfRectX = 12
const numberOfRectY = 8
const speed = 1.1
const propagationSpeed = 1300

const shadowOffsetX = 7
const shadowOffsetY = 7
const shadowColor = 'rgba(20, 20, 80, 0.6)'


//Global variable
let myCanvas = document.createElement("canvas")
let lastTime = 0


//When the page is loaded start main
window.addEventListener("load", event => {

	window.addEventListener("resize", resize)
	main();

});



const onClick = event => {
	
	Animation.clicked(event.clientX, event.clientY)

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
	myCanvas.addEventListener("click", onClick)


	let imagesPath = []
	imagesPath.push("images/image1.jpg")
	imagesPath.push("images/image2.jpg")

	Animation.init(myCanvas, imagesPath)


	graphicLoop(0);

}

//Function utile
const greaterThan0 = a => {
	return a > 0
}

const lowerThan0p5 = a => {
	return a < 0.5
}

//Animation part

const graphicLoop = time => {

	let elapsedTime = (time - lastTime)/1000.0
	lastTime = time

	requestAnimationFrame(graphicLoop)

	Animation.update(elapsedTime)
	Animation.draw(myCanvas)

} 

class Animation {
	
	static #direction = -1	
	static #allImage = []
	static #rectsAutorisationPlus = []
	static #rectsAutorisationMinus = []
	static #rectsPercent = []

	//This method must be called once to initialize the array
	static init(canvas, allImagesPath){

		//Initialize the array of percentage
		this.#rectsPercent.length = numberOfRectX * numberOfRectY
		this.#rectsPercent.fill(0)

		this.#rectsAutorisationPlus.length = numberOfRectX * numberOfRectY
		this.#rectsAutorisationPlus.fill(0)
		
		this.#rectsAutorisationMinus.length = numberOfRectX * numberOfRectY
		this.#rectsAutorisationMinus.fill(0)

		//Load all images
		allImagesPath.forEach(element =>{
			Animation.addImage(element)
		});

	}

	//To update the animation with the elapsed time
	static update(elapsedTime){


		this.#rectsPercent = this.#rectsPercent.map((element, index) => {

			let usingDirection

			this.#rectsAutorisationPlus[index] -= speed * elapsedTime
			this.#rectsAutorisationPlus[index] = Math.max(this.#rectsAutorisationPlus[index], 0.0)

			this.#rectsAutorisationMinus[index] -= speed * elapsedTime
			this.#rectsAutorisationMinus[index] = Math.max(this.#rectsAutorisationMinus[index], 0.0)

			//It's a priotiry system based on the current direction
			if(this.#rectsAutorisationPlus[index] == 0.0 && this.#rectsAutorisationMinus[index] == 0.0){

				usingDirection = this.#direction

			}
			else if(this.#rectsAutorisationPlus[index] == 0.0){

				usingDirection = 1

			}
			else if(this.#rectsAutorisationMinus[index] == 0.0){

				usingDirection = -1

			}
			else{

				return element
			
			}
			
			let newPercentValue = Math.min(Math.max(element + (speed * elapsedTime) * usingDirection, 0), 0.5)
			
			return newPercentValue

		});


	}

	//The main drawing function
	static draw(canvas){


		let canvas2dContext = canvas.getContext("2d")
		
		canvas2dContext.drawImage(this.#allImage[1], 0, 0, this.#allImage[1].naturalWidth, this.#allImage[1].naturalHeight, 0, 0, canvas.width, canvas.height)

		let tempoImage = this.#allImage[0]

		let windowStepWidth = canvas.width / numberOfRectX
		let windowStepHeight = canvas.height / numberOfRectY

		let imageStepWidth = tempoImage.naturalWidth / numberOfRectX
		let imageStepHeight = tempoImage.naturalHeight / numberOfRectY

		//Comment this double for loop to remove the shadows
		for(let i = 0; i < numberOfRectY; ++i){

			for(let j = 0; j < numberOfRectX; ++j){

				let tempoPercent = this.#rectsPercent[i * numberOfRectX + j]

				canvas2dContext.fillStyle = shadowColor;
				canvas2dContext.fillRect((j * windowStepWidth) + windowStepWidth * (tempoPercent) + shadowOffsetX,
										(i * windowStepHeight) + windowStepHeight * (tempoPercent) + shadowOffsetY,
										windowStepWidth - 2 * (windowStepWidth * (tempoPercent)),
										windowStepHeight - 2 * (windowStepHeight * (tempoPercent)));


			}

		}

		for(let i = 0; i < numberOfRectY; ++i){

			for(let j = 0; j < numberOfRectX; ++j){

				let tempoPercent = this.#rectsPercent[i * numberOfRectX + j]

				
				canvas2dContext.drawImage(tempoImage,	//Image
														(j * imageStepWidth) + imageStepWidth * tempoPercent,
														(i * imageStepHeight) + imageStepHeight * tempoPercent,
														imageStepWidth - 2*(imageStepWidth * tempoPercent),
														imageStepHeight - 2*(imageStepHeight * tempoPercent),
														//Ecran
														(j * windowStepWidth) + windowStepWidth * tempoPercent,
														(i * windowStepHeight) + windowStepHeight * tempoPercent,
														windowStepWidth - 2 * (windowStepWidth * tempoPercent),
														windowStepHeight - 2 * (windowStepHeight * tempoPercent));
			
			}

		}


	}

	//To add an image, there is not limit
	static addImage(pathToImage){

		var newImage = document.createElement("img")
		newImage.src = pathToImage;

		this.#allImage.push(newImage)

	}

	//When a click is received on the canvas
	static clicked(mousePositionX, mousePositionY){

		this.#direction *= -1

		/* 	
			There is two way to calculate the distance from the click,
			you can find the index of the targeted rectangle and calculate the distance
			between each rectangle based on their index, Or take the true position of the mouse and take
			the center position of the rectangle to calculate the distance. I prefer the second one,
			it look more fluid to me but you can uncomment all the lines with ///-Here before to see the other option.
		*/

		///-Here
		//let indexClickedRectX = Math.floor(mousePositionX / (window.innerWidth / numberOfRectX))
		//let indexClickedRectY = Math.floor(mousePositionY / (window.innerHeight / numberOfRectY))
		

		//Maybe for loop here instead ?
		this.#rectsPercent.forEach((element, index) =>{

			///-Here
			//let rectX = index%numberOfRectX
			//let rectY = (index - rectX)/numberOfRectX

			let centerRectX = index%numberOfRectX + 0.5
			let centerRectY = (index - centerRectX)/numberOfRectX

			///-Here (Also comment the other dist)
			//let dist = Math.sqrt(Math.pow(indexClickedRectX - rectX, 2) + Math.pow(indexClickedRectY - rectY, 2))
			let dist = Math.sqrt(Math.pow(mousePositionX - centerRectX * window.innerWidth/numberOfRectX, 2) + Math.pow(mousePositionY - centerRectY*window.innerHeight / numberOfRectY, 2))

			///-Here (If you try the first option you should put a lower propagation speed like 20 or 15)
			if(this.#direction == 1){
				//This test verify if the rectangle isn't already animated in this direction
				if(this.#rectsAutorisationPlus[index] == 0){
					this.#rectsAutorisationPlus[index] = dist/propagationSpeed
				}
			}
			else{
				if(this.#rectsAutorisationMinus[index] == 0){
					this.#rectsAutorisationMinus[index] = dist/propagationSpeed
				}
			}
			

		});

	}
	

} //End Class Animation