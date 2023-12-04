import { HeaderProps } from "@/configs";

const Header : React.FC<HeaderProps> = ( { title } : HeaderProps ) => {
    return (
        <div className="bg-gray-3 m-[32px] rounded-[18px] p-[30px] flex justify-between">
            <p className="text-big text-white font-bold">{title}</p>
            <div className="m-2 flex">
                <p className="text-small font-bold text-white mx-[20px]">Home</p>
                <p className="text-small font-bold text-white mx-[20px]">Blog</p>
                <p className="text-small font-bold text-white mx-[20px]">Plugins</p>
                <p className="text-small font-bold text-white mx-[20px]">Support</p>
            </div>
        </div>
    );
}

export default Header;