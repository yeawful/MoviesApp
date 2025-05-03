import { Component } from 'react';
import { Row, Spin, Alert } from 'antd';

import MovieCard from '../MovieCard/MovieCard.jsx';
import MoviesServiсe from '../../services/MoviesService.jsx';

import './CardList.scss';

export default class CardList extends Component {
  constructor(props) {
    super(props);
    this.moviesService = new MoviesServiсe();
    this.state = {
      movies: [],
      isLoading: false,
      isError: false
    };
    this.errorDescription = 'Failed to load movies. Please try again later.';
  }

  fetchData = async () => {
    const { pageNumber, setTotalResults } = this.props;

    this.setState({ isLoading: true, isError: false });

    try {
      const { movies, totalResults } = await this.moviesService.searchMovie(pageNumber);
      setTotalResults(totalResults);
      this.setState({ movies });
    } catch (error) {
      this.setState({ 
        isError: true
      });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.pageNumber !== prevProps.pageNumber) {
      this.fetchData();
    }
  }

  render() {
    const { movies, isLoading, isError } = this.state;

    if (isError) {
      return (
        <div className="card-list">
          <Alert 
            message="Error" 
            description={this.errorDescription} 
            type="error" 
            showIcon 
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

    return (
      <section className="card-list">
        <Row gutter={[32, 32]}>
          {movies?.map(movie => (
            <MovieCard
              key={movie.id}
              title={movie.title}
              date={movie.releaseDate}
              description={movie.description}
              src={movie.posterSrc}
              genreIds={movie.genreIds}
              voteAverage={movie.voteAverage}
            />
          ))}
        </Row>
      </section>
    );
  }
}