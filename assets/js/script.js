function fetchSwapi(endpoint) {
	fetch(endpoint)
		.then(function (response) {
			console.log(response);
			return response.json();
		})
		.then(function (data) {
			console.log(data);
		});
}
function fetchOmdb() {
	var apiKey = "7da1d0ba";
	var apiUrl = `http://www.omdbapi.com/?s=star+wars&apikey=${apiKey}`;
	fetch(apiUrl)
		.then(function (response) {
			console.log(response);

			console.log(omdbtoSwapi[0]);
			return response.json();
		})
		.then(function (data) {
			console.log(data);
			console.log(data.Search[0]);
		});
}
fetchOmdb();

// Function to fetch data from SWAPI
function fetchSwapi(character) {
	var swapiUrl = `https://swapi.dev/api/people/?search=${encodeURIComponent(
		character
	)}`;

	return fetch(swapiUrl)
		.then((response) => response.json())
		.then((data) => {
			console.log("SWAPI Data:", data);

			displayCharacterImage(
				data.results[0].name,
				`https://starwars-visualguide.com/assets/img/characters/${data.results[0].url.match(
					/\d+/
				)}.jpg`
			);
		});
}

var charImgtext = document.getElementById("characterImageContainer");
var charLight = document.getElementById("lightcharChoice");
var charDark = document.getElementById("darkcharChoice");
let charNames = [];
const names = ["birth_year", "films", "homeworld", "starships", "vehicles"];

// ------------------------------------------------------------Function to fetch data from SWAPI---------------------------------------------
var nameofCharacter;
var charDetails;
var characterSide;
var charImage;
async function fetchSwapi(character, side) {
	try {
		const swapiUrl = `https://swapi.dev/api/people/?search=${encodeURIComponent(
			character
		)}`;
		const response = await fetch(swapiUrl);
		const data = await response.json();
		console.log(`${side} SWAPI Data:`, data);

		var previousSearch = $("<button>")
			.attr("class", "button is-12 is-white is-outlined my-1 mx-1 is-centered")
			.text(character);
		$("#pastSearches").append(previousSearch);

		// search for a previous character when it's button is clicked
		previousSearch.click(function () {
			const previousCharacter = character; // Use the character name from the button text
			if (previousCharacter) {
				// Retrieve character details from local storage
				var storedCharacterData =
					JSON.parse(localStorage.getItem("character details")) || [];
				const characterDetails = storedCharacterData.find(
					(character) => character.name === previousCharacter
				);

				if (characterDetails) {
					// Use the retrieved character details
					const characterDetails = characterData.details;
					console.log(
						"Using character details from local storage:",
						characterDetails
					);
				} else {
					console.error("Character details not found in local storage.");
				}
			} else {
				console.error("Previous character not found.");
			}
		});

		// Extract film URLs from SWAPI response
		const filmUrls = data.results[0]?.films || [];

		// Fetch film data using the film URLs
		const films = await Promise.all(
			filmUrls.map((filmUrl) =>
				fetch(filmUrl).then((response) => response.json())
			)
		);

		// Extract homeworld URL from SWAPI response
		const homeworldUrl = data.results[0]?.homeworld;

		// Fetch homeworld data using the homeworld URL
		const homeworldResponse = await fetch(homeworldUrl);
		const homeworld = await homeworldResponse.json();
		console.log(homeworld);

		// Extract species URL from SWAPI response
		const speciesUrls = data.results[0]?.species || [];

		// Fetch species data using the species URLs
		const species = await Promise.all(
			speciesUrls.map((speciesUrl) =>
				fetch(speciesUrl).then((response) => response.json())
			)
		);
		console.log(species);

		// Extract character details
		const characterDetails = {
			birth_year: data.results[0]?.birth_year,
			hair_color: data.results[0]?.hair_color,
			eye_color: data.results[0]?.eye_color,
			skin_color: data.results[0]?.skin_color,
			gender: data.results[0]?.gender,
			height: data.results[0]?.height,
			mass: data.results[0]?.mass,
			homeworld: homeworld?.name,
			species: species.map((specie) => specie.name),
			films: films.map((film) => film.title),
		};

		// Storing character details to local storage
		var storedCharacterData = JSON.parse(
			localStorage.getItem("character details") || "[]"
		);
		// Create an object containing both the character name and details
		var characterData = {
			name: character,
			details: characterDetails,
		};
		storedCharacterData.push(characterData);
		localStorage.setItem(
			"character details",
			JSON.stringify(storedCharacterData)
		);

		console.log("Character Details:", characterDetails);

		nameofCharacter = data.results[0]?.name;
		charDetails = characterDetails;
		characterSide = side;
		charImage = `https://starwars-visualguide.com/assets/img/characters/${data.results[0]?.url.match(
			/\d+/
		)}.jpg`;
	} catch (error) {
		console.error(`Error fetching ${side} side character data:`, error);
	}
}

