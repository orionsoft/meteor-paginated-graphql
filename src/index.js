import {loadSchema} from 'graphql-loader'
import {types, resolvers} from './schema'

console.log(types, resolvers)

loadSchema({typeDefs: types, resolvers})
