import * as mongoose from 'mongoose';
import config from '../../config';
import logger from '../../logger';

// mongoose future-proofing
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

export default abstract class Repo<T> {
    protected model: mongoose.Model<mongoose.Document> = null;
    private schema: mongoose.Schema;
    private itemName: string;
    private collectionName: string;
    private connection: mongoose.Connection = null;

    constructor(schema: mongoose.Schema, itemName: string, collectionName: string) {
        (mongoose as any).Promise = Promise;
        this.schema = schema;
        this.itemName = itemName;
        this.collectionName = collectionName;
        this.connect();
    }

    newId(): string {
        return new mongoose.mongo.ObjectID().toHexString();
    }

    selectOne(id: string, condition?: any) {
        condition = condition || {};
        condition._id = id;
        return this.selectOneWhere(condition);
    }

    async selectOneWhere(condition: any): Promise<T> {
        await this.connectionIsReady();
        return new Promise<T>((resolve, _) => {
            this.model
                .findOne(condition)
                .lean()
                .exec((err: any, result: T) => {
                    if (err) {
                        resolve(null);
                    } else {
                        resolve(result as T);
                    }
                });
        });
    }

    async selectWhere(condition: any): Promise<T[]> {
        await this.connectionIsReady();
        return new Promise<T[]>((resolve, _) => {
            this.model
                .find(condition)
                .lean()
                .exec((err: any, result: T[]) => {
                    if (err) {
                        resolve([]);
                    } else {
                        resolve(result as T[]);
                    }
                });
        });
    }

    async insert(doc: T) {
        return this.upsert(this.newId(), doc);
    }

    async update(id: string, doc: any) {
        return this.doUpdate({ _id: id }, doc, { new: true });
    }

    async updateWhere(condition: any, doc: any) {
        return this.doUpdate(condition, doc, { new: true });
    }

    async upsert(id: string, doc: any) {
        return this.doUpdate({ _id: id }, doc, { new: true, upsert: true });
    }

    async upsertWhere(condition: any, doc: any) {
        return this.doUpdate(condition, doc, { new: true, upsert: true });
    }

    async remove(id: string) {
        return this.model.findByIdAndRemove(id);
    }

    async removeOneWhere(condition: any) {
        return this.model.findOneAndRemove(condition);
    }

    async removeWhere(condition: any) {
        return this.model.remove(condition);
    }

    async connect() {
        if (this.connection === null) {
            logger.info(`Connecting to mongo url ${config.mongo.url}`);
            this.connection = mongoose.createConnection(config.mongo.url, {
                useNewUrlParser: true,
            });
            this.model = this.connection.model(this.itemName, this.schema, this.collectionName);
            this.model.on('index', (err: any) => {
                if (err) {
                    logger.error(
                        `WARNING: MONGO INDEX FAILED! A MIGRATION IS NEEDED. ERROR: ${err}`
                    );
                }
            });
        }
    }

    private async doUpdate(condition: any, doc: any, opts: any) {
        await this.connectionIsReady();
        return new Promise<string>((resolve, reject) => {
            this.model.findOneAndUpdate(
                condition,
                doc,
                opts,
                (err: any, res: { _id: string | PromiseLike<string> }) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res._id);
                    }
                }
            );
        });
    }

    private async connectionIsReady() {
        // these states are from mongoose
        const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];

        if (this.connection && states[this.connection.readyState] === 'connected') {
            return;
        }

        await this.connect();
        await new Promise((resolve, reject) => {
            switch (states[this.connection.readyState]) {
                case 'connected':
                    resolve();
                    break;
                case 'connecting':
                    this.connection.once('connected', resolve);
                    this.connection.once('error', reject);
                    this.connection.once('disconnected', reject);
                    break;
                default:
                    // disconnected / disconnecting
                    reject('Unable to connect to mongoose!');
                    break;
            }
        });
    }
}
