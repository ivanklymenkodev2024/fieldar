import { HeaderProps } from "@/configs";
import Link from "next/link";

const Header : React.FC<HeaderProps> = ( { title } : HeaderProps ) => {
    return (
        <div className="bg-gray-3 m-[32px] rounded-[18px] p-[30px] lg:flex justify-between hidden">
            <p className="text-big text-white font-bold text-center">{title}</p>
            <div className="m-2 flex">
                <p className="text-small font-bold text-white mx-[15px]"><Link href={"https://www.fieldar.app/"}> Home </Link></p>
                <p className="text-small font-bold text-white mx-[15px]"><Link href={"https://www.fieldar.app/blog"}> Blog </Link></p>
                <p className="text-small font-bold text-white mx-[15px]"><Link href={"https://www.fieldar.app/plugins"}> Plugins </Link></p>
                <p className="text-small font-bold text-white mx-[15px]"><Link href={"https://www.fieldar.app/contact"}> Support </Link></p>
            </div>
        </div>
    );
}

export default Header;