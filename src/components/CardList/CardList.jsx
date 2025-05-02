import { Component } from 'react';
import { Row } from 'antd';

import MoviesServiсe from '../../services/MoviesService.jsx';
import MovieCard from '../MovieCard/MovieCard.jsx';

import './CardList.scss';

export default class CardList extends Component {
  constructor(props) {
    super(props);
    this.moviesService = new MoviesServiсe();
    this.state = {
      movies: null
    };
  }

  fetchData = async () => {
    const { pageNumber, setTotalResults } = this.props;  
    const { movies, totalResults } = await this.moviesService.searchMovie(pageNumber);
  
    setTotalResults(totalResults);  
    this.setState({ movies });
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
    const { movies } = this.state;

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