import { useState, useEffect } from 'react'

// Open Library Search API — free, no API key required.
// https://openlibrary.org/dev/docs/api/search
const SUBJECTS = ['science_fiction', 'fantasy', 'mystery']
const ENDPOINT = (subject) =>
  `https://openlibrary.org/search.json?q=subject:${subject}&fields=key,title,author_name,first_publish_year,cover_i,ratings_average,ratings_count,number_of_pages_median&limit=20`

const coverUrl = (id, size = 'M') =>
  id ? `https://covers.openlibrary.org/b/id/${id}-${size}.jpg` : null

function normalize(doc, idx) {
  const publishYear = doc.first_publish_year || null
  return {
    id: doc.key || `book-${idx}`,
    title: doc.title || 'Без названия',
    author: (doc.author_name && doc.author_name[0]) || 'Неизвестный автор',
    // build a real Date from the publish year so date sorting/filtering works
    published: publishYear ? new Date(publishYear, 0, 1) : null,
    publishYear,
    rating: doc.ratings_average ? Number(doc.ratings_average.toFixed(2)) : 0,
    ratingsCount: doc.ratings_count || 0,
    pages: doc.number_of_pages_median || 0,
    coverThumb: coverUrl(doc.cover_i, 'M'),
    coverLarge: coverUrl(doc.cover_i, 'L'),
  }
}

export function useBooks() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const responses = await Promise.all(
          SUBJECTS.map((s) => fetch(ENDPOINT(s)).then((r) => r.json()))
        )
        const docs = responses.flatMap((res) => res.docs || [])
        // keep only books that have a cover image, dedupe by key
        const seen = new Set()
        const cleaned = docs
          .filter((d) => d.cover_i && !seen.has(d.key) && seen.add(d.key))
          .slice(0, 40)
          .map(normalize)

        if (!cancelled) {
          setRows(cleaned)
          setLoading(false)
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message || 'Не удалось загрузить данные')
          setLoading(false)
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { rows, loading, error }
}
