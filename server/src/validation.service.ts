import { ResultsInterface, ValidationObject } from './common-interfaces';
import { TABLES } from './db-config';

export class ValidationService {
    public static newValidationObject = function(): ValidationObject {
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
            const result = this.newValidationObject();
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
                const temp: ValidationObject = this.newValidationObject();
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
