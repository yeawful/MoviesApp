import { Card, Col, Rate, Image } from 'antd'
import { format } from 'date-fns'
import noImage from '../../resources/img/no-image.jpg'

import './MovieCard.scss'

export default function MovieCard({ src, title, description, date, voteAverage }) {

  // Формирование URL постера фильма или использование noImage
  const image = src ? `https://image.tmdb.org/t/p/w500${src}` : noImage;
  
  // Функция для сокращения текста описания
  function trimString(descr, cardTitle = '') {
    let trimLength = cardTitle.length > 46 ? 65 : cardTitle.length > 36 ? 115 : cardTitle.length > 18 ? 150 : 185;

    if (descr.length <= trimLength) {
      return descr;
    } else {
      return (
        descr.slice(0, trimLength).split(' ').slice(0, -1).join(' ') + ' ...'
      );
    }
  }

  // Форматирование даты date-fns
  const formatedDate = date ? <div className="movie_card__date">{format(new Date(date), 'PP')}</div> : null

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
            <h5 className="movie-card__title">{title}</h5>

            {formatedDate}

            <div className="movie-card__genres">
              <span className="genre">Action</span>
              <span className="genre">Drama</span>
            </div>

            <div className="movie-card__description">
              {trimString(description, title)}      
            </div>

            <Rate className="movie-card__stars" count={10} />

            <div className="movie-card__rate">
              {voteAverage}
            </div>
          </div>
        </div>
      </Card>
    </Col>
  )
}