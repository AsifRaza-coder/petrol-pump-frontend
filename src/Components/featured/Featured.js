import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreVert,
} from "@mui/icons-material";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Featured = () => {
  return (
    <div className="flex-[2] shadow-[2px_4px_10px_1px_rgba(201,201,201,0.47)] p-2.5 h-full">
      <div className="flex items-center justify-between text-gray-500">
        <h1 className="text-base font-medium">Total Revenue</h1>
        <MoreVert fontSize="small" />
      </div>
      <div className="p-2.5 flex flex-col items-center justify-center gap-2.5">
        <div className="w-[100px] h-[100px]">
          <CircularProgressbar value={70} text="70%" strokeWidth={5} />
        </div>
        <p className="font-medium text-gray-500 m-0">Total sales made today</p>
        <p className="text-[30px] m-0">$420</p>
        <p className="font-light text-xs text-gray-500 text-center">
          Previous transactions processing. Last payments may not be included
        </p>
        <div className="flex items-center justify-between w-full">
          <div className="text-center">
            <div className="text-sm text-gray-500">Target</div>
            <div className="flex items-center mt-2.5 text-sm text-green-600">
              <KeyboardArrowUp fontSize="small" />
              <div>$12.4k</div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Last week</div>
            <div className="flex items-center mt-2.5 text-sm text-red-600">
              <KeyboardArrowDown fontSize="small" />
              <div>$12.4k</div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Last Month</div>
            <div className="flex items-center mt-2.5 text-sm text-green-600">
              <KeyboardArrowUp fontSize="small" />
              <div>$12.4k</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
