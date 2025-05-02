import { Component } from 'react';
import { Card, Col, Rate, Image } from 'antd';
import { format } from 'date-fns';
import noImage from '../../resources/img/no-image2.jpg';

import './MovieCard.scss';

export default class MovieCard extends Component {
  
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

  render() {
    const { src, title, description, date, voteAverage } = this.props;
    const image = src ? `https://image.tmdb.org/t/p/w500${src}` : noImage;
    const formatedDate = date ? <div className="movie_card__date">{format(new Date(date), 'PP')}</div> : null;

    return (
      <Col xs={24} md={12}>
        <Card>
          <div className="movie-card">
            <div className="movie-card__img-wrapper">
              <Image 
                src={image} 
                alt={title} 
                width="100%" 
              />
            </div>
            <div className="movie-card__info">
              <span className="movie-card__title">{title}</span>

              {formatedDate}

              <div className="movie-card__genres">
                <span className="genre">Action</span>
                <span className="genre">Drama</span>
              </div>

              <div className="movie-card__description">
                {this.trimDescription(description, title)}      
              </div>

              <Rate className="movie-card__stars" allowHalf defaultValue={2.5} count={10} />

              <div className="movie-card__rate">
                {voteAverage.toFixed(1)}
              </div>
            </div>
          </div>
        </Card>
      </Col>
    );
  }
}