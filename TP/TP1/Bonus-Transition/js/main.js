

//Constant Value for the whole program
const numberOfRectX = 12
const numberOfRectY = 8
const speed = 2
const propagationSpeed = 1000

const shadowOffsetX = 10
const shadowOffsetY = 10
const shadowColor = 'rgba(0, 0, 0, 0.2)'

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
	imagesPath.push("images/image3.jpg")


	Animation.init(myCanvas, imagesPath)


	graphicLoop(0);

}


//Animation part

const graphicLoop = time => {

	let elapsedTime = (time - lastTime)/1000.0
	lastTime = time

	console.log(elapsedTime)

	requestAnimationFrame(graphicLoop)

	Animation.update(elapsedTime)
	Animation.draw(myCanvas)

} 

class Animation {
	
	static #moving = false
	static #actualIndex = 0
	static #allImage = []
	static #rectsPercent = []

	//This method must be called once to initialize the array
	static init(canvas, allImagesPath){

		//Initialize the array of percentage
		this.#rectsPercent.length = numberOfRectX * numberOfRectY
		this.#rectsPercent.fill(0)

		//Load all images
		allImagesPath.forEach(element =>{
			Animation.addImage(element)
		});

	}

	//To update the animation with the elapsed time
	static update(elapsedTime){

		let finished = true

		this.#rectsPercent = this.#rectsPercent.map(element => {
			let newPercentValue = Math.max(element -= speed * elapsedTime, 0)
			if(newPercentValue > 0) finished = false
			return newPercentValue
		});

		this.#moving = !finished

	}

	//The main drawing function
	static draw(canvas){


		let canvas2dContext = canvas.getContext("2d")

		//Not clearing allow us to save the old image when the new one is drawn
		//canvas2dContext.clearRect(0, 0, canvas.width, canvas.height);
		
		let tempoImage = this.#allImage[this.#actualIndex]

		let windowStepWidth = window.innerWidth / numberOfRectX
		let windowStepHeight = window.innerHeight / numberOfRectY

		let imageStepWidth = tempoImage.naturalWidth / numberOfRectX
		let imageStepHeight = tempoImage.naturalHeight / numberOfRectY

		//Comment this double for loop to remove the shadows
		for(let i = 0; i < numberOfRectY; ++i){

			for(let j = 0; j < numberOfRectX; ++j){

				let tempoPercent = Math.min(this.#rectsPercent[i * numberOfRectX + j], 0.5)

				canvas2dContext.fillStyle = shadowColor;
				canvas2dContext.fillRect((j * windowStepWidth) + windowStepWidth * (tempoPercent) + shadowOffsetX,
										(i * windowStepHeight) + windowStepHeight * (tempoPercent) + shadowOffsetY,
										windowStepWidth - 2 * (windowStepWidth * (tempoPercent)),
										windowStepHeight - 2 * (windowStepHeight * (tempoPercent)));


			}

		}


		for(let i = 0; i < numberOfRectY; ++i){

			for(let j = 0; j < numberOfRectX; ++j){

				let tempoPercent = Math.min(this.#rectsPercent[i * numberOfRectX + j], 0.5)
				
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

		//this test can be removed according to what you prefer
		if(this.#moving) return
		this.#moving = true

		++this.#actualIndex
		if(this.#actualIndex >= this.#allImage.length){
			this.#actualIndex = 0
		}


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
		

		this.#rectsPercent = this.#rectsPercent.map((element, index) =>{

			///-Here
			//let rectX = index%numberOfRectX
			//let rectY = (index - rectX)/numberOfRectX

			let centerRectX = index%numberOfRectX + 0.5
			let centerRectY = (index - centerRectX)/numberOfRectX

			///-Here (Also comment the other dist)
			//let dist = Math.sqrt(Math.pow(indexClickedRectX - rectX, 2) + Math.pow(indexClickedRectY - rectY, 2))
			let dist = Math.sqrt(Math.pow(mousePositionX - centerRectX * window.innerWidth/numberOfRectX, 2) + Math.pow(mousePositionY - centerRectY*window.innerHeight / numberOfRectY, 2))

			///-Here (If you try the first option you should put a lower propagation speed like 20 or 15)
			return 0.5 + dist/propagationSpeed

		});

	}
	

} //End Class Animation