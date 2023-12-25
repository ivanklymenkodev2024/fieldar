import { InputProps } from "@/configs";

const Input: React.FC<InputProps> = ({
  type,
  value,
  setValue,
  placeholder,
  extraClass,
}: InputProps) => {
  return (
    <input
      className={
        "bg-gray-3 text-gray-11 placeholder:italic focus:border-none outline-none shadown-none border-none focus:shadow-none focus:ring-0 " +
        extraClass
      }
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e: any) => {
        setValue(e.target.value);
      }}
    />
  );
};

export default Input;
