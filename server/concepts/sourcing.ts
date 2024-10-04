import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";


export interface SourcingOptions {

}

export interface SourceDoc extends BaseDoc {
    id: ObjectId;
    target: ObjectId;
    contentIDs: Set<ObjectId>;
    options?: SourcingOptions;
}

export interface ContentDoc extends BaseDoc {
    contentID: ObjectId;
    data: ObjectId;
}

/**
 * concept: Sourcing [Target]
 */
export default class SourcingConcept {
    public readonly sources: DocCollection<SourceDoc>;
    public readonly content: DocCollection<ContentDoc>;

    /**
   * Make an instance of Sourcing.
   */
    constructor(collectionName: string) {
        this.sources = new DocCollection<SourceDoc>(collectionName);
        this.content = new DocCollection<ContentDoc>(collectionName);
    }

    async register(target: ObjectId) {
        return "";
    }

    async unregister(sourceID: ObjectId) {

    }

    async lookup(sourceID: ObjectId) {
        return null;
    }

    async get(contentID: ObjectId) {
        return null;
    }

    async update(sourceID: ObjectId) {
        return null;
    }
}

export class SourceNotFoundError extends NotFoundError {
    constructor(
        public readonly _id: ObjectId,
    ) {
        super("{0} is not found!", _id); // TODO
    }
}

export class SourceNotAllowedError extends NotAllowedError {
    constructor(
        public readonly _id: ObjectId,
    ) {
        super("{0} is not allowed!", _id);// TODO
    }
}

export class ContentNotFoundError extends NotFoundError {
    constructor(
        public readonly _id: ObjectId,
    ) {
        super("{0} is not found!", _id); // TODO
    }
}

export class ContentNotAllowedError extends NotAllowedError {
    constructor(
        public readonly _id: ObjectId,
    ) {
        super("{0} is not allowed!", _id);// TODO
    }
}