// // create a button for each previously searched character
// var previousSearch = $("<button>")
// 	.attr("class", "button is-12 is-primary is-rounded is-outlined my-1")
// 	.text(character);
// $("#pastSearches").append(previousSearch);

// // search for a previous character when it's button is clicked
// previousSearch.click(function () {
// 	fetchSwapi($(this).text());
// });

// ---------------------------------------------------------Function to fetch data from OMDB API
async function fetchOmdb(character, side) {
	try {
		const omdbApiKey = "24f8ea01";
		let data;

		// Check if data exists before making the fetch request
		if (character) {
			const omdbUrl = `https://www.omdbapi.com/?s=${character}&apikey=${omdbApiKey}`;
			const response = await fetch(omdbUrl);
			data = await response.json();
			console.log(`${side} OMDB Data:`, data);
		} else {
			console.log("Character is not defined. Skipping OMDB fetch.");
			return;
		}

		// Determine the correct container ID based on the side
		const containerId =
			side === "light" ? "lightSideExtraMovies" : "darkSideExtraMovies";
		const containerElement = document.getElementById(containerId);
		if (side === "light") {
			$("#lightSideExtraMoviesContainer").removeClass("is-hidden");
			$(".invisible-placeholder").addClass("is-hidden");
		} else {
			$("#darkSideExtraMoviesContainer").removeClass("is-hidden");
		}

		// Clear the container before appending new content
		containerElement.innerHTML = "";

		// Check if there is an error message
		if (!data || data.Error) {
			containerElement.innerHTML = "<p>No extra movies</p>";
			if (data && data.Error) {
				console.log(data.Error);
			}
		} else {
			// Append each movie to the container
			for (let i = 0; i < data.Search.length; i++) {
				var extraMovies = `<p id="h3" class="has-text-left px-2">Movie: <a href="https://www.imdb.com/title/${data.Search[i].imdbID}/" target="_blank">${data.Search[i].Title}</a></p><p id="h3" class="has-text-left px-2">Year: ${data.Search[i].Year}</p> <p id="h3" class="has-text-left px-2">Type: ${data.Search[i].Type}</p> <hr>`;
				containerElement.insertAdjacentHTML("beforeend", extraMovies);
				console.log(data);
			}
		}
	} catch (error) {
		console.error(
			`Error fetching ${side} side character data from OMDB:`,
			error
		);
	}
}
/////--------------------------------------------Display Character Image-----------------------------------------------
// Function to display character image
function displayCharacterImage(selectedCharacter, charImage, side) {
	let movieNumber = movieId.replace("movie", "");
	let characterImage = document.getElementById(
		`${side}CharacterImage${movieNumber}`
	);

	if (!characterImage) {
		console.error(`Error: #${side}CharacterImage not found in the HTML.`);
		return;
	}

	if (charImage) {
		characterImage.src = charImage;
		characterImage.alt = `${selectedCharacter} Poster`;
	} else {
	}
}
/////--------------------------------------------Display Character Details -----------------------------------------------
function displayCharacterDetails(selectedCharacter, details, side) {
	let movieNumber = movieId.replace("movie", "");
	let detailsContainer = document.getElementById(
		`${side}FactsContainer${movieNumber}`
	);

	if (!detailsContainer) {
		console.error(`Error: #${side}FactsContainer not found in the HTML.`);
		return;
	}

	// Created a details container
	const detailsElement = document.createElement("div");
	detailsElement.classList.add("content");

	// For the character name
	const nameParagraph = document.createElement("p");
	nameParagraph.id = "h3";
	nameParagraph.innerHTML = `<strong>Name:</strong> ${selectedCharacter}`;
	detailsElement.appendChild(nameParagraph);

	for (const key in details) {
		if (Array.isArray(details[key])) {
			const listParagraph = document.createElement("p");
			listParagraph.id = "h3";
			listParagraph.innerHTML = `<strong>${
				key.charAt(0).toUpperCase() + key.slice(1)
			}:</strong> ${details[key].join(", ")}`;
			detailsElement.appendChild(listParagraph);
		} else if (key === "eye_color") {
			var eyeColor = "eye_color";
			var formattedEyeColor = eyeColor.replace("_", " ");
			formattedEyeColor =
				formattedEyeColor.charAt(0).toUpperCase() + formattedEyeColor.slice(1);

			const eyeColorParagraph = document.createElement("p");
			eyeColorParagraph.id = "h3";
			eyeColorParagraph.innerHTML = `<strong>${formattedEyeColor}:</strong> ${details[key]}`;
			detailsElement.appendChild(eyeColorParagraph);
		} else if (key === "hair_color") {
			var hairColor = "hair_color";
			var formattedHairColor = hairColor.replace("_", " ");
			formattedHairColor =
				formattedHairColor.charAt(0).toUpperCase() +
				formattedHairColor.slice(1);

			const hairColorParagraph = document.createElement("p");
			hairColorParagraph.id = "h3";
			hairColorParagraph.innerHTML = `<strong>${formattedHairColor}:</strong> ${details[key]}`;
			detailsElement.appendChild(hairColorParagraph);
		} else if (key === "birth_year") {
			var birthYear = "birth_year";
			var formattedBirthYear = birthYear.replace("_", " ");
			formattedBirthYear =
				formattedBirthYear.charAt(0).toUpperCase() +
				formattedBirthYear.slice(1);

			const birthYearParagraph = document.createElement("p");
			birthYearParagraph.id = "h3";
			birthYearParagraph.innerHTML = `<strong>${formattedBirthYear}:</strong> ${details[key]}`;
			detailsElement.appendChild(birthYearParagraph);
		} else if (key === "skin_color") {
			var skinColor = "skin_color";
			var formattedSkinColor = skinColor.replace("_", " ");
			formattedSkinColor =
				formattedSkinColor.charAt(0).toUpperCase() +
				formattedSkinColor.slice(1);

			const skinColorParagraph = document.createElement("p");
			skinColorParagraph.id = "h3";
			skinColorParagraph.innerHTML = `<strong>${formattedSkinColor}:</strong> ${details[key]}`;
			detailsElement.appendChild(skinColorParagraph);
		} else {
			// For other details
			const detailParagraph = document.createElement("p");
			detailParagraph.id = "h3";
			detailParagraph.innerHTML = `<strong>${
				key.charAt(0).toUpperCase() + key.slice(1)
			}:</strong> ${details[key]}`;
			detailsElement.appendChild(detailParagraph);
		}
	}

	detailsContainer.innerHTML = "";

	// Append the details to the container
	detailsContainer.appendChild(detailsElement);
}

// Function to handle the character selection
async function selectCharacter(selectedCharacter, side) {
	try {
		// Call back fetchSwapi
		await fetchSwapi(selectedCharacter, side);

		// Call back fetchOmdb
		await fetchOmdb(selectedCharacter, side);

		// Display character details
		displayCharacterDetails(nameofCharacter, charDetails, characterSide);
		//display character image
		displayCharacterImage(nameofCharacter, charImage, characterSide);
	} catch (error) {
		console.error("Error selecting character:", error);
	}
}

///------------------------------------Event listener that listens for click on movie selector--------------------------------
var movieId;
$("#episodeChoice1").on("click", "img", function () {
	var posterClicked = this.parentNode.id;
	console.log(posterClicked);

	// Hide all movies
	$("#characterChoice .columns").addClass("is-hidden");

	// Show extra movies
	$("#extras").removeClass("is-hidden");

	// Show the movie that corresponds to the clicked poster
	movieId = "movie" + posterClicked.replace("Ep", "");
	console.log(movieId);
	$("#" + movieId).removeClass("is-hidden");

	// Show character choice
	$("#characterChoice").removeClass("is-hidden");
});
