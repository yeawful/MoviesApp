import { Component } from 'react';
import { Card, Col, Rate, Image, Tag } from 'antd';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import './MovieCard.scss';
import GenresContext from '../GenresContext/GenresContext';
import noImage from '../../resources/img/no-image.jpg';

export default class MovieCard extends Component {
    static contextType = GenresContext;

    trimDescription(descr, cardTitle = '') {
        let baseTrimLength = 150;

        if (cardTitle.length > 30) {
            baseTrimLength = 100;
        }
        if (cardTitle.length < 15) {
            baseTrimLength = 200;
        }
        if (descr.length <= baseTrimLength) {
            return descr;
        }

        return descr.slice(0, baseTrimLength).split(' ').slice(0, -1).join(' ') + ' ...';
    }
    

    handleRateChange = async (value) => {
        await this.props.onRate(this.props.id, value);
    };

    getRateColor = (rate) => {
        if (rate >= 7) return '#66E900';
        if (rate >= 5) return '#E9D100';
        if (rate >= 3) return '#E97E00';
        return '#E90000';
    };

    render() {
        const { src, title, description, date, voteAverage, genreIds, userRating } = this.props;
        const genres = this.context;
        const image = src ? `https://image.tmdb.org/t/p/w500${src}` : noImage;
        const formatedDate = date ? (<div className="movie-card__date">{format(new Date(date), 'PP')}</div>) : null;
        const movieGenres = genreIds ? genreIds.map((id) => genres.find((genre) => genre.id === id)) : [];
        const filteredGenres = movieGenres.filter(Boolean).slice(0, 3);

        return (
            <Col xs={24} md={12}>
                <Card>
                    <div className="movie-card">
                        <div className="movie-card__img-wrapper">
                            <Image src={image} alt={title} width="100%" />
                        </div>
                        <div className="movie-card__info">
                            <header className="movie-card__header">
                                <span className="movie-card__title">{title}</span>

                                {formatedDate}

                                <div className="movie-card__genres">
                                    {filteredGenres.map((genre) => (
                                        <Tag key={genre.id} className="genre">
                                            {genre.name}
                                        </Tag>
                                    ))}
                                </div>
                            </header>

                            <div className="movie-card__description">
                                {this.trimDescription(description, title)}
                            </div>

                            <Rate
                                className="movie-card__stars"
                                allowHalf
                                value={userRating || 0}
                                count={10}
                                onChange={this.handleRateChange}
                                disabled={!this.props.onRate}
                            />

                            <div
                                className="movie-card__rate"
                                style={{ borderColor: this.getRateColor(voteAverage) }}
                            >
                                {voteAverage.toFixed(1)}
                            </div>
                        </div>
                    </div>
                </Card>
            </Col>
        );
    }
}

MovieCard.propTypes = {
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    date: PropTypes.string,
    voteAverage: PropTypes.number,
    genreIds: PropTypes.arrayOf(PropTypes.number),
    userRating: PropTypes.number,
    onRate: PropTypes.func
};