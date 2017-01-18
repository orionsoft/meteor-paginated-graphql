import hash from 'object-hash'

export const types = [
  `
  enum SortType {
    # Ascending order
    ASC
    # Descending order
    DESC
  }
  `
]
export const resolvers = {}

export const generateType = function (typename) {
  const name = `Paginated${typename}`
  const type = `
  # Result of a paginated ${typename}
  type ${name} {
    # Unique id for the query
    _id: ID
    # Total count of ${typename}
    totalCount: Int
    # Number of pages
    totalPages: Int
    # If the cursor has a next page
    hasNextPage: Boolean
    # If the cursor has a next page
    hasPreviousPage: Boolean
    # The list of ${typename}
    items: [${typename}]
  }
  `
  types.push(type)

  const totalCount = function (paginated, params, context) {
    if (typeof paginated.count === 'undefined') {
      paginated.count = paginated.cursor.count()
    }
    return paginated.count
  }

  const resolver = {
    _id (paginated, params, context) {
      return hash({
        typename,
        userId: context.userId,
        params: paginated.params
      })
    },
    totalCount,
    totalPages (paginated, params, context) {
      const count = totalCount(paginated, {}, context)
      return Math.ceil(count / paginated.options.limit)
    },
    hasNextPage (paginated, params, context) {
      const count = totalCount(paginated, {}, context)
      const {skip, limit} = paginated.options
      return skip + limit < count
    },
    hasPreviousPage (paginated, params, context) {
      const count = totalCount(paginated, {}, context)
      const {skip} = paginated.options
      return count && skip !== 0
    },
    items (paginated, params, context) {
      return paginated.cursor.fetch()
    }
  }
  resolvers[name] = resolver
  return name
}

export const query = function ({name, type, params}) {
  if (typeof params === 'undefined') params = 'filter: String'

  const PaginatedType = generateType(type)

  return `
  # Returns a paginated list of ${type}
  ${name} (${params}${params ? ', ' : ''}page: Int, limit: Int, sortBy: String, sortType: SortType): ${PaginatedType}
  `
}
