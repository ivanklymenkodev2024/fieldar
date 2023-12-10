export interface PageLayoutProps {
    children: React.ReactNode;
}

export interface HeaderProps {
    title: string
}

export interface ReHeaderProps {
    title: string,
    index: number,
    show: any
}

export interface SidebarProps {
    index: number
}

export interface ReSidebarProps {
    index: number,
    hide: any
}