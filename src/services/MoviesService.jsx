class MoviesServiсe {
    _apiBase = 'https://api.themoviedb.org/3';
    _apiKey = 'api_key=8eced43ec762e9d1e554a330c5db0774';
    _defaultSearch = 'return';

  getResource = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
  }

  searchMovie = async (page, query = '') => {
    const searchQuery = query || this._defaultSearch;
    const res = await this.getResource(`${this._apiBase}/search/movie?${this._apiKey}&query=${searchQuery}&page=${page}&language=en-US`);
    return {
        movies: this._transformMovies(res.results),
        totalResults: res.total_results,
        totalPages: res.total_pages
    };
  }

  _transformMovies = (movies) => movies.map((movie) => ({
    id: movie.id,
    title: movie.title,
    releaseDate: movie.release_date,
    description: movie.overview,
    posterSrc: movie.poster_path || null,
    genreIds: movie.genre_ids,
    voteAverage: movie.vote_average || 0,
  }));
}

export default MoviesServiсe;