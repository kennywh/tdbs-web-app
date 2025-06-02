# Use the OpenShift Nginx image as base
FROM default-route-openshift-image-registry.apps.ocp-dev.lcsd.hksarg/tdbs-uat/nginx-126:latest

# Switch to root user temporarily to modify files
USER 0

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


# Expose port 8080 (OpenShift default)
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
