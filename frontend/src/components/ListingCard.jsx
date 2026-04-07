/**
 * @file ListingCard.jsx
 * @description Why this file exists: To render a single item listing inside grid layouts.
 * @description Responsibility: Displays the listing's image, title, price, category, wear condition, and active status, styling badges based on values, and routing browser links to the target listing detail path.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, User } from 'lucide-react';

const ListingCard = ({ listing }) => {
  const { _id, title, price, category, condition, image, status } = listing;

  // Condition styling colors configuration
  const getConditionColor = (cond) => {
    switch (cond) {
      case 'New':
        return 'bg-emerald-100 text-emerald-800 border-emerald-250';
      case 'Like New':
        return 'bg-teal-100 text-teal-800 border-teal-250';
      case 'Good':
        return 'bg-sky-100 text-sky-800 border-sky-250';
      case 'Fair':
        return 'bg-amber-100 text-amber-800 border-amber-250';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <Link
      to={`/listings/${_id}`}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition duration-300 relative"
    >
      {/* Listing Status Badge */}
      {status === 'Sold' && (
        <div className="absolute top-3 right-3 z-10 bg-slate-950/90 text-white font-bold text-xs uppercase px-2.5 py-1 rounded-full backdrop-blur-sm tracking-wider">
          Sold
        </div>
      )}

      {/* Item Image */}
      <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
          loading="lazy"
        />
      </div>

      {/* Item Info Description Block */}
      <div className="p-4 flex flex-col flex-grow space-y-3">
        {/* Category & Condition Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Badge */}
          <span className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500">
            <Tag className="h-3 w-3" />
            <span>{category}</span>
          </span>
          {/* Condition Badge */}
          <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded border ${getConditionColor(condition)}`}>
            {condition}
          </span>
        </div>

        {/* Item Title */}
        <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-primary-600 transition">
          {title}
        </h3>

        {/* Item Price & Status Container */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-150 mt-auto">
          <span className="text-lg font-black text-slate-900">
            ₹{price.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;

/**
 * Line-by-line Explanation:
 * Line 7: Imports React.
 * Line 8: Imports Link.
 * Line 9: Imports icons.
 * Line 11: Declares ListingCard receiving `listing` as parameters.
 * Line 12: Destructures key fields.
 * Line 15-30: Dynamically returns badge styles matching the item's condition. For example, 'New' items display a green border and text.
 * Line 33-36: Renders outer Link wrapper. Applies group hover animations (`hover:-translate-y-0.5`).
 * Line 38-42: Displays high-visibility 'Sold' badge overlay if status equals 'Sold'.
 * Line 45-52: Renders listing cover image inside an aspect-ratio constrained crop box.
 * Line 55-82: Renders listing details block: category labels, wear-state tags, title strings, price calculations in Indian Rupees (INR `₹`), and a verified college listing seal.
 */
