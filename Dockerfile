# Use the official Nginx image as base
FROM default-route-openshift-image-registry.apps-crc.testing/tdbs/nginx-122:1-99

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the built Next.js static files to nginx html directory
COPY out/ /usr/share/nginx/html/

# Create a custom nginx configuration for Next.js static export
RUN echo 'server { \
    listen 8080; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Handle static files and routing \
    location / { \
        try_files $uri $uri.html $uri/ =404; \
    } \
    \
    # Handle 404 errors \
    error_page 404 /404.html; \
    location = /404.html { \
        internal; \
    } \
    \
    # Cache static assets \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
    } \
    \
    # Security headers \
    add_header X-Frame-Options "SAMEORIGIN" always; \
    add_header X-Content-Type-Options "nosniff" always; \
    add_header X-XSS-Protection "1; mode=block" always; \
    \
    # Gzip compression \
    gzip on; \
    gzip_vary on; \
    gzip_min_length 1024; \
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json; \
}' > /etc/nginx/conf.d/default.conf

# Create nginx user and set permissions for OpenShift
RUN addgroup -g 1001 -S nginx-group && \
    adduser -S -D -H -u 1001 -h /var/cache/nginx -s /sbin/nologin -G nginx-group -g nginx-group nginx-user && \
    chown -R nginx-user:nginx-group /var/cache/nginx && \
    chown -R nginx-user:nginx-group /var/log/nginx && \
    chown -R nginx-user:nginx-group /etc/nginx/conf.d && \
    chown -R nginx-user:nginx-group /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Create necessary directories and set permissions
RUN mkdir -p /var/cache/nginx/client_temp /var/cache/nginx/proxy_temp /var/cache/nginx/fastcgi_temp /var/cache/nginx/uwsgi_temp /var/cache/nginx/scgi_temp && \
    chown -R nginx-user:nginx-group /var/cache/nginx && \
    chmod -R 755 /var/cache/nginx

# Switch to non-root user for OpenShift compatibility
USER 1001

# Expose port 8080 (OpenShift default)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
