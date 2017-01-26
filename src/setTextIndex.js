import keys from 'lodash/keys'
import zipObject from 'lodash/zipObject'
import find from 'lodash/find'
import isEqual from 'lodash/isEqual'
import createHash from './createHash'
/* global Meteor */

const setTextIndex = async function (Collection, weights) {
  const fields = keys(weights)
  const indexFields = zipObject(fields, fields.map(field => 'text'))
  const name = 'os_paginated_text_' + createHash(JSON.stringify(weights))
  const options = { weights, name }
  try {
    Collection._ensureIndex(indexFields, options)
  } catch (error) {
    if (error.code === 85) {
      Meteor.setTimeout(() => setTextIndex(Collection, weights), 1000)
      const indexes = await Collection.rawCollection().indexes()
      const index = find(indexes, index => isEqual(index.key, { _fts: 'text', _ftsx: 1 }))
      Collection._dropIndex(index.name)
    } else {
      console.log('Error creating text index:', error)
    }
  }
}

export default setTextIndex
