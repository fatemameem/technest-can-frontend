import { withPayload } from "@payloadcms/next/withPayload";
/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		reactCompiler: false,
		turbo: {
			rules: {
				"*.svg": {
					loaders: ["@svgr/webpack"],
					as: "*.js",
				},
			},
		},
	},
	webpack: (config, { isServer }) => {
		if (!isServer) {
			config.resolve.fallback = {
				...config.resolve.fallback,
				fs: false,
				net: false,
				tls: false,
				// worker_threads: false,
			};
		}
		return config;
	},
	// output: 'export',
	// eslint: {
	//   ignoreDuringBuilds: true,
	// },
	// images: { unoptimized: true },
};

// module.exports = nextConfig;
export default withPayload(nextConfig);
