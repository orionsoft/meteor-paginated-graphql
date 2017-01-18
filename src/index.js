import {loadSchema} from 'graphql-loader'
import {types, resolvers} from './schema'

loadSchema({typeDefs: types, resolvers})
