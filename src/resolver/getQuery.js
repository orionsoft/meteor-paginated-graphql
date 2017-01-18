import regexAccent from './regexAccent'
import isArray from 'lodash/isArray'

export default function ({fields, transformQuery}, root, params, context) {
  if (!transformQuery) transformQuery = (q) => q

  let query = {}

  if (fields && typeof params.filter !== 'undefined') {
    if (isArray(fields)) {
      query.$or = []
      fields.map(field => {
        const search = {}
        search[field] = new RegExp(`${regexAccent(params.filter)}.*`, 'gi')
        query.$or.push(search)
      })

      if (query.$or.length === 0) {
        delete query.$or
      }
    } else if (fields) {
      query[fields] = new RegExp(`${regexAccent(params.filter)}.*`, 'gi')
    }
  }

  return transformQuery(query, root, params, context)
}
