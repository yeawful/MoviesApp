class MoviesServiсe {
    _apiBase = 'https://api.themoviedb.org/3';
    _apiKey = 'api_key=8eced43ec762e9d1e554a330c5db0774';
    _defaultSearch = 'return';

  // Обработчик ошибок при неудачном запросе
  getResource = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
  }

  // Поиск фильмов
  searchMovie = async (page, query = this._defaultSearch) => {
    const res = await this.getResource(`${this._apiBase}/search/movie?${this._apiKey}&query=${query}&page=${page}&language=en-US`);
    return {
        movies: this._transformMovies(res.results),
        totalResults: res.total_results,
        totalPages: res.total_pages
    };
  }

  // Форматирование данных для удобства
  _transformMovies = (movies) => {
    return movies.map((movie) => ({
        id: movie.id,
        title: movie.title,
        releaseDate: movie.release_date,
        description: movie.overview,
        posterSrc: movie.poster_path || null,
        genreIds: movie.genre_ids,
        voteAverage: movie.vote_average
    }));
  }
}

export default MoviesServiсe;