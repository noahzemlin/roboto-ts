// TODO: Please for the love of god split this into several .ts files

import { Client, Pool } from 'pg';

interface ResultsInterface {
    error?: any;
    results?: any;
    details?: any;
}

// This is testing db connection info.
// TODO: Replace these values with secrets
const pool = new Pool({
    user: 'cheese',
    host: 'postgres',
    database: 'db',
    password: 'balls',
    port: 5432,
});

interface TableMetadata {
    readonly primaryKey: string;
    readonly [key: string]: any;
}

interface ValidatorDef {
    readonly type: string;
    readonly required?: boolean;
    readonly unique?: boolean;
    readonly generated?: boolean;
    readonly minLength?: number;
    readonly maxLength?: number;
    readonly format?: RegExp;
    readonly default?: any;
}

const TABLES: {
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

interface ValidationObject {
    valid: boolean;
    type: boolean;
    required: boolean;
    minLength: boolean;
    maxLength: boolean;
    format: boolean;
    unique: boolean;
}

const newValidationObject = function(): ValidationObject {
    return {
        valid: true,
        type: true,
        required: true,
        minLength: true,
        maxLength: true,
        format: true,
        unique: true,
    };
};

class DataValidator {
    public static tableExists(table: string): boolean {
        return Object.keys(TABLES).includes(table);
    }

    public static columnExists(table: string, column: string): boolean {
        if (this.tableExists(table)) {
            return Object.keys(TABLES[table]._schema).includes(column);
        }
        return false;
    }

    public static async validateCol(table: string, column: string, value: any): Promise<ValidationObject> {
        if (this.columnExists(table, column)) {
            const validators = TABLES[table]._schema[column];
            const result = newValidationObject();
            await Object.keys(validators).forEach(async check => {
                switch (check) {
                    case 'type':
                        result.type = this.checkType(validators.type, value);
                        break;
                    case 'required':
                        result.required = this.checkRequired(value);
                        break;
                    case 'minLength':
                        result.minLength = this.checkMinLength(validators.minLength, value);
                        break;
                    case 'maxLength':
                        result.maxLength = this.checkMaxLength(validators.maxLength, value);
                        break;
                    case 'format':
                        result.format = this.checkFormat(validators.format, value);
                        break;
                    case 'unique':
                        result.unique = await this.checkUnique(table, column, value);
                        break;
                    default:
                        console.log(
                            `[ERROR] Invalid validator definition '${check}' specified for ${table}.${column}`
                        );
                        break;
                }
                if (!(result as any)[check]) {
                    result.valid = false;
                }
            });

            return result;
        }
        console.log('[ERROR] Invalid table specified when validating value');
        return {
            valid: false,
            type: false,
            required: false,
            minLength: false,
            maxLength: false,
            format: false,
            unique: false,
        };
    }

    public static async validateRow(
        table: string,
        row: { [key: string]: string }
    ): Promise<ResultsInterface> {
        const validationResults: { [key: string]: boolean } = {};
        const validationDetails: { [key: string]: ValidationObject } = {};
        if (this.tableExists(table)) {
            const schema = TABLES[table]._schema;
            // Generate list of required columns
            const requiredCols: Set<string> = new Set();
            await Object.keys(schema).forEach(col => {
                if (schema[col].required) {
                    requiredCols.add(col);
                }
            });
            // Check given columns
            await Object.keys(row).forEach(async col => {
                const result: ValidationObject = await this.validateCol(table, col, row[col]);
                validationResults[col] = result.valid;
                validationDetails[col] = result;
                requiredCols.delete(col);
            });
            // Find missing required columns
            requiredCols.forEach(col => {
                const temp: ValidationObject = newValidationObject();
                temp.valid = false;
                temp.required = false;
                validationResults[col] = false;
                validationDetails[col] = temp;
            });
            return {
                results: validationResults,
                details: validationDetails,
            };
        }
        return Promise.resolve({ error: `Invalid table '${table}'` });
    }

    // --------------------------------------------------
    // Validator functions
    private static checkType(type: string, value: any) {
        return typeof value === type;
    }
    private static checkRequired(value: any): boolean {
        return value && value !== null && value !== undefined && value !== 0;
    }
    private static checkMinLength(length: number, value: any): boolean {
        return value.toString().length >= length;
    }
    private static checkMaxLength(length: number, value: any): boolean {
        return value.toString().length <= length;
    }
    private static checkFormat(format: RegExp, value: any): boolean {
        return value.toString().match(format) !== null;
    }
    private static async checkUnique(table: string, column: string, value: any): Promise<boolean> {
        return Promise.resolve(true);
    }
}

class SQLTextCreator {
    checkDB() {
        return `SELECT datname FROM pg_catalog.pg_database WHERE datname='db'`;
    }

    createDB() {
        return `CREATE DATABASE db`;
    }

    queryAll(table: string) {
        return `SELECT * FROM ${table}`;
    }

    generalQuery(table: string, filters: { [key: string]: string }) {
        // Iterate through filter object to create query string
        const queries: string[] = [];
        Object.keys(filters).forEach(key => {
            queries.push(`${key} = ${filters[key]}`);
        });
        // Join the query array into a string
        const queryString = queries.join(', ');

        return `SELECT * FROM ${table} WHERE ${queryString}`;
    }

    insert(table: string, values: { [key: string]: string }) {
        let keyString = '';
        let valString = '';
        Object.keys(values).forEach(key => {
            keyString += key + ',';
            valString += '"' + values[key] + '"' + ',';
        });
        keyString = keyString.substr(keyString.length - 1, 1); // Remove trailing comma
        keyString = keyString.substr(keyString.length - 1, 1);
        return `INSERT INTO ${table}(${keyString}) VALUES(${valString})`;
    }
}
