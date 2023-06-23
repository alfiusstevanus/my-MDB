// menggunakan jquery

// $('.search-btn').on('click', function(){
//     $.ajax({
//         url: 'http://www.omdbapi.com/?apikey=8ff73e25&s=' + $('.keyword').val(),
//         success: results => {
//             const movies = results.Search
//             let cards = '';
//             movies.forEach(m => {
//                 cards += showCards(m)
//             });
//             $('.movie-container').html(cards)

//             // ketika tombol show details di klik

//             $('.modal-detail-btn').on('click', function(){
//                 $.ajax({
//                     url: 'http://www.omdbapi.com/?apikey=8ff73e25&i=' + $(this).data('imdb'),
//                     success: m => {
//                         const movieDetail = showMovieDetail(m)
//                     $('.modal-body').html(movieDetail)
//                     },
//                     error: (e) => {
//                         console.log(e.responseText)
//                     }
//                 })
//             })
//         },
//         error: (e) => {
//             console.log(e.responseText)
//         }
//     })
// })

// dengan vanila javascript
// const searchBtn = document.querySelector('.search-btn')
// searchBtn.addEventListener('click', function(){
//     const keyword = document.querySelector('.keyword')

//     fetch('http://www.omdbapi.com/?apikey=8ff73e25&s=' + keyword.value)
//     .then(response => response.json())
//     .then(response => {
//         const movies = response.Search
//         let cards = ''
//         movies.forEach(m => cards += showCards(m))
//         const movieContainer = document.querySelector('.movie-container')
//         movieContainer.innerHTML = cards

//         //ketika tombol detail diklik
//         const modalDetailBtn = document.querySelectorAll('.modal-detail-btn')
//         modalDetailBtn.forEach(btn => {
//             btn.addEventListener('click', function(){
//                 const imdbId = this.dataset.imdb
//                 fetch('http://www.omdbapi.com/?apikey=8ff73e25&i=' + imdbId)
//                 .then(response => response.json())
//                 .then(m => {
//                     const movieDetail = showMovieDetail(m)
//                     const modalBody = document.querySelector('.modal-body')
//                     modalBody.innerHTML = movieDetail
//                 })
//             })
//         });
//     })
// })

// refactoring
const searchBtn = document.querySelector('.search-btn')
searchBtn.addEventListener('click',  async function(){
    try {
        const keyword = document.querySelector('.keyword')
        const movies = await getMovies(keyword.value)
        updateUI(movies)        
    } catch (error) {
        alert(error)
    }
})


function getMovies(keyword){
    return fetch('http://www.omdbapi.com/?apikey=8ff73e25&s=' + keyword)
    .then(response => {
        if(!response.ok){
            throw new Error(response.statusText)
        }
        return response.json()
    })
    .then(response => {
        if(response.Response === "False"){
            throw new Error(response.Error)
        }
        return response.Search
    })
}

function updateUI(movies){
    let cards = ''
    movies.forEach(m => cards += showCards(m))
    const movieContainer = document.querySelector('.movie-container')
    movieContainer.innerHTML = cards
}



// event binding
document.addEventListener('click',async function(e){
    if(e.target.classList.contains('modal-detail-btn')){
        const imdbId = e.target.dataset.imdb
        const movieDetail = await getMovieDetail(imdbId)
        updateUIDetail(movieDetail)
    }
})

function getMovieDetail(imdbID){
    return fetch('http://www.omdbapi.com/?apikey=8ff73e25&i=' + imdbID)
    .then(response => response.json())
    .then(m => m)
}

function updateUIDetail(m){
    const movieDetail = showMovieDetail(m)
    const modalBody = document.querySelector('.modal-body')
    modalBody.innerHTML = movieDetail
}


function showCards(m){
    return `<div class="col-md-4 my-3">
                <div class="card" style="width: 18rem;">
                    <img src="${m.Poster}" alt="Poster film '${m.Title} (${m.Year})' tidak tersedia!" class="card-img-top" alt="">
                    <div class="card-body">
                        <h5 class="card-title">${m.Title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${m.Year}</h6>
                        <a href="#" class="btn btn-primary modal-detail-btn" data-bs-toggle="modal" data-bs-target="#movieDetailModal" data-imdb="${m.imdbID}">Show Details</a>
                    </div>
                </div>
            </div>`
}

function showMovieDetail(m){
    return `<div class="container-fluid">
                <div class="row">
                    <div class="col-md-3">
                        <img src="${m.Poster}" alt="Poster film '${m.Title} (${m.Year})' tidak tersedia!" class="img-fluid">
                    </div>
                    <div class="col-md">
                        <ul class="list-group">
                            <li class="list-group-item">
                                <h4>${m.Title} (${m.Year})</h4>
                            </li>
                            <li class="list-group-item"><strong>Director: </strong> ${m.Director}</li>
                            <li class="list-group-item"><strong>Actors: </strong> ${m.Actors}</li>
                            <li class="list-group-item"><strong>Writer: </strong> ${m.Writer}</li>
                            <li class="list-group-item"><strong>Plot: </strong> ${m.Plot}</li>
                        </ul>
                    </div>
                </div>
            </div>`
}