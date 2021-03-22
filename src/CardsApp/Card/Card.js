import './Card.css'

const Card = ({ card }) => {
  return (
    <div className="card">
      <img
        className="card-image"
        src={card.imageUrl}
        alt={card.name}
        loading="lazy"
      />
      <div className="card-info">
        <div className="card-row">
          <span className="card-label">name</span>
          <h4 className="card-name">{card.name}</h4>
        </div>
        <div className="card-row">
          <span className="card-label">text</span>
          <p className="card-text">{card.text ?? 'N/A'}</p>
        </div>
        <div className="card-row">
          <span className="card-label">set</span>
          <h4 className="card-set">{card.set.name}</h4>
        </div>
        <div className="card-row">
          <span className="card-label">type</span>
          <h4 className="card-type">{card.type}</h4>
        </div>
      </div>
    </div>
  )
}

export default Card
