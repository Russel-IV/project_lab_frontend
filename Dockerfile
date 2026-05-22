# ==========================================
# DEVELOPMENT STAGE: React + Vite + pnpm
# ==========================================
# We use Node 22 alpine, which is lightweight and fast.
FROM node:22-alpine

# Install pnpm globally using npm (which comes preinstalled with Node)
RUN npm install -g pnpm

# Set the working directory inside the container
WORKDIR /app

# Copy the dependency descriptors to run a cached install
# Copying pnpm-lock.yaml guarantees exact version matching among all team members.
COPY package.json pnpm-lock.yaml* ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application files.
# In development, the local source code is mounted as a volume, 
# but copying files here ensures the image is self-contained.
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Start the Vite development server.
# The server is configured in vite.config.ts to allow outside connections.
CMD ["pnpm", "run", "dev"]
