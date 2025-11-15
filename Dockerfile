FROM mcr.microsoft.com/dotnet/runtime-deps:8.0

# Set working directory
WORKDIR /app

# Copy published app into the container
COPY . /app

# Expose the default port used by DigitalOcean App Platform
EXPOSE 8080

# Update the application to listen on port 8080
ENV DOTNET_URLS=http://+:8080

# Make the app executable
RUN chmod +x /app/Eol2000Live

# Set the entry point
ENTRYPOINT ["/app/Eol2000Live"]
