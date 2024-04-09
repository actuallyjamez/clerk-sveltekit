import type {
	CreateOrganizationProps,
	OrganizationProfileProps,
	OrganizationSwitcherProps,
	SignInProps,
	SignUpProps,
	UserButtonProps,
	UserProfileProps,
} from '@clerk/types'
import type { Clerk } from '@clerk/clerk-js'

type ComponentPropsMap = {
	SignIn: SignInProps
	SignUp: SignUpProps
	UserButton: UserButtonProps
	UserProfile: UserProfileProps
	OrganizationProfile: OrganizationProfileProps
	OrganizationSwitcher: OrganizationSwitcherProps
	CreateOrganization: CreateOrganizationProps
}

const COMPONENT_DEFAULTS: {
	[K in keyof ComponentPropsMap]: ComponentPropsMap[K]
} = {
	SignIn: {},
	SignUp: {},
	UserButton: {
		afterSignOutUrl: '/',
		showName: false,
		userProfileMode: 'modal',
	},
	UserProfile: {},
	OrganizationProfile: {},
	OrganizationSwitcher: {},
	CreateOrganization: {},

} as const

type ClerkUIConfig<T extends keyof ComponentPropsMap = keyof ComponentPropsMap> = {
	clerk?: Clerk | null
	componentType: T
	props?: ComponentPropsMap[T]
}

export const clerkUI = (node: HTMLDivElement, { clerk, componentType, props }: ClerkUIConfig) => {
	if (!props) {
		props = COMPONENT_DEFAULTS[componentType]
	}

	let currentComponentType = componentType
	// console.log(`[ClerkUI] Initial component type: ${currentComponentType}`)

	if (clerk) {
		// console.log(`[ClerkUI] Mounting initial ${currentComponentType}`)
		// @ts-expect-error props is always defined
		clerk[`mount${currentComponentType}`](node, props)
	}

	return {
		update: ({ clerk: newClerk, componentType: newComponentType }: ClerkUIConfig) => {
			// console.log(`[ClerkUI] Update triggered. New component type: ${newComponentType}`)

			if (currentComponentType !== newComponentType || clerk !== newClerk) {
				// console.log(`[ClerkUI] Unmounting previous ${currentComponentType}`)
				clerk?.[`unmount${currentComponentType}`](node)
				currentComponentType = newComponentType
				clerk = newClerk
			}

			if (clerk) {
				// console.log(`[ClerkUI] Mounting updated ${currentComponentType}`)
				// @ts-expect-error props is always defined
				clerk[`mount${currentComponentType}`](node, props)
			}
		},
		destroy: () => {
			// console.log(`[ClerkUI] Destroy called. Unmounting ${currentComponentType}`)
			clerk?.[`unmount${currentComponentType}`](node)
		},
	}
}

export default clerkUI
