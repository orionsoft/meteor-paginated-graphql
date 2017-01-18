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
   * A function that returns a new query
   */
  transformQuery
}) {
  return function (root, params, context) {
    const options = getOptions({allowedSort, forbiddenSort, defaultSort, defaultSortType}, root, params, context)
    const query = getQuery({fields, transformQuery}, root, params, context)
    return {
      cursor: collection.find(query, options),
      params,
      context,
      query,
      
      options
    }
  }
}
