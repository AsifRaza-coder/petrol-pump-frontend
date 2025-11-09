import Avatar from "react-avatar";

const UserWidget = ({ data }) => {
  return (
    <div
      className="flex flex-col items-center p-5 bg-white rounded-xl w-[500px] shadow-[0px_4px_12px_rgba(0,0,0,0.1)] transition-[background] duration-300"
      style={{
        background: data.totalBalanceSum > 0 ? "#b1f3b1" : "#ffb4b4",
      }}
    >
      {/* Avatar Centered */}
      <Avatar className="mb-5" round size="60" name="User" />

      {/* Stats Section */}
      <div className="flex w-full justify-between text-center">
        {/* Total Customers */}
        <div className="flex-1 p-2.5 border-r border-gray-300 last:border-r-0">
          <div className="font-semibold text-sm text-gray-800 mb-1">Active Customers</div>
          <div className="text-lg font-bold text-gray-900">{data.totalObjects}</div>
        </div>
       {/* Total Credit Customers */}
        <div className="flex-1 p-2.5 border-r border-gray-300 last:border-r-0">
          <div className="font-semibold text-sm text-gray-800 mb-1">Credit Customers</div>
          <div className="text-lg font-bold text-gray-900">{data.balanceGreaterThanZero}</div>
        </div>
        {/* Total Balance */}
        <div className="flex-1 p-2.5 border-r border-gray-300 last:border-r-0">
          <div className="font-semibold text-sm text-gray-800 mb-1">Total Balance</div>
          <div className="text-lg font-bold text-gray-900">{data.totalBalanceSum?.toLocaleString("en-US", {
                      style: "currency",
                      currency: "PKR",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}</div>
        </div>

       
      </div>
    </div>
  );
};

export default UserWidget;
