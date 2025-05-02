import { Component } from 'react';
import { Row, Spin, Alert } from 'antd';

import MoviesServiсe from '../../services/MoviesService.jsx';
import MovieCard from '../MovieCard/MovieCard.jsx';

import './CardList.scss';

export default class CardList extends Component {
  constructor(props) {
    super(props);
    this.moviesService = new MoviesServiсe();
    this.state = {
      movies: [],
      loading: false,
      error: null
    };
  }

  fetchData = async () => {
    const { pageNumber, setTotalResults } = this.props;
    
    this.setState({ loading: true, error: null });
    
    try {
      const { movies, totalResults } = await this.moviesService.searchMovie(pageNumber);
      setTotalResults(totalResults);
      this.setState({ movies, loading: false });
    } catch (error) {
      this.setState({ 
        error: 'Failed to load movies. Please try again later.',
        loading: false 
      });
    }
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.pageNumber !== prevProps.pageNumber) {
      this.fetchData();
    }
  }

  render() {
    const { movies, loading, error } = this.state;

    if (error) {
      return (
        <section className="card-list">
          <Alert 
            message="Error" 
            description={error} 
            type="error" 
            showIcon 
          />
        </section>
      );
    }

    if (loading) {
      return (
        <section className="card-list">
          <Spin size="large" />
        </section>
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