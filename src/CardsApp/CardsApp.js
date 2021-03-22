import { useEffect, useState, useCallback, useRef } from 'react'

import CardsList from './CardsList/CardsList'
import './CardsApp.css'


const CardsApp = () => {
  const [pageSize] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [cards, setCards] = useState([])
  const [error, setError] = useState('')
  const [value, setValue] = useState('')
  const [isFetching, setIsFetching] = useState(false)
  const loadMoreRef = useRef(null)

  const fetchCards = useCallback(() => {
    setIsFetching(true)
    fetch(
      `https://api.elderscrollslegends.io/v1/cards?page=${page}&pageSize=${pageSize}&name=${value}`
    )
      .then((response) => response.json())
      .then((data) => {
        const newCards = page === 1 ? data.cards : cards.concat(data.cards)
        setCards(newCards)
        setTotalPages(Math.floor(data._totalCount / pageSize))
        setIsFetching(false)
      })
      .catch((err) => {
        setError(err.message)
        setIsFetching(false)
      })
  }, [page, pageSize, value, cards])

  const fetchMore = useCallback(
    (entries) => {
      const target = entries[0]
      if (target.isIntersecting && page < totalPages && !isFetching) {
        setPage(page + 1)
        fetchCards()
      }
    },
    [fetchCards, page, totalPages, isFetching]
  )

  useEffect(() => {
    const currentRef = loadMoreRef.current
    const options = {
      root: null, // window by default
      rootMargin: '0px',
      threshold: 0.1,
    }

    // Create observer
    const observer = new IntersectionObserver(fetchMore, options)

    // observe the loadMoreRef
    if (currentRef) {
      observer.observe(currentRef)
    }

    // clean up on willUnMount
    return () => observer.unobserve(currentRef)
  }, [loadMoreRef, fetchMore])

  useEffect(() => {
    // TODO This fetch should be debounced so it's not calling while typing
    setPage(1)
    fetchCards()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]) // I don't want to re-run this on fetchCards re-render, so excluding it from deps.  Probably a better way to structure this

  return (
    <div className="cards-app">
      <div className="cards-app-search">
        <input
          className="cards-app-input"
          placeholder="Search by name..."
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div>
        {error && <p className="cards-error">{error}</p>}
        {cards.length > 0 ? <CardsList cards={cards} /> : <p>No Cards Found</p>}
      </div>
      <div ref={loadMoreRef} className="load-more">
        {isFetching && (
          <svg
            className="cards-spinner"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="25 25 50 50"
          >
            <circle
              cx="50"
              cy="50"
              r="20"
              fill="none"
              strokeWidth="5"
              stroke="#d8d8d8"
              strokeLinecap="round"
              strokeDashoffset="0"
              strokeDasharray="100, 200"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 50 50"
                to="360 50 50"
                dur="2.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-dashoffset"
                values="0;-30;-124"
                dur="1.25s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-dasharray"
                values="0,200;110,200;110,200"
                dur="1.25s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        )}
      </div>
    </div>
  )
}

export default CardsApp
