import { verifyToken } from '@clerk/backend'

export const verifySession = async (secretKey: string, sessionToken: string) => {
	if (sessionToken) {
		const claims = await verifyToken(sessionToken, {
			secretKey,
		})
		return {
			userId: claims.sub,
			claims,
		}
	}
}
