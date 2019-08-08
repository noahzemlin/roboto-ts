import { Client, Pool } from 'pg';

// This is testing db connection info. 
// TODO: Replace these values with secrets
const pool = new Pool({
    user: 'cheese',
    host: 'postgres',
    database: 'db',
    password: 'balls',
    port: 5432,
});

const collections = {
    users: {
        _meta: {
            primaryKey: '_id',
            description: 'This is a database for storing users and their related data',
        },
        _schema: {
            _id: {
                generated: true,
            },
            username: {
                required: true,
                unique: true,
            },
            password: {
                required: true,
                minLength: 8,
            },
            email: {
                required: true,
                unique: true,
                format: /^.*@.*\..*$/,          // Email format '*@*.*'
            },
            salt: {},
            firstName: {},
            lastName: {},
            middleInitial: {},
            avatar: {},
            curency: {
                default: 0,
            },
        },
    },
};
