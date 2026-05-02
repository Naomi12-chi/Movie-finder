const searchInput = document.getElementById("moviesearch");
const searchBtn = document.getElementById("moviesubmit");
const message = document.getElementById("message");
const results = document.getElementById("results");
const details = document.getElementById("details");

function searchMovie() {
  let movie = searchInput.value.trim();

  if (movie === "") {
    message.textContent = "please enter a movie name.";
    return;
  }

  message.textContent = "searching..";
  results.innerHTML = "";
  details.innerHTML = "";

  let URL = `https://www.omdbapi.com/?apikey=b5f728b1&s=${movie}`;

  fetch(URL)
    .then(response => response.json())
    .then(data => {
      if (!data.Search) {
        message.textContent = "No movies found.";
        return;
      }

      message.textContent = "";

      data.Search.forEach(movie => {
        results.innerHTML += `
          <div class="movie-card" data-id="${movie.imdbID}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
            ${movie.Poster !== "N/A" ? `<img src="${movie.Poster}">` : ""}
            <a href="https://www.google.com/search?q=${movie.Title} watch movie" target="_blank">
              Watch Movie
            </a>
          </div>
        `;
      });

      const cards = document.querySelectorAll(".movie-card");

      cards.forEach(card => {
        card.addEventListener("click", (event) => {
          if (event.target.tagName === "A") return;

          const id = card.dataset.id;
          const detailUrl = `https://www.omdbapi.com/?apikey=b5f728b1&i=${id}`;
          details.innerHTML = "Loading...";

          fetch(detailUrl)
            .then(response => response.json())
            .then(data => {
              details.innerHTML = `
                <div class="details-card">
                  <h2>${data.Title}</h2>

                  ${data.Poster !== "N/A" 
                    ? `<img src="${data.Poster}">` 
                    : `<p>No image available</p>`}

                  <p><strong>Year:</strong> ${data.Year}</p>
                  <p><strong>Genre:</strong> ${data.Genre}</p>
                  <p><strong>Actors:</strong> ${data.Actors}</p>
                  <p><strong>Plot:</strong> ${data.Plot}</p>
                </div>
              `;

              details.scrollIntoView({ behavior: "smooth" });
            })
            .catch(() => {
              details.innerHTML = "Failed to load details.";
            });
        });
      });
    })
    .catch(() => {
      message.textContent = "Something went wrong. Try again.";
    });

  searchInput.value = "";
}

searchBtn.addEventListener("click", searchMovie);

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchMovie();
  }
});