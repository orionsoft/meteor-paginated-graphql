import includes from 'lodash/includes'
import isObject from 'lodash/isObject'

export default function ({allowedSort, search: canSearch, forbiddenSort, defaultSort, defaultSortType}, root, {search, filter, page, limit, sortBy, sortType}) {
  if (!defaultSort) {
    if (canSearch && search) {
      defaultSort = 'score'
    } else if (allowedSort && allowedSort.length > 0) {
      defaultSort = allowedSort[0]
    } else {
      defaultSort = 'createdAt'
    }
  }
  if (!defaultSortType) {
    if (allowedSort && allowedSort.length > 0) {
      defaultSortType = 'ASC'
    } else {
      defaultSortType = 'DESC'
    }
  }
  if (!limit) limit = 20
  if (limit > 200) {
    throw new Error('Max limit is 200')
  }

  if (typeof page === 'undefined') page = 1
  if (!sortBy) sortBy = defaultSort
  if (!sortType) sortType = defaultSortType
  if (sortBy === 'score') sortType = { $meta: 'textScore' }

  if (page < 1) {
    throw new Error('First page is 1')
  }

  if (includes(forbiddenSort, sortBy)) {
    throw new Error(`You can't sort by "${sortBy}"`)
  }

  if (sortBy !== 'score' && allowedSort && allowedSort.length > 0 && !includes(allowedSort, sortBy)) {
    throw new Error(`You can't sort by "${sortBy}"`)
  }

  const skip = limit * (page - 1)
  const sort = {}
  sort[sortBy] = isObject(sortType) ? sortType : sortType === 'ASC' ? 1 : -1

  let score = {}
  let fields = {}
  if (sortBy === 'score') {
    score = {score: { $meta: 'textScore' }}
    fields = {fields: {score: {$meta: 'textScore'}}}
  }

  return {
    ...fields,
    ...score,
    skip,
    limit,
    sort
  }
}
