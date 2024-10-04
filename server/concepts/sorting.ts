import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";


export interface SortingOptions {

}

export interface SortDoc extends BaseDoc {
    weights: Map<string, number>;
}

/**
 * concept: Sorting [Target]
 */
export default class SortingConcept {
    public readonly sorts: DocCollection<SortDoc>;

    /**
    * Make an instance of Sorting.
    */
    constructor(collectionName: string) {
        this.sorts = new DocCollection<SortDoc>(collectionName);
    }

    async sort(feed: ObjectId) {
        return [];
    }

    async add(label: string, weight: number) {

    }

    async remove(label: string) {

    }

    async set(label: string, weight: number) {

    }

    async get(label: string) {
        return 0;
    }
}

export class FeedNotFoundError extends NotFoundError {
    constructor(
        public readonly feed: ObjectId,
        public readonly _id: ObjectId,
    ) {
        super("{0} feed of ID {1} not found!", feed, _id);
    }
}

export class LabelNotFoundError extends NotFoundError {
    constructor(
        public readonly label: ObjectId,
    ) {
        super("label \"{0}\" not found!", label);
    }
}
