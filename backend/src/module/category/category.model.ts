import mongoose, { Document, Schema, Types } from 'mongoose'
import { Image } from '~/types/type'
import { DATABASE_DOCUMENT, MAX_LEVEL_CATEGORY } from '~/utils/const.util'

const CATEGORY_COLLECTION = 'categories'

export interface ICategory extends Document {
  _id: Types.ObjectId
  name: string
  slug: string
  image: Image
  parent?: Types.ObjectId
  level: number // 0 root, 1 child
  path: Types.ObjectId[] // full path for query
  isActive: boolean
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, index: true },

    parent: { type: Schema.Types.ObjectId, ref: DATABASE_DOCUMENT.CATEGORY },
    level: { type: Number, default: 0, max: MAX_LEVEL_CATEGORY },

    image: {
      url: String,
      alt: String,
      is_primary: Boolean
    },

    path: [{ type: Schema.Types.ObjectId, ref: CATEGORY_COLLECTION }],

    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    collection: CATEGORY_COLLECTION
  }
)

const CategoryModel = mongoose.model<ICategory>(DATABASE_DOCUMENT.CATEGORY, categorySchema)

export default CategoryModel
