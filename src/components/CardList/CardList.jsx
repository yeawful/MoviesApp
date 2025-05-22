import { Component } from 'react';
import { Row, Spin, Alert } from 'antd';
import PropTypes from 'prop-types';
import MovieCard from '../MovieCard/MovieCard.jsx';
import './CardList.scss';

export default class CardList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movies: [],
            isLoading: false,
            isError: false,
        };
        this.errorMessages = {
            loading: 'Failed to load data',
            session: 'Rating session error',
            noMovies: 'No movies found',
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    componentDidUpdate(prevProps) {
        const keysChanged = 
            this.props.pageNumber !== prevProps.pageNumber ||
            this.props.searchQuery !== prevProps.searchQuery ||
            this.props.activeTab !== prevProps.activeTab;
        
        if (keysChanged) {
            this.fetchData();
        }
    }

    fetchData = async () => {
        const { pageNumber, searchQuery, setTotalResults, activeTab, guestSessionId, ratingsCache } = this.props;
        
        this.setState({ isLoading: true, isError: false });
        
        try {
            let data;
            if (activeTab === 'search') {
                if (searchQuery) {
                    data = await this.props.moviesService.searchMovie(pageNumber, searchQuery);
                } else {
                    data = await this.props.moviesService.getPopularMovies(pageNumber);
                }
            } else {
                if (!guestSessionId || !ratingsCache || Object.keys(ratingsCache).length === 0) {
                    setTotalResults(0);
                    this.setState({ movies: [] });
                    return;
                }
                data = await this.props.moviesService.getRatedMovies(guestSessionId, pageNumber);
            }
            
            setTotalResults(data.totalResults);
            this.setState({ movies: data.movies });
        } catch (error) {
            this.setState({ 
                isError: true,
                errorType: error?.message === 'session' ? 'session' : 'loading'
            });
        } finally {
            this.setState({ isLoading: false });
        }
    };

    render() {
        const { movies, isLoading, isError, errorType } = this.state;
        const { activeTab } = this.props;

        if (isError) {
            return (
                <div className="card-list">
                    <Alert
                        message="Error"
                        description={this.errorMessages[errorType]}
                        type="error"
                        showIcon
                        closable
                    />
                </div>
            );
        }

        if (isLoading) {
            return (
                <div className="card-list">
                    <Spin size="large" />
                </div>
            );
        }

        if (movies.length === 0) {
            return (
                <Alert
                    message={activeTab === 'search' ? 'Info' : 'Info'}
                    description={this.errorMessages.noMovies}
                    type="info"
                    showIcon
                    closable
                />
            );
        }

        return (
            <section className="card-list">
                <Row gutter={[32, 32]}>
                    {movies?.map((movie) => (
                        <MovieCard
                            key={movie.id}
                            id={movie.id}
                            title={movie.title}
                            date={movie.releaseDate}
                            description={movie.description}
                            src={movie.posterSrc}
                            genreIds={movie.genreIds}
                            voteAverage={movie.voteAverage}
                            userRating={this.props.ratingsCache[movie.id] || movie.rating}
                            onRate={this.props.onRateMovie}
                        />
                    ))}
                </Row>
            </section>
        );
    }
}

CardList.propTypes = {
    moviesService: PropTypes.object.isRequired,
    pageNumber: PropTypes.number.isRequired,
    searchQuery: PropTypes.string,
    activeTab: PropTypes.oneOf(['search', 'rated']).isRequired,
    guestSessionId: PropTypes.string,
    ratingsCache: PropTypes.object,
    onRateMovie: PropTypes.func,
    setTotalResults: PropTypes.func.isRequired
};