import { Collection, Snippet } from '../models/index.js';
import { ApiError, asyncHandler } from '../utils/ApiError.js';

export const getCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find({ owner: req.user._id })
    .sort({ createdAt: -1 })
    .select('name description snippets createdAt updatedAt');

  res.json(collections.map((collection) => ({
    _id: collection._id,
    name: collection.name,
    description: collection.description,
    snippets: collection.snippets,
    snippetCount: collection.snippets.length,
    createdAt: collection.createdAt,
    updatedAt: collection.updatedAt
  })));
});

export const createCollection = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const collection = await Collection.create({ name, description, owner: req.user._id });
  res.status(201).json(collection);
});

// ownership already verified by ownsCollection
export const getCollectionById = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id)
    .populate({ path: 'snippets', select: '-comments' });
  res.json(collection);
});

export const updateCollection = asyncHandler(async (req, res) => {
  const updated = await Collection.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  res.json(updated);
});

export const deleteCollection = asyncHandler(async (req, res) => {
  await Collection.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export const addSnippetToCollection = asyncHandler(async (req, res) => {
  const snippetExists = await Snippet.exists({ _id: req.params.snippetId });
  if (!snippetExists) {
    throw new ApiError(404, 'Snippet not found');
  }

  const updated = await Collection.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { snippets: req.params.snippetId } },
    { new: true }
  ).populate({ path: 'snippets', select: '-comments' });

  res.json(updated);
});

export const removeSnippetFromCollection = asyncHandler(async (req, res) => {
  const updated = await Collection.findByIdAndUpdate(
    req.params.id,
    { $pull: { snippets: req.params.snippetId } },
    { new: true }
  ).populate({ path: 'snippets', select: '-comments' });

  res.json(updated);
});
