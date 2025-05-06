class MoviesService {
    _apiBase = 'https://api.themoviedb.org/3';
    _apiKey = 'api_key=8eced43ec762e9d1e554a330c5db0774';

    getResource = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) {
            throw new Error(`Invalid response from server`);
        }

        return await res.json();
    };

    createGuestSession = async () => {
        return this.getResource(
            `${this._apiBase}/authentication/guest_session/new?${this._apiKey}`,
        );
    };

    getGenres = async () => {
        const res = await this.getResource(`${this._apiBase}/genre/movie/list?${this._apiKey}`);
        return res.genres;
    };

    searchMovie = async (page, query = '') => {
        const searchQuery = query;
        const res = await this.getResource(
            `${this._apiBase}/search/movie?${this._apiKey}&query=${searchQuery}&page=${page}&language=en-US`,
        );
        return {
            movies: this._transformMovies(res.results),
            totalResults: res.total_results,
            totalPages: res.total_pages,
        };
    };

    getPopularMovies = async (page = 1) => {
        const res = await this.getResource(
            `${this._apiBase}/movie/popular?${this._apiKey}&page=${page}&language=en-US`
        );
        return {
            movies: this._transformMovies(res.results),
            totalResults: res.total_results,
            totalPages: res.total_pages,
        };
    };

    getRatedMovies = async (guestSessionId, page) => {
        if (!guestSessionId || !guestSessionId.trim()) {
            throw new Error('Invalid guest session ID');
        }
    
        const res = await this.getResource(
            `${this._apiBase}/guest_session/${guestSessionId}/rated/movies?${this._apiKey}&page=${page}&language=en-US`,
        );
        
        return {
            movies: this._transformMovies(res.results),
            totalResults: res.total_results,
            totalPages: res.total_pages,
        };
    };

    rateMovie = async (movieId, rating, guestSessionId) => {
        const url = `${this._apiBase}/movie/${movieId}/rating?${this._apiKey}&guest_session_id=${guestSessionId}`;
        
        const options = {
            method: rating === 0 ? 'DELETE' : 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
        };
        
        if (rating !== 0) {
            options.body = JSON.stringify({ value: rating });
        }
    
        const res = await fetch(url, options);
    
        if (!res.ok) {
            throw new Error(`Could not rate movie, status: ${res.status}`);
        }
    
        return await res.json();
    };

    _transformMovies = (movies) => movies.map((movie) => ({
        id: movie.id,
        title: movie.title,
        releaseDate: movie.release_date,
        description: movie.overview,
        posterSrc: movie.poster_path || null,
        genreIds: movie.genre_ids,
        voteAverage: movie.vote_average || 0,
        rating: movie.rating || null,
    }));
}

export default MoviesService;
