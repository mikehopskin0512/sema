import mongoose, { Schema } from 'mongoose';
import {
  createOrganizationCollection,
  getDefaultCollections,
} from '../comments/collections/collectionService';

const {
  Types: { ObjectId },
} = mongoose;

const organizationSchema = new Schema(
  {
    id: String,
    name: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    collections: [
      {
        collectionData: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Collection',
        },
        isActive: {
          type: Boolean,
          default: true,
        },
      },
    ],
    users: [String],
    repos: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Repository',
        default: null,
      },
    ],
    pinnedRepos: { type: [String], default: [] },
    provider: {
      name: String,
      id: String,
      default: '',
    },
    url: {
      type: String,
      unique: true,
      sparse: true,
      default: '',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    orgMeta: {
      id: {
        type: String,
        unique: true,
        sparse: true,
      },
      login: {
        type: String,
        default: '',
      },
      node_id: {
        type: String,
        default: '',
      },
      url: {
        type: String,
        default: '',
      },
      repos_url: {
        type: String,
        default: '',
      },
      events_url: {
        type: String,
        default: '',
      },
      hooks_url: {
        type: String,
        default: '',
      },
      issues_url: {
        type: String,
        default: '',
      },
      members_url: {
        type: String,
        default: '',
      },
      public_members_url: {
        type: String,
        default: '',
      },
      avatar_url: {
        type: String,
        default: '',
      },
      description: {
        type: String,
        default: '',
      },
      name: {
        type: String,
        default: '',
      },
      company: {
        type: String,
        default: '',
      },
      blog: {
        type: String,
        default: '',
      },
      location: {
        type: String,
        default: '',
      },
      email: {
        type: String,
        default: '',
      },
      twitter_username: {
        type: String,
        default: '',
      },
      is_verified: {
        type: String,
        default: '',
      },
      has_organization_projects: {
        type: String,
        default: '',
      },
      has_repository_projects: {
        type: String,
        default: '',
      },
      public_repos: {
        type: Number,
        default: 0,
      },
      public_gists: {
        type: Number,
        default: 0,
      },
      followers: {
        type: Number,
        default: 0,
      },
      following: {
        type: Number,
        default: 0,
      },
      html_url: {
        type: String,
        default: '',
      },
      type: {
        type: String,
        default: '',
      },
    },
  },
  { timestamps: true }
);

organizationSchema.pre('save', async function save(next) {
  // TODO:tto
  try {
    if (this.isNew) {
      this._id = new ObjectId();
      const organizationCollection = await createOrganizationCollection(this);
      this.collections = await getDefaultCollections(
        organizationCollection._id
      );
    }
    if (!this.url) {
      this.url = this._id;
    }
    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model('Organization', organizationSchema);
