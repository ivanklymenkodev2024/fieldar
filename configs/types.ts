export interface PageLayoutProps {
  children: React.ReactNode;
}

export interface HeaderProps {
  title: string;
}

export interface ReHeaderProps {
  title: string;
  index: number;
  show: any;
}

export interface SidebarProps {
  index: number;
}

export interface ReSidebarProps {
  index: number;
  hide: any;
}

export interface ButtonProps {
  title: string;
  handleSubmit: any;
  isLoading: boolean;
  extraClass: string;
  loadBtn?: boolean;
}

export interface InputProps {
  type: string;
  value: any;
  setValue: any;
  placeholder: string;
  extraClass: string;
}

export interface SingleInputModalProps {
  isShow: boolean;
  isLoading: boolean;
  title: string;
  hide: any;
  inputPlaceholder: string;
  value: string;
  setValue: any;
  updateValue: any;
}

export interface PasswordInputModalProps {
  isShow: boolean;
  isLoading: boolean;
  hide: any;
  oldPassword: string;
  setOldPassword: any;
  newPassword: string;
  setNewPassword: any;
  confirmPassword: string;
  setConfirmPassword: any;
  updatePassword: any;
}

export interface ImageCropModalProps {
  isShow: boolean;
  isLoading: boolean;
  hide: any;
  title: any;
  uploadImageURLToDB: any;
  imageData: any;
}

export interface InviteModalProps {
  isShow: boolean;
  isLoading: boolean;
  hide: any;
  inviteEmail: any;
  setInviteEmail: any;
  day: any;
  setDay: any;
  handleInviteToCompany: any;
}

export interface UserDetailModalProps {
  isShow: boolean;
  isLoading: boolean;
  hide: any;
  members: any;
  admins: any;
  selectedUserId: any;
  isAdmin: boolean;
  updateUserRole: any;
  promoteToAdminFunc: any;
  removeUserFromCompany: any;
  removeAdminRoleFunc: any;
}

export interface ConfirmModalProps {
  isShow: boolean;
  isLoading: boolean;
  hide: any;
  title: any;
  content: string;
  handleCancel: any;
  handleSubmit: any;
}

export interface UserRoleModalProps {
  isShow: boolean;
  isLoading: boolean;
  hide: any;
  members: any;
  newRole: any;
  setNewRole: any;
  selectedUserId: any;
  selectedProjectId: any;
  isAdmin: boolean;
  handleUpdateRole: any;
  unassignProjectFromMember: any;
}

export interface EditCompanyModalProps {
  isShow: boolean;
  isLoading: boolean;
  hide: any;
  reCompanyBio: any;
  handleReCompanyBioChange: any;
  reCompanyRegion: any;
  handleReCompanyRegionChange: any;
  reCompanyName: any;
  handleReCompanyNameChange: any;
  handleOnUpdateCompanyDetail: any;
}

export interface CreateProjectModalProps {
  isShow: boolean,
  isLoading: boolean,
  hide: any,
  newProjectName: string,
  setNewProjectName: any,
  newProjectLocation: string,
  setNewProjectLocation: any,
  newProjectRegion: string,
  setNewProjectRegion: any,
  company: any,
  handleCreateNewProject: any
}