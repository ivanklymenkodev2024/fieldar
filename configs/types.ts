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

export interface ButtonProps {
    title: string,
    handleSubmit: any,
    isLoading: boolean,
    extraClass: string
}

export interface InputProps {
    type: string,
    value: any,
    setValue: any,
    placeholder: string,
    extraClass: string
}