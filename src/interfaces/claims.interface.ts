export interface IUserClaims {
	Name: string
	"http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string
	exp: number
	aud: string
	iss: string
	jti: string
}

export interface ICompanyClaims extends IUserClaims {
	TenantId: string
}
