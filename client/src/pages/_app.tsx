import type { AppProps } from 'next/app';
import themeConfig from '../theme/themeConfig';
import { useEffect } from 'react';
import { UserApi } from '@/api/userApi';
import { User, useSessionStore } from '@/state/session';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

function MyApp({ Component, pageProps }: AppProps) {
	const user = useSessionStore(state => state.user)
	const setUser = useSessionStore(state => state.setUser)

	useEffect(() => {
		UserApi.getLoggedInUser().then((userRes) => {
			if (userRes.status !== 200) {
				console.error('Error getting logged in user: ', userRes)
				const user = new User()
				setUser(user)
			}
			else {
				const user = new User(userRes.data)
				setUser(user)
			}
		}).catch((err) => {
			console.error('Error getting logged in user: ', err)
			const user = new User()
			setUser(user)
		})
	}, [setUser])

	if (user === null) {
		return null
	}

	const queryClient = new QueryClient()

	return (
		<QueryClientProvider client={queryClient}>
			<div
				style={{
					fontFamily: themeConfig.typography.fontFamily,
					backgroundColor: themeConfig.colors.background,
					color: themeConfig.colors.textPrimary,
					width: '100vw',
					height: '100vh',
					margin: 0,
					padding: 0,
					boxSizing: 'border-box',
					display: 'flex',
					flexDirection: 'column',
					overflowX: 'hidden',
				}}
			>
				{/* Reset styles */}
				<style global jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html,
        body,
        #__next {
          height: 100%;
          width: 100%;
          overflow: hidden; /* Prevent extra scrollbars */
        }
      `}</style>
				<Component {...pageProps} />
			</div>
		</QueryClientProvider>
	);
}

export default MyApp;

