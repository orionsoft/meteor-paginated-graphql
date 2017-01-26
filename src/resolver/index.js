import getOptions from './getOptions'
import getQuery from './getQuery'

/**
 * Creates a paginated resolver
 */
export default function ({
  /**
   * The collection to paginate
   */
  collection,
  /**
   * Fields that are allowed to sort
   */
  allowedSort,
  /**
   * Fields that are forbidden to sort
   */
  forbiddenSort,
  /**
   * Default sort field. Defaults to createdBy
   */
  defaultSort,
  /**
   * Default sort asc. Defaults to false
   */
  defaultSortType,
  /**
   * Fields to filter
   */
  fields,
  /**
   * Boolean, use search query instead of fields filters
   */
  search,
  /**
   * A function that returns a new query
   */
  transformQuery
}) {
  return function (root, params, context) {
    const options = getOptions({allowedSort, search, forbiddenSort, defaultSort, defaultSortType}, root, params, context)
    const query = getQuery({fields, search, transformQuery}, root, params, context)
    console.log('making query', JSON.stringify(query, null, 2), JSON.stringify(options, null, 2))
    return {
      cursor: collection.find(query, options),
      params,
      context,
      query,
      options
    }
  }
}
