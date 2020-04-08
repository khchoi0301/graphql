const express = require('express')
const expressGraphQL = require('express-graphql')
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql')
const { authors, books } = require("./data")
const app = express()

const BookType = new GraphQLObjectType({
    name: "book",
    description: "This represents a book written by an author",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        author: {
            type: AuthorType,
            resolve: (book) => {
                console.log(book)
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: "author",
    description: "This represents an author of a book",
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        books: {
            type: GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(book => author.id === book.authorId)
            }
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: "Root Query",
    fields: () => ({
        book: {
            type: BookType,
            description: "a single book",
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parents, args) => books.find(book => book.id === args.id)
        },
        books: {
            type: new GraphQLList(BookType),
            description: "List of books",
            resolve: () => books
        },
        author: {
            type: AuthorType,
            description: "a single author",
            args: {
                // id: { type: GraphQLInt },
                name: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: (parents, args) => authors.find(author => author.name === args.name)
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: "List of authors",
            resolve: () => authors
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType
})

app.use('/graphql', expressGraphQL({
    schema,
    graphiql: true
}))

app.listen(5000, () => console.log('Server Running'))