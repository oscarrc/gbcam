import { defineConfig, loadEnv } from 'vite'

import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression';

export default ({ mode }) => {
    let env = loadEnv(mode, process.cwd());

    return defineConfig({
        base: '/',
        server: {    
            open: true, 
            port: 3000,
            host: true,
            watch: {
                usePolling: true
            }
        },
        build: {
            outDir: "build",
            emptyOutDir: true
        },
        plugins: [,
            react(),
            VitePWA({ 
                registerType: 'autoUpdate',
                manifest: {
                    "name": "Virtual GBCam",
                    "short_name": "GBCam",
                    "description": "A Lo-Fi camera designed for those nostalgic 90s kids. Take photos with a limited shades of green palette, with a pixelated look and share them.",    
                    "categories": ["Image", "Photography", "Camera"],
                    "dir": "ltr",
                    "lang": "en",
                    "theme_color": "#000000",
                    "background_color": "#F1B32F",
                    "display": "fullscreen",
                    "orientation": "portrait",
                    "scope": "/",
                    "start_url": "/",
                    "screenshots": [
                      {
                        "src": "assets/feature/graphic.png",
                        "type": "image/png",
                        "sizes": "1024x500",
                        "form_factor": "wide",
                      }
                    ],
                    "icons": [
                        {
                          "src": "favicon.ico",
                          "sizes": "48x48",
                          "type": "image/x-icon"
                        },
                        {
                            "src": "icons/maskable_icon_x48.png",
                            "type": "image/png",
                            "sizes": "48x48",
                            "purpose": "maskable"
                        },
                        {
                            "src": "icons/maskable_icon_x72.png",
                            "type": "image/png",
                            "sizes": "72x72",
                            "purpose": "maskable"
                        },
                        {
                            "src": "icons/maskable_icon_x96.png",
                            "type": "image/png",
                            "sizes": "96x96",
                            "purpose": "maskable"
                        },
                        {
                            "src": "icons/maskable_icon_x128.png",
                            "type": "image/png",
                            "sizes": "128x128",
                            "purpose": "maskable"
                        },
                        {
                            "src": "icons/maskable_icon_x384.png",
                            "type": "image/png",
                            "sizes": "384x384",
                            "purpose": "maskable"
                        },
                        {
                            "src": "icons/maskable_icon_x512.png",
                            "type": "image/png",
                            "sizes": "512x512",
                            "purpose": "maskable"
                        },
                        {
                            "src": "icons/maskable_icon.png",
                            "type": "image/png",
                            "sizes": "1024x1024",
                            "purpose": "maskable"
                        },
                        {
                          "src": "icons/monochrome_icon.svg",
                          "type": "image/svg+xml",
                          "sizes": "any",
                          "purpose": "monochrome"
                        },
                        {
                          "src": "icons/icon.svg",
                          "type": "image/svg+xml",
                          "sizes": "any",
                          "purpose": "any"
                        }
                    ],
                    "related_applications": [
                        {
                          "platform": "web",
                          "url": "https://gbcam.oscarrc.me"
                        }, 
                        {
                          "platform": "play",
                          "url": "https://play.google.com/store/apps/details?id=me.oscarrc.gbcam.twa",
                          "id": "me.oscarrc.gbcam.twa"
                        }
                      ]
                },
                workbox: {
                    globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
                    maximumFileSizeToCacheInBytes: 3000000,
                    runtimeCaching: [
                        {
                            urlPattern: new RegExp(`^${env.VITE_SERVER_URL}\/*\/.(svg|png)`, "i"),
                            handler: 'CacheFirst',
                            options: {
                                cacheName: 'image-cache',
                                expiration: {
                                    maxEntries: 10,
                                    maxAgeSeconds: 60 * 60 * 24 * 365 // <== 1 year
                                },
                                cacheableResponse: {
                                    statuses: [0, 200]
                                }
                            }
                        }
                    ]
                }
            }),
            viteCompression()
        ]
    })
}