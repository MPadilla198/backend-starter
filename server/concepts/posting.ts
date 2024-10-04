import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError } from "./errors";

export interface PostOptions {
  backgroundColor?: string;
}

export interface PostDoc extends BaseDoc {
  author: ObjectId;
  content: string;
  options?: PostOptions;
}

export interface FeedDoc extends BaseDoc {
  name: string;
  posts: DocCollection<PostDoc>;
}

/**
 * concept: Posting [Author]
 */
export default class PostingConcept {
  public readonly feeds: DocCollection<FeedDoc>;

  /**
   * Make an instance of Posting.
   */
  constructor(collectionName: string) {
    this.feeds = new DocCollection<FeedDoc>(collectionName);
  }

  async register(name: string) {

  }

  async unregister(id: ObjectId) {

  }

  async post(author: ObjectId, content: string, options?: PostOptions) {
    // const _id = await this.posts.createOne({ author, content, options });
    // return { msg: "Post successfully created!", post: await this.posts.readOne({ _id }) };
  }

  async get(_id: ObjectId) {
    // return await this.posts.readMany({ author });
  }

  async getPosts() {
    // Returns all posts! You might want to page for better client performance
    // return await this.posts.readMany({}, { sort: { _id: -1 } });
  }

  async getByAuthor(author: ObjectId) {
    // return await this.posts.readMany({ author });
  }

  async update(_id: ObjectId, content?: string, options?: PostOptions) {
    // Note that if content or options is undefined, those fields will *not* be updated
    // since undefined values for partialUpdateOne are ignored.
    // await this.posts.partialUpdateOne({ _id }, { content, options });
    // return { msg: "Post successfully updated!" };
  }

  async unpost(_id: ObjectId) {
    // await this.posts.deleteOne({ _id });
    // return { msg: "Post deleted successfully!" };
  }

  async assertAuthorIsUser(_id: ObjectId, user: ObjectId) {
    // const post = await this.posts.readOne({ _id });
    // if (!post) {
    //   throw new NotFoundError(`Post ${_id} does not exist!`);
    // }
    // if (post.author.toString() !== user.toString()) {
    //   throw new PostAuthorNotMatchError(user, _id);
    // }
  }
}

export class PostAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of post {1}!", author, _id);
  }
}
