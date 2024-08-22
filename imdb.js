//Api Key foe Omdb API
const apiKey = 'a6c243dc';
// Get elements from HTML
const input = document.getElementById('input');
const searchResult = document.getElementById('search-result');
const search = document.getElementById('search');
const displayresult = document.getElementById('display-result');
let noImage = document.createElement('img');
noImage.src = "No-image-found.jpg"
const logo = document.getElementById('logo');
logo.addEventListener('click',firstPage);

let inputData;

// Function to display first page of movies
async function firstPage() {
    // Fetch data from OMDB API
    const response = await fetch(`https://omdbapi.com/?s=lord&apikey=${apiKey}`);
    const data = await response.json();
    if (data.Response) {
        // Clear display result div
        displayresult.innerHTML= "";
        // Create h1 element with text "All Movies"
        const h1 = document.createElement('h1');
        h1.innerText = "All Movies";
        displayresult.appendChild(h1);
        // Display data in display result div
        displayData(data.Search, displayresult);
    }
}

// Function to search for movies
async function searchMovies() {
    if (input.value.trim() == "" || input.value.trim() == null || input.value.trim() == undefined) {
        return
    }
    // Fetch data from OMDB API
    const response = await fetch(`https://omdbapi.com/?s=${input.value.trim()}&apikey=${apiKey}`);
    const data = await response.json();
    if (data.Response) {
        // Clear search result div
        searchResult.innerHTML = "";
        // Store search data in inputData variable
        inputData = data.Search;
        // Show search result div
        searchResult.style.display = 'block';

        // Display data in search result div
        displayData(data.Search, searchResult);
    }
}

