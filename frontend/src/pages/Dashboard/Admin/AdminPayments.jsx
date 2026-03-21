import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../components/Shared/LoadingSpinner";
import { formatDate } from "../../../utils";
import { MdFilterList, MdOutlinePayments } from "react-icons/md";
import { BsLightningChargeFill } from "react-icons/bs";
import { MdVerified } from "react-icons/md";

const TYPES = ["boost", "subscription"];
const LIMIT = 15;

const AdminPayments = () => {
  const axiosSecure = useAxiosSecure();
  const [filterType, setFilterType] = useState("");
  const [page, setPage] = useState(1);

  const { data = {}, isLoading } = useQuery({
    queryKey: ["admin-payments", filterType, page],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filterType) params.set("type", filterType);
      params.set("page", page);
      params.set("limit", LIMIT);
      const res = await axiosSecure(`/admin/payments?${params.toString()}`);
      return res.data;
    },
    keepPreviousData: true,
  });

  const { payments = [], total = 0 } = data;
  const totalPages = Math.ceil(total / LIMIT);

  // Total revenue from current filter
  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Payments</h2>
        <p className="text-gray-500 text-sm mt-0.5">
          {total} total transaction{total !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500 mb-1">Total Transactions</p>
          <p className="text-2xl font-bold text-gray-800">{total}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500 mb-1">Revenue (current view)</p>
          <p className="text-2xl font-bold text-green-600">৳ {totalRevenue}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm text-gray-500 mb-1">Showing</p>
          <p className="text-2xl font-bold text-blue-600">{payments.length}</p>
        </div>
      </div>

      {/* Filter */}
      <div
        className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6
        flex flex-wrap items-center gap-3"
      >
        <MdFilterList className="text-gray-500 text-xl" />
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setPage(1);
          }}
          className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm
            focus:outline-blue-400 bg-gray-50 cursor-pointer"
        >
          <option value="">All Types</option>
          {TYPES.map((t) => (
            <option key={t} value={t} className="capitalize">
              {t}
            </option>
          ))}
        </select>
        {filterType && (
          <button
            onClick={() => {
              setFilterType("");
              setPage(1);
            }}
            className="text-sm text-red-500 hover:underline font-medium"
          >
            Clear
          </button>
        )}
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <MdOutlinePayments className="text-6xl mx-auto mb-3" />
          <p className="text-lg font-medium">No payments found</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full leading-normal">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    {[
                      "#",
                      "Citizen",
                      "Type",
                      "Amount",
                      "Transaction ID",
                      "Date",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-xs font-semibold text-gray-500
                          uppercase tracking-wider whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, idx) => (
                    <tr
                      key={payment._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition"
                    >
                      {/* Index */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-400">
                          {(page - 1) * LIMIT + idx + 1}
                        </p>
                      </td>

                      {/* Citizen */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-gray-800">
                          {payment.citizenName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {payment.citizenEmail}
                        </p>
                      </td>

                      {/* Type */}
                      <td className="px-5 py-4">
                        {payment.type === "boost" ? (
                          <span
                            className="flex items-center gap-1 text-xs font-semibold
                            text-orange-600 bg-orange-100 px-2.5 py-1 rounded-full w-fit"
                          >
                            <BsLightningChargeFill /> Boost
                          </span>
                        ) : (
                          <span
                            className="flex items-center gap-1 text-xs font-semibold
                            text-yellow-700 bg-yellow-100 px-2.5 py-1 rounded-full w-fit"
                          >
                            <MdVerified /> Subscription
                          </span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-green-600">
                          ৳ {payment.amount}
                        </p>
                      </td>

                      {/* Transaction ID */}
                      <td className="px-5 py-4">
                        <p
                          className="text-xs text-gray-400 font-mono max-w-[140px] truncate"
                          title={payment.transactionId}
                        >
                          {payment.transactionId}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4">
                        <p className="text-xs text-gray-400 whitespace-nowrap">
                          {formatDate(payment.createdAt)}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border text-sm font-medium
                  disabled:opacity-40 hover:bg-gray-50 transition"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-4 py-2 rounded-lg border text-sm font-semibold transition
                    ${
                      page === p
                        ? "bg-blue-600 text-white border-blue-600"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border text-sm font-medium
                  disabled:opacity-40 hover:bg-gray-50 transition"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPayments;
