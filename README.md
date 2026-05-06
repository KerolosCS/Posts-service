# Posts Service

Simple event-driven posts service built with Node.js, Express, MongoDB, Kafka, and Docker.

## Short Explanation

The API creates and reads posts.

When a post is created:

1. The API saves the post in MongoDB.
2. The API publishes a `POST_CREATED` event to Kafka.
3. The consumer reads the event from Kafka and logs it.

Flow:

```text
Client -> API -> MongoDB -> Kafka -> Consumer
```

## How to Run Locally

Make sure Docker is running, then run:

```bash
docker compose up --build
```

API will run on:

```text
http://localhost:3000
```

## API Endpoints

Health check:

```http
GET /health
```

Create post:

```http
POST /api/posts
```

Example body:

```json
{
  "title": "Test Post",
  "content": "Hello from posts service",
  "author": "Kerolos"
}
```

List posts:

```http
GET /api/posts
```

Get post by id:

```http
GET /api/posts/:id
```


## Docker Services

```text
api        Express API
consumer   Kafka consumer
mongo      MongoDB database
kafka      Kafka broker
```

