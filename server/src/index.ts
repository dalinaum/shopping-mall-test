import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import schema from './schema'
import resolvers from './resolvers'

(async () => {
    const server = new ApolloServer({
        typeDefs: schema,
        resolvers,
    })

    const app = express()
    await server.start()
    server.applyMiddleware({
        app,
        path: '/graphql',
        cors: {
            origin: [
                process.env.CLIENT_BASE_URL || 'http://localhost:5173',
                'https://studio.apollographql.com'
            ],
            credentials: true,
        }
    })
    const port = process.env.PORT || 8000
    await app.listen({ port })
    console.log(`server listening on ${port}...`)
})()
