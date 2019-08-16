import { TableMetadata, ValidatorDef } from './common-interfaces';

export const TABLES: {
    [table: string]: { _meta: TableMetadata; _schema: { [col: string]: ValidatorDef } };
} = {
    users: {
        _meta: {
            primaryKey: '_id',
            description: 'This is a database for storing users and their related data',
        },
        _schema: {
            _id: {
                type: 'number',
                generated: true,
            },
            username: {
                type: 'string',
                required: true,
                unique: true,
            },
            password: {
                type: 'string',
                required: true,
                minLength: 8,
            },
            email: {
                type: 'string',
                required: true,
                unique: true,
                format: /^.*@.*\..*$/, // Email format '*@*.*'
            },
            salt: {
                type: 'string',
            },
            firstName: {
                type: 'string',
            },
            lastName: {
                type: 'string',
            },
            middleInitial: {
                type: 'string',
            },
            avatar: {
                type: 'image',
            },
            curency: {
                type: 'number',
                default: 0,
            },
        },
    },
};
