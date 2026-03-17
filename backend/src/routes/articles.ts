import { Router } from 'express';
import CategoryModel from '../models/categories';
import ArticleModel from '../models/article';
import { Article } from '../logic/article';
import { requireAdminAuth } from '../middleware/admin-auth';

const router = Router();

router.get('/get-categories', async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/set-category', async (req, res) => {
  try {
    const { name, description, image } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    // Find the highest current id
    const lastCategory = await CategoryModel.findOne().sort({ id: -1 });
    const nextId = lastCategory && lastCategory.id ? lastCategory.id + 1 : 1;
    console.log('Next category ID:', nextId);
    const newCategory = new CategoryModel({
      id: nextId,
      name,
      description: description || '',
      image: image || '',
      createdAt: new Date(),
      isActive: true,
    });
    await newCategory.save();
    res
      .status(201)
      .json({ success: true, message: 'Category created successfully', category: newCategory });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.patch('/change-category-status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryModel.findOne({ id: Number(id) });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    category.isActive = !category.isActive;
    await category.save();
    res.json({ success: true, message: 'Category status updated successfully', category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/update-category/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const category = await CategoryModel.findOne({ id: Number(id) });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    if (description) {
      category.description = description;
    }
    if (name) {
      category.name = name;
    }
    await category.save();
    res.json({ success: true, message: 'Category updated successfully', category });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/save-article', requireAdminAuth, async (req, res) => {
  try {
    const {
      articleId,
      title,
      slug,
      category,
      contentJson,
      contentHtml,
      isFeatured,
      status,
      featuredImage,
      mainArticle,
    } = req.body;

    const admin = req.admin;
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Unauthorized - admin not found' });
    }

    const author = `${admin.firstName} ${admin.lastName}`;

    const result = await new Article().saveArticle({
      articleId,
      title,
      slug,
      author,
      category,
      contentJson,
      contentHtml,
      isFeatured,
      status,
      featuredImage,
      mainArticle,
    });

    if (!result || !result.success) {
      return res
        .status(400)
        .json({ success: false, message: result?.message || 'Failed to save article' });
    }

    res.status(201).json({
      success: true,
      message: result.message,
      article: result.data,
      articleId: result.articleId,
    });
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.get('/get-articles', requireAdminAuth, async (req, res) => {
  try {
    console.log('Admin accessing get-articles route');
    const getArticles = await new Article().getArticles();
    console.log('Articles retrieved:', getArticles);
    res.json({ success: true, articles: getArticles });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.get('/get-main-article', async (req, res) => {
  try {
    const article = await new Article().getMainArticle();
    if (!article.success) {
      return res.status(404).json({ success: false, message: article.message });
    }
    res.json({ success: true, article: article.data });
  } catch (error) {
    console.error('Get main article error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.get('/get-article/:id', requireAdminAuth, async (req, res) => {
  try {
    const id = req.params.id as string;
    const article = await new Article().getArticleById(id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    res.json({ success: true, article });
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.delete('/delete-draft/:id', requireAdminAuth, async (req, res) => {
  try {
    const id = req.params.id as string;
    const article = await ArticleModel.findById(id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }
    if (article.status !== 'draft') {
      return res
        .status(403)
        .json({ success: false, message: 'Only draft articles can be deleted' });
    }
    await ArticleModel.findByIdAndDelete(id);
    res.json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/change-article-status/:id', requireAdminAuth, async (req, res) => {
  try {
    const id = req.params.id as string;
    const result = await new Article().changeArticleStatus(id);

    if (!result || !result.success) {
      return res
        .status(400)
        .json({ success: false, message: result?.message || 'Failed to change article status' });
    }

    res.json({ success: true, message: result.message, article: result.data });
  } catch (error) {
    console.error('Change article status error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
