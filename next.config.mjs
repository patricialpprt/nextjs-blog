// CSP headers here is set based on Next.js recommendations:
// https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
const cspReportOnly = true;

const cspHeader = () => {

    const upgradeInsecure = cspReportOnly ? '' : 'upgrade-insecure-requests;'

    const defaultsCSPHeaders = `
        default-src 'none';
        media-src 'self';
        object-src 'none';
        base-uri 'none';
        form-action 'none';
        frame-ancestors 'none';
        block-all-mixed-content;
        ${upgradeInsecure}
        `

    // when environment is preview enable unsafe-inline scripts for vercel preview feedback/comments feature
    // and whitelist vercel's domains based on:
    // https://vercel.com/docs/workflow-collaboration/comments/specialized-usage#using-a-content-security-policy
    // and white-list vitals.vercel-insights
    // based on: https://vercel.com/docs/speed-insights
    if (process.env?.VERCEL_ENV === "preview") {
        return `
            ${defaultsCSPHeaders}
            font-src 'self' https://vercel.live/;
            style-src 'self' 'unsafe-inline' https://vercel.live/fonts;
            script-src 'self' 'unsafe-inline' https://vercel.live/;
            connect-src 'self' https://vercel.live/ https://vitals.vercel-insights.com https://*.pusher.com/ wss://*.pusher.com/;
            img-src 'self' https://vercel.live/;
            frame-src 'self' https://vercel.live/;
        `
    }

    // for production environment white-list vitals.vercel-insights
    // based on: https://vercel.com/docs/speed-insights
    if (process.env.NODE_ENV === "production") {
        return `
            ${defaultsCSPHeaders}
            font-src 'self';
            style-src 'self' 'unsafe-inline';
            script-src 'self';
            connect-src 'self' https://vitals.vercel-insights.com;
            img-src 'self';
            frame-src 'none';
        `
    }

    // for dev environment enable unsafe-eval for hot-reload
    return `
        ${defaultsCSPHeaders}
        font-src 'self';
        style-src 'self' 'unsafe-inline';
        script-src 'self';
        connect-src 'self';
        img-src 'self' data:;
        frame-src 'none';
    `
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    poweredByHeader: false,
    experimental: {
        // mdx pages are not typed in prod builds
        //typedRoutes: true,
    },
    headers: async () => {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: cspReportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy',
                        value: cspHeader().replace(/\n/g, ''),
                    },
                ],
            },
        ]
    },
};

export default nextConfig;
