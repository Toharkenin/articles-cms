import { Router } from 'express';
import CategoryModel from '../models/categories';

const router = Router();

router.get('/get-categories', async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    console.log('Fetched categories:', categories);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/set-category', async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    // Find the highest current id
    const lastCategory = await CategoryModel.findOne().sort({ id: -1 });
    const nextId = lastCategory && lastCategory.id ? lastCategory.id + 1 : 1;

    const newCategory = new CategoryModel({
      id: nextId,
      name,
      description: description || '',
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

router.delete('/delete-category/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await CategoryModel.findOneAndDelete({ id: Number(id) });
    if (!deletedCategory) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
