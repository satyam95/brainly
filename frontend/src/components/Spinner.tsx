const Spinner = ({
  size = "4",
  color = "text-gray-500",
}: {
  size?: string;
  color?: string;
}) => {
  return (
    <div
      className={`animate-spin inline-block w-${size} h-${size} border-4 border-current border-t-transparent rounded-full ${color}`}
      role="status"
      aria-label="loading"
    ></div>
  );
};

export default Spinner;
