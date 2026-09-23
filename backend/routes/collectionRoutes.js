import express from 'express';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { ownsCollection } from '../middleware/ownership.js';
import { createCollectionSchema, updateCollectionSchema } from '../schemas/collection.js';
import {
  getCollections,
  createCollection,
  getCollectionById,
  updateCollection,
  deleteCollection,
  addSnippetToCollection,
  removeSnippetFromCollection
} from '../controllers/collectionController.js';

const router = express.Router();

// collections are always private to their owner
router.use(protect);

router.get('/', getCollections);
router.post('/', validate(createCollectionSchema), createCollection);
router.get('/:id', ownsCollection, getCollectionById);
router.patch('/:id', validate(updateCollectionSchema), ownsCollection, updateCollection);
router.delete('/:id', ownsCollection, deleteCollection);
router.post('/:id/snippets/:snippetId', ownsCollection, addSnippetToCollection);
router.delete('/:id/snippets/:snippetId', ownsCollection, removeSnippetFromCollection);

export default router;
