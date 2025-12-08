import mongoose from 'mongoose';

const apiKeySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  service: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    enum: ['super_admin', 'aicte_admin', 'ugc_admin', 'institution', 'external_service', 'public'],
    default: 'external_service'
  },
  permissions: {
    canReadInstitutions: { type: Boolean, default: false },
    canReadParameters: { type: Boolean, default: false },
    canReadApplications: { type: Boolean, default: false },
    canReadAIData: { type: Boolean, default: false },
    canReadDocuments: { type: Boolean, default: false },
    canQueryByParameters: { type: Boolean, default: false },
    canBulkQuery: { type: Boolean, default: false },
    canReadStatistics: { type: Boolean, default: false },
    canReadAllInstitutions: { type: Boolean, default: false },
    ownDataOnly: { type: Boolean, default: false }
  },
  institutionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUsed: {
    type: Date,
    default: null
  },
  usageCount: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster lookups
apiKeySchema.index({ key: 1, isActive: 1 });
apiKeySchema.index({ createdBy: 1 });
apiKeySchema.index({ role: 1 });

// Method to check if key is expired
apiKeySchema.methods.isExpired = function() {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

// Method to update last used timestamp
apiKeySchema.methods.recordUsage = async function() {
  this.lastUsed = new Date();
  this.usageCount += 1;
  await this.save();
};

// Static method to find active key
apiKeySchema.statics.findActiveKey = async function(key) {
  return this.findOne({ 
    key, 
    isActive: true,
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ]
  });
};

const ApiKey = mongoose.model('ApiKey', apiKeySchema);

export default ApiKey;
