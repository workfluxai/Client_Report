# Create ultra-fast deployment script for 3-hour deadline
urgent_deployment_script = """#!/bin/bash

# 🚨 URGENT: 3-HOUR DEPLOYMENT SCRIPT 🚨
# For workfluxai.com - Client Report System
# Execute this step-by-step as root user

echo "🚀 URGENT DEPLOYMENT: Client Report System"
echo "⏰ Target: Live in 3 hours"
echo "🌐 Domain: workfluxai.com"
echo "📍 Subdomains: n8n.workfluxai.com, api.workfluxai.com"
echo "=================================="

# PHASE 1: SERVER SETUP (30 minutes)
echo "📦 PHASE 1: Installing Dependencies..."

# Update system
apt-get update && apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Git
apt-get install git -y

# Install Nginx for reverse proxy
apt-get install nginx -y

echo "✅ Dependencies installed"

# PHASE 2: N8N WITH GEMINI SETUP (45 minutes)
echo "📊 PHASE 2: Setting up n8n with Gemini support..."

# Create project directory
mkdir -p /opt/workfluxai-reports
cd /opt/workfluxai-reports

# Create docker-compose.yml with Gemini support
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  redis:
    image: redis:7-alpine
    container_name: n8n-redis
    restart: unless-stopped
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

  postgres:
    image: postgres:15-alpine
    container_name: n8n-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: n8n
      POSTGRES_USER: n8n
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Use official n8n image with latest Gemini nodes
  n8n-main:
    image: n8nio/n8n:latest
    container_name: n8n-main
    restart: unless-stopped
    environment:
      # Basic configuration
      - N8N_HOST=n8n.workfluxai.com
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://n8n.workfluxai.com/
      - GENERIC_TIMEZONE=Asia/Kolkata
      
      # Database configuration
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_PASSWORD=${POSTGRES_PASSWORD}
      
      # Queue mode configuration
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis
      - QUEUE_BULL_REDIS_PORT=6379
      - QUEUE_HEALTH_CHECK_ACTIVE=true
      
      # Security
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
      
      # Enable all community nodes (including Gemini)
      - N8N_COMMUNITY_PACKAGES_ENABLED=true
      
    ports:
      - "5678:5678"
    depends_on:
      - postgres
      - redis
    volumes:
      - n8n_data:/home/node/.n8n

  n8n-worker:
    image: n8nio/n8n:latest
    container_name: n8n-worker
    restart: unless-stopped
    environment:
      - GENERIC_TIMEZONE=Asia/Kolkata
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n
      - DB_POSTGRESDB_PASSWORD=${POSTGRES_PASSWORD}
      - EXECUTIONS_MODE=queue
      - QUEUE_BULL_REDIS_HOST=redis
      - QUEUE_BULL_REDIS_PORT=6379
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
      - N8N_COMMUNITY_PACKAGES_ENABLED=true
    depends_on:
      - postgres
      - redis
    command: n8n worker
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  redis_data:
  postgres_data:
  n8n_data:
EOF

echo "✅ Docker Compose configured"

# PHASE 3: ENVIRONMENT CONFIGURATION (15 minutes)
echo "🔧 PHASE 3: Environment Configuration..."

# Create environment file
cat > .env << 'EOF'
# Database Configuration
POSTGRES_PASSWORD=WorkfluxAI2025SecurePassword!

# n8n Security (CHANGE THIS!)
N8N_ENCRYPTION_KEY=WorkfluxAI2025UltraSecureEncryptionKey32Chars

# Timezone
GENERIC_TIMEZONE=Asia/Kolkata
EOF

echo "✅ Environment configured"

# PHASE 4: NGINX REVERSE PROXY (20 minutes)
echo "🌐 PHASE 4: Setting up Nginx reverse proxy..."

# Backup original nginx config
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup

# Create nginx configuration for n8n
cat > /etc/nginx/sites-available/n8n << 'EOF'
server {
    listen 80;
    server_name n8n.workfluxai.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name n8n.workfluxai.com;
    
    # SSL Configuration (using Ionos wildcard certificate)
    ssl_certificate /etc/ssl/certs/workfluxai.crt;
    ssl_certificate_key /etc/ssl/private/workfluxai.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    location / {
        proxy_pass http://127.0.0.1:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeouts for long-running workflows
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}

# API subdomain configuration
server {
    listen 80;
    server_name api.workfluxai.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.workfluxai.com;
    
    ssl_certificate /etc/ssl/certs/workfluxai.crt;
    ssl_certificate_key /etc/ssl/private/workfluxai.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    location / {
        proxy_pass http://127.0.0.1:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/n8n /etc/nginx/sites-enabled/

# Test nginx configuration
nginx -t

echo "✅ Nginx configured"

# PHASE 5: START SERVICES (10 minutes)
echo "🚀 PHASE 5: Starting all services..."

# Start Docker services
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
docker-compose ps

# Start nginx
systemctl restart nginx
systemctl enable nginx

echo "✅ All services started"

# PHASE 6: FINAL VERIFICATION (10 minutes)
echo "🔍 PHASE 6: Final verification..."

# Check if n8n is responding
sleep 10
if curl -f -k https://n8n.workfluxai.com/healthz; then
    echo "✅ n8n is responding on HTTPS"
else
    echo "❌ n8n is not responding - check logs"
fi

# Display important information
echo "=================================="
echo "🎉 DEPLOYMENT COMPLETE!"
echo "=================================="
echo "📍 n8n URL: https://n8n.workfluxai.com"
echo "📍 API URL: https://api.workfluxai.com"
echo ""
echo "📋 Next Steps:"
echo "1. Upload your SSL certificates to /etc/ssl/"
echo "2. Import the n8n workflow JSON"
echo "3. Configure credentials in n8n"
echo "4. Test the workflow"
echo ""
echo "🔧 Troubleshooting:"
echo "- Check logs: docker-compose logs -f n8n-main"
echo "- Check nginx: nginx -t && systemctl status nginx"
echo "- Check containers: docker-compose ps"
echo ""
echo "⚠️  IMPORTANT: Change default passwords in .env file!"
echo "=================================="
"""

