const SideBar : React.FC = () => {
    return (
        <div className="fixed left-0 top-0 h-[100vh] w-sidebar bg-gray-2">
            <div className="h-[220px] w-full bg-gray-100">
                <h1 className="text-white">Profile Image</h1>
            </div>
            <div className="flex flex-col h-menu justify-between">
                <div className="flex flex-col">
                    <div className="flex items-center justify-start bg-gray-4 h-[72px] w-full">
                        <p className="ml-[100px] text-white text-small font-bold">Company Details</p>
                    </div>
                    <div className="flex items-center justify-start bg-gray-2 h-[72px] w-full">
                        <p className="ml-[100px] text-white text-small font-bold">Team Management</p>
                    </div>
                    <div className="flex items-center justify-start bg-gray-2 h-[72px] w-full">
                        <p className="ml-[100px] text-white text-small font-bold">Project Management</p>
                    </div>
                    <div className="flex items-center justify-start bg-gray-2 h-[72px] w-full">
                        <p className="ml-[100px] text-white text-small font-bold">Activity</p>
                    </div>
                    <div className="flex items-center justify-start bg-gray-2 h-[72px] w-full">
                        <p className="ml-[100px] text-white text-small font-bold">Subscription</p>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="flex items-center justify-start bg-gray-2 h-[72px] w-full">
                        <p className="ml-[100px] text-white text-small font-bold">Settings</p>
                    </div>
                    <div className="flex items-center justify-start bg-gray-2 h-[72px] w-full">
                        <p className="ml-[100px] text-white text-small font-bold">Log Out</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SideBar;
