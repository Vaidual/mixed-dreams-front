export interface IUserState {
  firstName: string,
  lastName: string,
  email: string,
}

export interface IInitialState {
  user: IUserState | null
  isLoading: boolean
}