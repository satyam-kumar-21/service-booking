const Service = require('../models/Service');
const Category = require('../models/Category');

// --- CATEGORY CONTROLLERS ---

// @desc    Create Category
// @route   POST /api/v1/categories
// @access  Private (Admin)
exports.createCategory = async (req, res, next) => {
  try {
    const { name, status } = req.body;
    let image = 'https://via.placeholder.com/150';

    if (req.file) {
      image = req.file.path;
    }

    const category = await Category.create({ name, image, status });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ status: 'active' });
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Category
// @route   PUT /api/v1/categories/:id
// @access  Private (Admin)
exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
}

// @desc    Delete Category
// @route   DELETE /api/v1/categories/:id
// @access  Private (Admin)
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await category.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
}

// --- SERVICE CONTROLLERS ---

// @desc    Create Service
// @route   POST /api/v1/services
// @access  Private (Admin)
exports.createService = async (req, res, next) => {
  try {
    const { name, category, description, basePrice, visitCharge, status } = req.body;
    let image = '';

    if (req.file) {
      image = req.file.path;
    }

    const service = await Service.create({
      name, category, description, basePrice, visitCharge, status, image
    });
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

// @desc    Get All Services (with Category filter)
// @route   GET /api/v1/services
// @access  Public
exports.getServices = async (req, res, next) => {
  try {
    let query = { status: 'active' };
    if (req.query.categoryId) {
      query.category = req.query.categoryId;
    }

    const services = await Service.find(query).populate('category', 'name');
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (error) {
    next(error);
  }
};

// @desc    Update Service Price/Status
// @route   PUT /api/v1/services/:id
// @access  Private (Admin)
exports.updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};


// @desc    Delete Service
// @route   DELETE /api/v1/services/:id
// @access  Private (Admin)
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    await service.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
}
