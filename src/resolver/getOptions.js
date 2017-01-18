import includes from 'lodash/includes'

export default function ({allowedSort, forbiddenSort, defaultSort, defaultSortType}, root, {page, limit, sortBy, sortType}) {
  if (!defaultSort) {
    if (allowedSort && allowedSort.length > 0) {
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

  if (page < 1) {
    throw new Error('First page is 1')
  }

  if (includes(forbiddenSort, sortBy)) {
    throw new Error(`You can't sort by "${sortBy}"`)
  }

  if (allowedSort && allowedSort.length > 0 && !includes(allowedSort, sortBy)) {
    throw new Error(`You can't sort by "${sortBy}"`)
  }

  const skip = limit * (page - 1)
  const sort = {}
  sort[sortBy] = sortType === 'ASC' ? 1 : -1

  return {
    skip,
    limit,
    sort
  }
}
