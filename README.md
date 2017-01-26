# Paginated GraphQL

A tool to create paginated Apollo GraphQL methods with Meteor Collections

```
yarn add paginated-graphql
```

## Instructions

You need to use [graphql-loader](https://github.com/orionsoft/graphql-loader).

Once, after importing type definitions and resolvers import this package.

```js
import {createApolloServer} from 'meteor/orionsoft:apollo' // or meteor/apollo
import {makeExecutableSchema} from 'graphql-tools'
import {loadSchema, getSchema} from 'graphql-loader'
import typeDefs from './schema'
import resolvers from './resolvers'
import 'paginated-graphql'

// Load all your resolvers and type definitions into graphql-loader
loadSchema({typeDefs, resolvers})

// Gets all the resolvers and type definitions loaded in graphql-loader
const schema = makeExecutableSchema(getSchema())

createApolloServer({schema})
```

### Defining the method

```js
import query from 'paginated-graphql/lib/query'

const providers = query({
  name: 'providers', // name of the field (method)
  type: 'Provider', // name of the GraphQL type
  params: 'filter: String'
})

export default `
type Query {
  ${providers}
}
`
```

### Adding the resolver

```js
import resolver from 'paginated-graphql/lib/resolver'
import Providers from 'api/collections/Providers'

const providers = resolver({
  collection: Providers, // Meteor collection
  allowedSort: ['name', 'totalEarnings'], // fields that can be sorted
  fields: ['name'], // fields that can be searched
  transformQuery (query, root, params, context) {
    // transform the query here
    return query
  }
})

export default {
  Query: {
    providers
  }
}
```

### Using ```$text``` search

```js
resolver({
  collection: Transactions,
  allowedSort: ['date', 'amount'],
  fields: 'name',
  search: true
})

const transactions = query({
  name: 'transactions',
  type: 'Transaction',
  params: 'filter: String, search: String'
})

// The collection definition

import setTextIndex from 'paginated-graphql/lib/setTextIndex'
setTextIndex(Transactions, {
  name: 45, // weights
  comment: 5,
  category: 1
})
```
