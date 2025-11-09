import petrolCane from "../../img/petrolCane.webp";
import dieselCane from "../../img/DieselCane.jpg";
import Avatar from "react-avatar";
import { DOMAIN } from "../../backend/API";

const Widget = ({ type, data }) => {
  // let data;

  const isLowStock = (data.product.type === "petrol" || data.product.type === "diesel") && data.stock < 2000;
  const bgColor = isLowStock ? "#fca5a5" : "#1a4d4d";
  const bgGradient = isLowStock ? "#ef4444" : "#155050";

  return (
    <div 
      className="flex justify-between p-4 flex-1 shadow-lg rounded-xl h-[130px] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      style={{
        background: `linear-gradient(135deg, ${bgColor} 0%, ${bgGradient} 100%)`
      }}
    >
      <div className="flex flex-col justify-between flex-1">
        <div className="flex items-center gap-3 mb-2">
          <Avatar 
            src={data.product.type !== "mobile" ? (data.product.type === "petrol" ? petrolCane : dieselCane) : (data.product.pic !== "" ? `${DOMAIN}/public/product/images/${data.product.pic}` : './img/avatarfile.png')} 
            round 
            size="40" 
            style={{border: "2px solid white", boxShadow: "0 2px 8px rgba(0,0,0,0.1)"}}
          />
          <span className="font-bold text-base text-white">{data.product.name}</span>
        </div>
        
        <div className="mt-2">
          <div className="text-xs text-white/80 mb-1">Quantity</div>
          <span className="text-2xl font-bold text-white">
            {data.stock?.toLocaleString() || 0}
          </span>
        </div>
        
        {data.link && (
          <span className="text-xs text-white/80 mt-2 border-b border-white/40 w-max hover:text-white transition-colors">
            {data.link}
          </span>
        )}
      </div>
      
      <div className="flex flex-col justify-between items-end ml-4">
        <div className="bg-white/90 rounded-lg px-2 py-1 shadow-sm">
          <div className="text-xs text-gray-600 mb-0.5">Selling</div>
          <div className="text-sm font-bold text-[#1a4d4d]">
            Rs. {data.price?.newSellingPrice?.toLocaleString() || "0"}
          </div>
        </div>
        <div className="bg-white/90 rounded-lg px-2 py-1 shadow-sm">
          <div className="text-xs text-gray-600 mb-0.5">Cost</div>
          <div className="text-sm font-bold text-gray-700">
            Rs. {data.price?.costPrice?.toLocaleString() || "0"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Widget;
