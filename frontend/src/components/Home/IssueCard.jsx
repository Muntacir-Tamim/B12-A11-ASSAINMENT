import { Link } from "react-router";
import { MdLocationOn, MdOutlineThumbUp } from "react-icons/md";
import { getStatusColor, getPriorityColor } from "../../utils";
import { BsLightningChargeFill } from "react-icons/bs";

const IssueCard = ({ issue, onUpvote, currentUserEmail }) => {
  const {
    _id,
    title,
    image,
    category,
    status,
    priority,
    location,
    upvoteCount = 0,
    isBoosted,
    citizen,
  } = issue || {};

  const isOwnIssue = citizen?.email === currentUserEmail;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100 flex flex-col">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={image || "https://i.ibb.co/MBtjqXQ/no-avatar.png"}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition duration-300"
        />
        {isBoosted && (
          <span
            className="absolute top-2 left-2 flex items-center gap-1 bg-orange-500 text-white
            text-xs font-bold px-2 py-0.5 rounded-full"
          >
            <BsLightningChargeFill /> Boosted
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${getStatusColor(status)}`}
          >
            {status}
          </span>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${getPriorityColor(priority)}`}
          >
            {priority} priority
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
            {category}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-800 text-base leading-snug line-clamp-2">
          {title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <MdLocationOn className="text-base" />
          <span className="truncate">{location}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          {/* Upvote */}
          <button
            onClick={() => onUpvote && onUpvote(_id)}
            disabled={isOwnIssue}
            title={isOwnIssue ? "You can't upvote your own issue" : "Upvote"}
            className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full
              transition border
              ${
                isOwnIssue
                  ? "text-gray-300 border-gray-200 cursor-not-allowed"
                  : "text-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer"
              }`}
          >
            <MdOutlineThumbUp className="text-base" />
            {upvoteCount}
          </button>

          {/* View Details */}
          <Link
            to={`/issues/${_id}`}
            className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700
              transition px-4 py-1.5 rounded-full"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
