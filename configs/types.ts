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
    extraClass: string,
    loadBtn?: boolean
}

export interface InputProps {
    type: string,
    value: any,
    setValue: any,
    placeholder: string,
    extraClass: string
}

export interface SingleInputModalProps {
    isShow: boolean,
    isLoading: boolean,
    title: string,
    hide: any,
    inputPlaceholder: string,
    value: string,
    setValue: any,
    updateValue: any
}

export interface PasswordInputModalProps {
    isShow: boolean,
    isLoading: boolean,
    hide: any,
    oldPassword: string,
    setOldPassword: any,
    newPassword: string,
    setNewPassword: any,
    confirmPassword: string,
    setConfirmPassword: any,
    updatePassword: any
}

export interface ImageCropModalProps {
    isShow: boolean,
    isLoading: boolean,
    hide: any,
    title: any,
    uploadImageURLToDB: any,
    imageData: any
}