# Save the urgent deployment script
with open('urgent-3hour-deployment.sh', 'w') as f:
    f.write(urgent_deployment_script)

# Create SSL certificate upload instructions
ssl_instructions = """# 📜 SSL Certificate Setup Instructions

## 🔐 Upload Your Ionos Wildcard SSL Certificate

Since you have Ionos wildcard SSL certificate, you need to upload it to your Hetzner server:

### Step 1: Download SSL files from Ionos
1. Login to Ionos control panel
2. Go to SSL certificates section
3. Download your wildcard certificate files:
   - `workfluxai.crt` (certificate file)
   - `workfluxai.key` (private key file)
   - `ca-bundle.crt` (certificate authority bundle - optional)

### Step 2: Upload to your Hetzner server
```bash
# Create SSL directories
sudo mkdir -p /etc/ssl/certs
sudo mkdir -p /etc/ssl/private

# Upload your files (replace with your actual file names)
sudo cp workfluxai.crt /etc/ssl/certs/
sudo cp workfluxai.key /etc/ssl/private/

# Set proper permissions
sudo chmod 644 /etc/ssl/certs/workfluxai.crt
sudo chmod 600 /etc/ssl/private/workfluxai.key

# Restart nginx to apply SSL
sudo systemctl restart nginx
```

### Step 3: Test SSL
```bash
# Test your SSL setup
openssl s_client -connect n8n.workfluxai.com:443 -servername n8n.workfluxai.com
```

## 🆘 If SSL doesn't work immediately:
You can temporarily use HTTP by commenting out the SSL sections in nginx config and restart nginx.
"""

with open('ssl-setup-instructions.txt', 'w') as f:
    f.write(ssl_instructions)

print("✅ URGENT 3-HOUR DEPLOYMENT PACKAGE READY!")
print("")
print("📁 Files created:")
print("   - urgent-3hour-deployment.sh")
print("   - ssl-setup-instructions.txt")
print("")
print("🚀 Execute immediately on your Hetzner CX22:")
print("1. Purchase Hetzner CX22 NOW")
print("2. SSH into server as root")
print("3. Run: chmod +x urgent-3hour-deployment.sh")
print("4. Run: ./urgent-3hour-deployment.sh")
print("5. Upload SSL certificates")
print("6. Import n8n workflow and configure credentials")