// Function to get movie details from OMDB API
async function getImdbDetail(imdbID) {
    const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`);
    const data = await response.json();
    return data;
}

// Function to display movie data
function displayData(data, div) {
    // Loop through each movie in data
    data.forEach(element => {
        // Create main div for each movie
        let mainDiv = document.createElement('div');
        mainDiv.id = element.imdbID;
        // Create info div for each movie
        let info = document.createElement('div');
        let detail = document.createElement('div');
        // Add classes to info and detail divs based on whether it's a search result or display result
        if (div == searchResult) {
            info.classList.add("search-info");
            detail.classList.add("search-detail");

            info.classList.remove("display-info");
            detail.classList.remove("display-detail");
        } else {
            info.classList.remove("search-info");
            detail.classList.remove("search-detail");

            info.classList.add("display-info");
            detail.classList.add("display-detail");
        }

        // Create image element for each movie
        let image = document.createElement('img');
        if (element.Poster != 'N/A') {
            image.src = element.Poster;
        } else {
            image.src = noImage.src;
        }

        // Create name element for each movie
        let name = document.createElement('h3');
        name.innerText = element.Title;

        // Add image and name to info div
        info.appendChild(image);
        info.appendChild(name);

        // Create type and year elements for each movie
        
        let type = document.createElement('p');
        type.innerText = element.Type;

        let year = document.createElement('p');
        year.innerText = element.Year;

        mainDiv.appendChild(info);

        // Add favourite button to main div if it's a display result
        if (detail.classList.contains("display-detail")) {
            let favourite = document.createElement('i');
            favourite.id = element.imdbID;
            let id = -1;
            // Check if movie is already in favourites
            for (i in localStorage) {
                if (i == 'id') {
                    continue;
                }
                if (localStorage[i] == mainDiv.id) {
                    id = mainDiv.id
                    break;
                }
            }
            if (id == -1) {

                favourite.classList.add("fa-regular");
                favourite.classList.add("fa-star");
                favourite.classList.add("fa-2x");
                favourite.classList.add("favourite");

            } else {
                favourite.classList.add("fa-solid");
                favourite.classList.add("fa-star");
                favourite.classList.add("fa-2x");
                favourite.classList.add("favourite");
                favourite.classList.add('checked');
            }

            mainDiv.appendChild(favourite);
        }

        // Add type and year to detail div
        detail.appendChild(type);
        detail.appendChild(year);



        mainDiv.appendChild(detail);





        div.appendChild(mainDiv);

        // Add event listener to info div to navigate to movie page
        info.addEventListener('click', () => {
            // movieDiv(mainDiv.id);
            localStorage.setItem('id', mainDiv.id);
            window.location.href = 'movie.html';


        });

    });
    // Add event listener to favourite buttons
    const fav = document.querySelectorAll(".favourite");
    fav.forEach(f => {
        f.addEventListener('click', () => {
            if (f.classList.contains('checked')) {
                removeFromFav(f.id);
            } else {
                addtofav(f.id);
            }
            let id = -1;
            for (i in localStorage) {
                if (i == 'id') {
                    continue;
                }
                if (localStorage[i] == f.id) {
                    id = f.id
                    break;
                }
            }
            if (id == -1) {

                f.classList.add("fa-regular");
                f.classList.remove('fa-solid');
                f.classList.remove('checked');
            } else {
                f.classList.add("fa-solid");
                f.classList.add('checked');
                f.classList.remove('fa-regular');
            }
        });

    });

    
    // Add event listener to search button
    search.addEventListener('click', () => {
        if (input.value.trim() == null || input.value.trim() == "" || input.value.trim() == undefined) {
            return;
        }
        if (inputData != null || inputData != "" || inputData != undefined) {
            displayresult.innerHTML = "";
            searchResult.style.display = 'none';
            if (div == displayresult && inputData != null && inputData != "" && inputData != undefined) {
                const h1 = document.createElement('h1');
                h1.innerText = `Showing results for "${document.getElementById('input').value}"`
                div.appendChild(h1);
            }
            document.getElementById('input').value = "";
            displayData(inputData, displayresult);
        } else {
            return;
        }
    });

    // Add event listener to input field to search on enter key press
    input.addEventListener('keypress', () => {
        if (event.key === 'Enter') {
            if (input.value.trim() == null || input.value.trim() == "" || input.value.trim() == undefined) {
                return;
            }
            if (inputData != null || inputData != "" || inputData != undefined) {
                displayresult.innerHTML = "";
                searchResult.style.display = 'none';
                if (div == displayresult && inputData != null && inputData != "" && inputData != undefined) {
                    const h1 = document.createElement('h1');
                    h1.innerText = `Showing results for "${document.getElementById('input').value}"`
                    div.appendChild(h1);
                }
                document.getElementById('input').value = "";
                displayData(inputData, displayresult);
            } else {
                return;
            }
        }
    });
}


// Function to add movie to favourites
function addtofav(favId) {

    localStorage.setItem(Math.random().toString(36).slice(2, 7), favId);// math.random for the unique key and value pair
    alert('Movie Added to Watchlist!');

}

// Function to remove movie from favourites
function removeFromFav(favId) {
    console.log(favId);
    for (i in localStorage) {
        // If the ID passed as argument matches with value associated with key, then removing it 
        if (localStorage[i] == favId) {
            const userConfirmed = window.confirm("Do you want to remove movie from Watchlist");

            if (userConfirmed) {
                // User clicked 'OK' (yes)
                localStorage.removeItem(i);
                alert('Movie Removed from Watchlist');
                favDiv();
                break;
            } else {
                // User clicked 'Cancel' (no)
                return;
            }

        }
    }
}




// Function to display favourite movies
async function favDiv() {
    const div = document.getElementById('fav');
    if (div) {
        div.innerHTML = "";
    }
    for (i in localStorage) {
        if (i == 'id') {
            continue;
        }
        let id = localStorage.getItem(i);

        
        if (id != null) {
            const data = await getImdbDetail(id);
            if (data.Response == 'True') {
                console.log(data);
                const innerDiv = document.createElement('div');
                const detail = document.createElement('div');
                detail.classList.add('detail');
                const image = document.createElement('img');
                image.id = data.imdbID;
                if (data.Poster == 'N/A') {
                    image.src = noImage.src;
                } else {
                    image.src = data.Poster;


                }
                innerDiv.appendChild(image);


                const title = document.createElement('h3');
                title.innerText = data.Title;

                detail.appendChild(title);


                const rating = document.createElement('p');
                rating.innerText = `IMDB Rating: ${data.imdbRating}`;
                detail.appendChild(rating);

                const year = document.createElement('p');
                year.innerText = `Year: ${data.Year}`;
                detail.appendChild(year);

                innerDiv.appendChild(detail);

                const remove = document.createElement('i');
                remove.classList.add('fa-solid');
                remove.classList.add('fa-trash');
                remove.id = data.imdbID;
                remove.style.color = "red";
                innerDiv.appendChild(remove);

                if (div) {

                    div.appendChild(innerDiv);
                }
            }
        }


    }

    if (div) {
        const remove = div.querySelectorAll('i');
        remove.forEach(rem => {
            rem.addEventListener('click', () => {
                removeFromFav(rem.id);
            })
        });

        const image = div.querySelectorAll('img');
        image.forEach(image => {
            image.addEventListener('click', () => {
                localStorage.setItem('id', image.id);
                window.location.href = 'movie.html';
            });
        });
    }
}

// Function to display movie details
async function movieDiv() {
    const movieDetail = document.getElementById('movie-detail');
    if (movieDetail) {
        movieDetail.innerHTML = "";
    }
    let imdbID;
    for (i in localStorage) {
        if (i == 'id') {
            imdbID = localStorage.getItem(i);
        }
    }
    if (imdbID != null) {
        const data = await getImdbDetail(imdbID);
        if (data.Response) {
            console.log(data);
            const innerDiv = document.createElement('div');
            const image = document.createElement('img');
            if (data.Poster == 'N/A') {
                image.src = noImage.src;
            } else {
                image.src = data.Poster;
            }
            innerDiv.appendChild(image);

            const detail = document.createElement('div');

            const actors = document.createElement('p');
            actors.innerHTML = `<strong>Actors:</strong> ${data.Actors}`;
            detail.appendChild(actors);

            const director = document.createElement('p');
            director.innerHTML = `<strong>Director:</strong> ${data.Director}`;
            detail.appendChild(director);

            const genre = document.createElement('p');
            genre.innerHTML = `<strong>Genre:</strong> ${data.Genre}`;
            detail.appendChild(genre);

            const title = document.createElement('h1');
            title.innerHTML = data.Title;

            movieDetail.appendChild(title);


            const rating = document.createElement('p');
            rating.innerHTML = `<strong>Rating:</strong> ${data.imdbRating}`;
            detail.appendChild(rating);

            const year = document.createElement('p');
            year.innerHTML = `<strong>Released On:</strong> ${data.Released}`;
            detail.appendChild(year);


            const type = document.createElement('p');
            type.innerHTML = `<strong>Type:</strong> ${data.Type}`;
            detail.appendChild(type);

            const rated = document.createElement('p');
            rated.innerHTML = `<strong>Rated:</strong> ${data.Rated}`;
            detail.appendChild(rated);



            innerDiv.appendChild(detail);




            const plot = document.createElement('h3');
            plot.innerText = data.Plot;
            innerDiv.appendChild(plot);








            const favourite = document.createElement('i');
            favourite.id = imdbID;
            let id = -1;
            for (i in localStorage) {
                if (i == 'id') {
                    continue;
                }
                // If the ID passed as argument matches with value associated with key, then removing it 
                if (localStorage[i] == imdbID) {
                    id = imdbID
                    break;
                }
            }
            if (id == -1) {

                favourite.classList.add("fa-regular");
                favourite.classList.add("fa-star");
                favourite.classList.add("fa-2x");
                favourite.classList.add("favourite");

            } else {
                favourite.classList.add("fa-solid");
                favourite.classList.add("fa-star");
                favourite.classList.add("fa-2x");
                favourite.classList.add("favourite");
                favourite.classList.add('checked');
            }

            innerDiv.appendChild(favourite);
            movieDetail.appendChild(innerDiv);

            favourite.addEventListener('click', () => {
                if (favourite.classList.contains('checked')) {
                    removeFromFav(favourite.id);
                } else {
                    addtofav(favourite.id);
                }
                let id = -1;
                for (i in localStorage) {
                    if (i == 'id') {
                        continue;
                    }
                    // If the ID passed as argument matches with value associated with key, then removing it 
                    if (localStorage[i] == imdbID) {
                        id = imdbID
                        break;
                    }
                }
                if (id == -1) {

                    favourite.classList.add("fa-regular");
                    favourite.classList.remove('fa-solid');
                    favourite.classList.remove('checked');
                } else {
                    favourite.classList.add("fa-solid");
                    favourite.classList.add('checked');
                    favourite.classList.remove('fa-regular');
                }

            });
        }
    }


}
