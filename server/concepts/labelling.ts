import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";
import { Label } from "./types";


export interface LabelingOptions {

}

export interface LabelDoc extends BaseDoc {
    label: Label;
    resources: Set<ObjectId>;
}

/**
 * concept: Labelling
 */
export default class LabellingConcept {
    public readonly labels: DocCollection<LabelDoc>;

    /**
   * Make an instance of Labelling.
   */
    constructor(collectionName: string) {
        this.labels = new DocCollection<LabelDoc>(collectionName);
    }

    async register(label: Label): Promise<ObjectId> {
        // l not in labels
        // labels += l
        // l.resources := {}
        this.assertLabelDoesNotExist(label);

        return await this.labels.createOne({ label: label, resources: new Set<ObjectId>() });
    }

    async unregister(label: Label): Promise<void> {
        // l in labels
        // l.resources := none
        // labels -= l
        // labels.resources -= l
        this.assertLabelExists(label);
        void await this.labels.deleteOne({ label });
    }

    async lookup(label: Label): Promise<LabelDoc> {
        // l in labels
        // r := l.resources
        const result = await this.labels.readOne({ label });
        if (result === null) {
            throw new LabelNotFoundError(label);
        }

        return result;
    }

    async add(resource: ObjectId, label: Label): Promise<void> {
        // l in labels
        // r not in l.resources
        // l.resources += r
        // r.labelled += l
        await this.assertLabelExists(label);
        await this.assertResourceDoesNotExist(label, resource);

        const _label = await this.labels.readOne({ label });
        _label?.resources.add(resource);
    }

    async remove(resource: ObjectId, label: Label): Promise<void> {
        // l in labels
        // r in l.resources
        // l.resources -= r
        // r.labelled -= l
        await this.assertLabelExists(label);
        await this.assertResourceExists(label, resource);

        const _label = await this.labels.readOne({ label });
        _label?.resources.delete(resource);
    }

    async get(resource: ObjectId): Promise<Set<Label>> {
        // r in labelled
        // l := r.labelled
        let result: Set<Label> = new Set<Label>();

        const labels = await this.labels.readMany({});
        labels.forEach((element) => {
            if (element.resources.has(resource)) {
                result.add(element.label);
            }
        });

        return result;
    }

    private async assertLabelExists(label: string) {
        const result = await this.labels.readOne({ label });
        if (result === null) {
            throw new LabelNotFoundError(label);
        }
    }

    private async assertLabelDoesNotExist(label: string) {
        const result = await this.labels.readOne({ label });
        if (result !== null) {
            throw new LabelNotAllowedError(label);
        }
    }

    private async assertResourceExists(label: string, resource: ObjectId) {
        const result = await this.labels.readOne({ label });
        if (!result?.resources.has(resource)) {
            throw new ResourceNotFoundError(resource);
        }
    }

    private async assertResourceDoesNotExist(label: string, resource: ObjectId) {
        const result = await this.labels.readOne({ label });
        if (result?.resources.has(resource)) {
            throw new ResourceNotAllowedError(resource);
        }
    }
}

export class LabelNotAllowedError extends NotAllowedError {
    constructor(
        public readonly label: string,
    ) {
        super("label with name \"{0}\" is not allowed!", label);
    }
}

export class LabelNotFoundError extends NotFoundError {
    constructor(
        public readonly label: string,
    ) {
        super("label of ID {0} not found!", label);
    }
}

export class ResourceNotAllowedError extends NotAllowedError {
    constructor(
        public readonly resource: ObjectId,
    ) {
        super("resource with name \"{0}\" is not allowed!", resource);
    }
}

export class ResourceNotFoundError extends NotFoundError {
    constructor(
        public readonly resource: ObjectId,
    ) {
        super("resource of ID {0} not found!", resource);
    }
}