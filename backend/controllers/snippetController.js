// controllers/snippetController.js
import { Snippet, User } from '../models/index.js';

export const getSnippets = async (req, res) => {
  try {
    const { language, sort, search } = req.query;
    let query = {};
    
    // Filter by language
    if (language) {
      query.language = language;
    }
    
    // Search in title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'popular':
        sortOption = { upvotes: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const snippets = await Snippet.find(query).sort(sortOption);
    res.json(snippets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSnippetById = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }
    res.json(snippet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createSnippet = async (req, res) => {
  try {
    const { title, description, language, code } = req.body;
    const snippet = await Snippet.create({
      author: req.user.username,
      title,
      description,
      language,
      code
    });

    // Add snippet to user's snippets
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { usersnippets: snippet._id } }
    );

    res.status(201).json(snippet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const upvoteSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    const userId = req.user._id;

    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }

    // Check if user already voted
    if (snippet.upvoters?.includes(userId)) {
      // Remove upvote
      snippet.upvotes -= 1;
      snippet.upvoters = snippet.upvoters.filter(id => id.toString() !== userId.toString());
    } else {
      // Add upvote and remove downvote if exists
      if (snippet.downvoters?.includes(userId)) {
        snippet.downvotes -= 1;
        snippet.downvoters = snippet.downvoters.filter(id => id.toString() !== userId.toString());
      }
      snippet.upvotes += 1;
      snippet.upvoters = [...(snippet.upvoters || []), userId];
    }

    await snippet.save();
    res.json(snippet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const downvoteSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    const userId = req.user._id;

    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }

    // Check if user already voted
    if (snippet.downvoters?.includes(userId)) {
      // Remove downvote
      snippet.downvotes -= 1;
      snippet.downvoters = snippet.downvoters.filter(id => id.toString() !== userId.toString());
    } else {
      // Add downvote and remove upvote if exists
      if (snippet.upvoters?.includes(userId)) {
        snippet.upvotes -= 1;
        snippet.upvoters = snippet.upvoters.filter(id => id.toString() !== userId.toString());
      }
      snippet.downvotes += 1;
      snippet.downvoters = [...(snippet.downvoters || []), userId];
    }

    await snippet.save();
    res.json(snippet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    if (!snippet) {
      return res.status(404).json({ message: 'Snippet not found' });
    }

    const comment = {
      text: req.body.text,
      username: req.user.username,
      author: req.user._id
    };

    snippet.comments.push(comment);
    await snippet.save();

    res.status(201).json(snippet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllUserSnippets = async (req, res) => {
  try {
    // Fetch all snippets except those with author "CodeGalaxy"
    const snippets = await Snippet.find({ 
      author: { $ne: 'CodeGalaxy' } 
    }).sort({ createdAt: -1 });
    
    res.json(snippets);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// backend/controllers/snippetController.js - Add new controller
export const getLanguageStats = async (req, res) => {
  try {
    const stats = await Snippet.aggregate([
      {
        $match: {
          language: { $exists: true, $ne: null }
        }
      },
      { 
        $group: { 
          _id: { $toUpper: '$language' }, 
          count: { $sum: 1 } 
        }
      },
      { 
        $project: {
          language: '$_id',
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { language: 1 }
      }
    ]);
    
    res.json(stats);
  } catch (error) {
    console.error('Error getting language stats:', error);
    res.status(400).json({ message: error.message });
  }
};