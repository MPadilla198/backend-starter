import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";


export interface TemplatingOptions {

}

export interface TemplateDoc extends BaseDoc {
    template: ObjectId;
}

export interface RenderDoc extends BaseDoc {
    template: ObjectId;
    data: ObjectId;
}

/**
 * concept: Templating [Template]
 */
export default class TemplatingConcept {
    public readonly templates: DocCollection<TemplateDoc>;
    public readonly renders: DocCollection<RenderDoc>;

    /**
  * Make an instance of Templating.
  */
    constructor(collectionName: string) {
        this.templates = new DocCollection<TemplateDoc>(collectionName);
        this.renders = new DocCollection<RenderDoc>(collectionName);
    }

    async add(template: ObjectId) {
        await this.templates.createOne({ template });
        return { msg: "Template added" };
    }

    async remove(template: ObjectId) {
        const request = await this.templates.popOne({ template });
        if (request == null) {
            throw new TemplateNotFoundError(template);
        }
        return request;
    }

    async render(template: ObjectId, data: ObjectId) {
        await this.renders.createOne({ template, data });
        return { msg: "render created from template" };
    }

    async getRender(render: ObjectId) {
        const request = await this.renders.popOne({ render });
        if (request === null) {
            throw new RenderNotFoundError(render);
        }
        return request;
    }
}

export class TemplateNotFoundError extends NotFoundError {
    constructor(
        public readonly _id: ObjectId,
    ) {
        super("template of ID {0} not found!", _id);
    }
}

export class RenderNotAllowedError extends NotAllowedError {
    constructor(
        public readonly _id: ObjectId,
    ) {
        super("render of ID {0} is not allowed!", _id);
    }
}

export class RenderNotFoundError extends NotFoundError {
    constructor(
        public readonly _id: ObjectId,
    ) {
        super("render of ID {0} not found!", _id);
    }
}