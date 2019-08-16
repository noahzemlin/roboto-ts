// An interface for creating drivers for databases. To use this interface, extend it in your class definition
export abstract class Driver {
    // --------------Standard DB functions---------------
    // Connects to the database. Returns whether or not the connection was successful
    abstract connect(): boolean;
    // Checks the existing connection to the database. Returns whether or not the connection is still valid
    abstract checkConnection(): boolean;

    // -------------DB Management functions--------------
    // Checks whether or not the DB exists
    abstract checkDB(): boolean;
    // Creates a new DB
    abstract createDB();
    // Deletes an existing DB
    abstract dropDB();
    // Checks whether or not the table exists in the database
    abstract checkTable(): boolean;
    // Creates a new table in the database
    abstract createTable();
    // Deletes an existing table in the database
    abstract dropTable();

    // ----------------Database functions----------------
    // Retrieves information from the database
    abstract getData(table: string, select: object, conditions: object);
    // Inserts new information into the database
    abstract insertData(table: string, values: object);
    // Updates existing information in the database
    abstract updateData(table: string, values: object);
    // Updates existing information in the database. If the primary key doesn't exist, a new entry will be created
    abstract upsertData(table: string, values: object);
    // Removes infromation from the database
    abstract deleteData(table: string, conditions: object);
}
