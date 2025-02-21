export interface IUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
  gender?: string;
  role?: string;
  dob?: string;
  university?: string;
  workplace?: string;
  jobDescription?: string;
}

export interface FormValues {
  user: IUser | null;
  gender: string;
  role: string;
  dob: string;
  university: string;
  graduationYear: string;
  workplace: string;
  jobDescription: string;
}

export interface ModalProps {
  isModalOpen: boolean;
  handleModal: (value: boolean) => void;
}
