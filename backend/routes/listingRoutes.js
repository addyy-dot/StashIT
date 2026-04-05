/**
 * @file listingRoutes.js
 * @description Why this file exists: To define and map HTTP listing requests under /api/listings to their respective controllers and secure private routes.
 * @description Responsibility: Handles route matching for listing operations (creating, getting seller listings, editing, deleting, marking sold, searching, filtering), verifying active user JWTs using auth middleware for protected endpoints, and exposing public endpoints for marketplace views.
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const {
  getListings,
  getListingById,
  createListing,
  getMyListings,
  updateListing,
  deleteListing,
  markAsSold,
} = require('../controllers/listingController');

/**
 * Route: GET /api/listings
 * Desc:  Gets all listings (paginated, with search and filters)
 * Access: Public
 */
router.get('/', getListings);

/**
 * Route: GET /api/listings/my
 * Desc:  Retrieves listings owned by authenticated user
 * Access: Private
 * Note: Must be placed BEFORE /:id route to prevent 'my' from being parsed as an :id parameter
 */
router.get('/my', protect, getMyListings);

/**
 * Route: GET /api/listings/:id
 * Desc:  Get single listing by ID
 * Access: Public
 */
router.get('/:id', getListingById);

/**
 * Route: POST /api/listings
 * Desc:  Creates a listing with image upload (authenticated user)
 * Access: Private
 */
router.post('/', protect, upload.single('image'), createListing);

/**
 * Route: PUT /api/listings/:id
 * Desc:  Edits listing details (owner only)
 * Access: Private
 */
router.put('/:id', protect, updateListing);

/**
 * Route: DELETE /api/listings/:id
 * Desc:  Deletes a listing and its image (owner only)
 * Access: Private
 */
router.delete('/:id', protect, deleteListing);

/**
 * Route: PATCH /api/listings/:id/sold
 * Desc:  Marks listing status as Sold (owner only)
 * Access: Private
 */
router.patch('/:id/sold', protect, markAsSold);

module.exports = router;

/**
 * Line-by-line Explanation:
 * Line 7-8: Initializes the Express router.
 * Line 9: Imports the 'protect' authentication middleware.
 * Line 10: Imports the Multer file parser.
 * Line 11-19: Imports listings controllers including getListings and getListingById.
 * Line 25: Maps GET requests on '/' to the public paginated marketplace search catalog `getListings`.
 * Line 33: Maps GET requests on '/my' to `getMyListings`, secured using `protect`. Placed above `/:id` to prevent route collision.
 * Line 39: Maps GET requests on '/:id' to fetch item details by ID using `getListingById`.
 * Line 45: Maps POST requests on '/' to `createListing` with file uploading.
 * Line 51: Maps PUT requests on '/:id` to update listing details.
 * Line 57: Maps DELETE requests on '/:id' to delete items.
 * Line 63: Maps PATCH requests on '/:id/sold' to set items status to Sold.
 */
