import './CardsList.css'
import Card from '../Card/Card'

const CardsList = ({ cards }) => {
  return (
    <div className="cards-list">
      {cards.map((card, i) => <Card key={i} card={card} />)}
    </div>
  )
}

export default CardsList