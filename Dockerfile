FROM node
WORKDIR /build
COPY package.json package-lock.json ./
COPY client ./client
RUN npm install
RUN npm run build:web -w client

FROM golang
WORKDIR /build
COPY server ./
COPY --from=0 /build/client/dist/web ./cmd/sourcetab/public
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s" ./cmd/sourcetab

FROM scratch
COPY --from=1 /build/sourcetab /bin/sourcetab
EXPOSE 3333
CMD ["/bin/sourcetab"]
