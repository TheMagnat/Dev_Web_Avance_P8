


//When the page is loaded start main
window.addEventListener("load", event => {

	window.addEventListener("resize", resize)
	main();

});

let dataBase



const resize = event => {


}

const generateOneFake = () => {

	let obj = { firstName : faker.name.firstName(),
				lastName : faker.name.lastName(),
				country : faker.address.country(),
				age : Math.floor(Math.random()*50 + 1),
				gender : Math.random() > 0.1 ? "women" : "men"
	}

	return obj

}

const generateFakeTab = () => {

	tab = []

	for(let i = 0; i < 500; ++i){

		tab.push(generateOneFake())

	}

	return tab

}

const moreThanN = async (users, n) => {

	await sleep(500)

	return users.filter(element => {

		return element.age > n

	})

}

async function sleep(ms){

	//console.log("sleep :", ms)

	let callback, prom = new Promise((resolve, reject) => callback = resolve);

	setTimeout(callback, ms);

	return prom;


}

const forEachAsync = async (tab, func) => {

	let callback, prom = new Promise((resolve, reject) => callback = resolve);

	let actualWorkingIndex = 0

	tab.forEach(async (element, index) => {
		
		while(actualWorkingIndex != index){
			await sleep(200)
		}

		await func(element)

		++actualWorkingIndex

		//We can comment this
		console.log("Done for :", index)

		if(index == tab.length - 1){
			callback()
		}

	})

	return prom

}

const showElementAndSleep1Sec = async element => {

	let prom = new Promise(async (resolve, reject) => {
		console.log(element)
		await sleep(1000)
		resolve()
	});

	return prom

}

const main = async event => {

	dataBase = generateFakeTab()

	await forEachAsync(tab, showElementAndSleep1Sec)

	console.log("forEachAsync is Done !")

}
