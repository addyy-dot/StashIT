/**
 * @file listingController.js
 * @description Why this file exists: To handle incoming CRUD operations and state changes for items listed on the marketplace.
 * @description Responsibility: Processes request data to create, retrieve, update, delete, and change status of listings. Enforces user ownership rules to prevent unauthorized changes, uploads listing images directly to Cloudinary, deletes images from Cloudinary upon removal, and coordinates DB data updates.
 */

const Listing = require('../models/Listing');
const { uploadToCloudinary, deleteFromCloudinary } = require('../config/cloudinary');

/**
 * @desc    Get all listings (paginated with search & filter)
 * @route   GET /api/listings
 * @access  Public
 */
const getListings = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // 1. Filter by category if supplied (excluding 'All')
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    // 2. Filter by search term in title (case-insensitive regular expression)
    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: 'i' };
    }

    // 3. Filter by status if supplied (e.g., status=Available)
    if (req.query.status) {
      query.status = req.query.status;
    }

    const total = await Listing.countDocuments(query);
    const listings = await Listing.find(query)
      .populate('seller', 'name email year') // Populates seller reference details (excluding sensitive fields like password)
      .sort({ createdAt: -1 }) // Sort listings so that newest items appear first
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: listings.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      listings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single listing by ID
 * @route   GET /api/listings/:id
 * @access  Public
 */
const getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate('seller', 'name email year');

    if (!listing) {
      res.status(404);
      throw new Error('Listing not found');
    }

    res.status(200).json({
      success: true,
      listing,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new item listing
 * @route   POST /api/listings
 * @access  Private
 */
const createListing = async (req, res, next) => {
  try {
    const { title, description, price, category, condition } = req.body;

    // 1. Check for text fields
    if (!title || !description || !price || !category || !condition) {
      res.status(400);
      throw new Error('Please fill in all listing details');
    }

    // 2. Check if a file was uploaded
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload an image for the listing');
    }

    // 3. Upload image buffer to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(req.file.buffer);

    // 4. Create listing record in database
    const listing = await Listing.create({
      title,
      description,
      price: Number(price),
      category,
      condition,
      image: cloudinaryResult.secure_url,
      cloudinaryPublicId: cloudinaryResult.public_id,
      seller: req.user._id,
    });

    res.status(201).json({
      success: true,
      listing,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get listings created by the authenticated user
 * @route   GET /api/listings/my
 * @access  Private
 */
const getMyListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ seller: req.user._id }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: listings.length,
      listings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update listing details
 * @route   PUT /api/listings/:id
 * @access  Private
 */
const updateListing = async (req, res, next) => {
  try {
    const { title, description, price, category, condition } = req.body;

    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      res.status(404);
      throw new Error('Listing not found');
    }

    // Authorization: Verify if requesting user is the seller (owner) of the listing
    if (listing.seller.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Access denied: You can only edit your own listings');
    }

    // Perform database updates
    listing.title = title || listing.title;
    listing.description = description || listing.description;
    listing.price = price !== undefined ? Number(price) : listing.price;
    listing.category = category || listing.category;
    listing.condition = condition || listing.condition;

    const updatedListing = await listing.save();

    res.status(200).json({
      success: true,
      listing: updatedListing,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a listing
 * @route   DELETE /api/listings/:id
 * @access  Private
 */
const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      res.status(404);
      throw new Error('Listing not found');
    }

    // Authorization: Verify if requesting user is the seller (owner) of the listing
    if (listing.seller.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Access denied: You can only delete your own listings');
    }

    // Delete image from Cloudinary using stored public ID
    try {
      if (listing.cloudinaryPublicId && listing.cloudinaryPublicId !== 'placeholder_public_id') {
        await deleteFromCloudinary(listing.cloudinaryPublicId);
      }
    } catch (cloudinaryErr) {
      // Log the error but continue deleting the listing from DB so the database stays clean
      console.error('Failed to delete image from Cloudinary:', cloudinaryErr.message);
    }

    // Delete listing from database
    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Listing and associated image removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mark a listing as Sold
 * @route   PATCH /api/listings/:id/sold
 * @access  Private
 */
const markAsSold = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      res.status(404);
      throw new Error('Listing not found');
    }

    // Authorization: Verify if requesting user is the seller (owner) of the listing
    if (listing.seller.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Access denied: You can only mark your own listings as sold');
    }

    listing.status = 'Sold';
    const updatedListing = await listing.save();

    res.status(200).json({
      success: true,
      listing: updatedListing,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getListings,
  getListingById,
  createListing,
  getMyListings,
  updateListing,
  deleteListing,
  markAsSold,
};

/**
 * Line-by-line Explanation:
 * Line 7: Imports Listing model.
 * Line 8: Imports Cloudinary helper functions.
 * Line 14: Declares public paginated route controller `getListings`.
 * Line 16-18: Parses integer paging index parameters from URL query string.
 * Line 23-26: Sets category restriction key if a specific category is requested (skipping 'All').
 * Line 29-32: Evaluates search terms against titles using a case-insensitive regex pattern.
 * Line 35-38: Evaluates listing availability status.
 * Line 40: Counts match sets for pagination math.
 * Line 41-45: Performs database query. Populates the `seller` field with the name, email, and class year of the student seller.
 * Line 47-55: Computes total pages and current page numbers, returning the listings inside a JSON response.
 * Line 63: Declares public item detail controller `getListingById`.
 * Line 66: Locates specific listing record by ID parameter and populates the seller details.
 * Line 68-71: Throws 404 error if listing is not found.
 * Line 73: Returns listing details inside a JSON response.
 */
