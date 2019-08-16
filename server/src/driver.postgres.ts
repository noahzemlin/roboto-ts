import { Driver } from './driver.interface';

import { Client, Pool } from 'pg';

class PostgresDriver extends Driver {
    // ----------Setup for Postgres Connection-----------
    // This is testing db connection info.
    // TODO: Replace these values with secrets or environment variables
    pool = new Pool({
        user: 'cheese',
        host: 'postgres',
        database: 'db',
        password: 'balls',
        port: 5432,
    });

    // --------------Standard DB functions---------------
    // Connects to the database. Returns whether or not the connection was successful
    connect(): boolean {
        console.log('[UNDER DEVELOPMENT]');
        return true;
    }
    // Checks the existing connection to the database. Returns whether or not the connection is still valid
    checkConnection(): boolean {
        console.log('[UNDER DEVELOPMENT]');
        return true;
    }
    // Disconnects from the database
    disconnect() {
        console.log('[UNDER DEVELOPMENT]');
        return true;
    }

    // -------------DB Management functions--------------
    // Checks whether or not the DB exists
    checkDB(): boolean {
        console.log('[UNDER DEVELOPMENT]');
        return true;
    }
    // Creates a new DB
    createDB() {
        console.log('[UNDER DEVELOPMENT]');
        return true;
    }
    // Deletes an existing DB
    dropDB() {
        console.log('[UNDER DEVELOPMENT]');
        return true;
    }
    // Checks whether or not the table exists in the database
    checkTable(): boolean {
        console.log('[UNDER DEVELOPMENT]');
        return true;
    }
    // Creates a new table in the database
    createTable() {
        console.log('[UNDER DEVELOPMENT]');
        return true;
    }
    // Deletes an existing table in the database
    dropTable() {
        console.log('[UNDER DEVELOPMENT]');
        return true;
    }

    // ----------------Database functions----------------
    // Retrieves information from the database
    getData(table: string, select: Array<string> = ['*'], conditions: object) {
        console.log('[UNDER DEVELOPMENT]');
        return true;
    }
    // Inserts new information into the database
    insertData(table: string, values: object) {
        console.log('[UNDER DEVELOPMENT]');
        return true;
    }
    // Updates existing information in the database
    updateData(table: string, values: object) {
        console.log('[UNDER DEVELOPMENT]');
        return true;
    }
    // Updates existing information in the database. If the primary key doesn't exist, a new entry will be created
    upsertData(table: string, values: object) {
        console.log('[UNDER DEVELOPMENT]');
        return true;
    }
    // Removes infromation from the database
    deleteData(table: string, conditions: object) {
        console.log('[UNDER DEVELOPMENT]');
        return true;
    }
}
