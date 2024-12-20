import { IncomingMessage, ServerResponse } from 'http'
import httpProxy from 'http-proxy'

// const API_URL = process.env.API_URL 
const API_URL = 'http://localhost:5001'

const proxy = httpProxy.createProxyServer()

// Make sure that we don't parse JSON bodies on this route:
export const config = {
	api: {
		bodyParser: false,
	},
}

const proxyFunc = (req: IncomingMessage, res: ServerResponse) => {
	return new Promise((resolve, reject) => {
		proxy.web(req, res, { target: API_URL, changeOrigin: true }, (err: Error) => {
			if (err) {
				return reject(err)
			}
			resolve(res)
		})
	})
}

export default proxyFunc

