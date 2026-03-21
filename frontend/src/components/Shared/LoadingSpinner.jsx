import { ScaleLoader } from "react-spinners";

const LoadingSpinner = ({ smallHeight }) => {
  return (
    <div
      className={`${smallHeight ? "h-[250px]" : "h-[70vh]"} flex flex-col justify-center items-center`}
    >
      <ScaleLoader size={100} color="#2563eb" />
    </div>
  );
};

export default LoadingSpinner;
