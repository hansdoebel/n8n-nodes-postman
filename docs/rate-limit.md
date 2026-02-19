# Postman API Rate Limits

> Source: [Postman API Rate Limits](https://learning.postman.com/docs/developer/postman-api/postman-api-rate-limits/)

## Overview

The Postman API enforces rate limits on a **per-user basis** using your API key. The default limit is **300 requests per minute**. Monthly request quotas also apply and vary depending on your Postman plan.

## Per-Minute Limit

| Limit | Window |
|-------|--------|
| 300 requests | 60 seconds (rolling) |

When the limit is exceeded, the API returns an HTTP `429 Too Many Requests` response. Use the `RetryAfter` header to determine how long to wait before retrying.

## Monthly Limit

The total number of requests permitted per month depends on your Postman plan. Check your account's **Resource Usage** dashboard or the [Postman pricing page](https://www.postman.com/pricing/) for your plan's monthly allocation.

## Rate Limit Response Headers

The API returns the following headers on every response to help you monitor consumption:

| Header | Description |
|--------|-------------|
| `RateLimit` | Combined header showing `limit`, `remaining`, and `reset` (seconds) |
| `RateLimit-Policy` | Active policy string, e.g. `300;w=60` (300 req per 60 s window) |
| `RateLimit-Limit` / `X-RateLimit-Limit` | Maximum requests allowed per minute |
| `RateLimit-Remaining` / `X-RateLimit-Remaining` | Requests remaining in the current window |
| `RateLimit-Reset` / `X-RateLimit-Reset` | UTC epoch timestamp (seconds) when the window resets |
| `RetryAfter` / `X-RateLimit-RetryAfter` | Seconds to wait before retrying after a `429` response |

Monthly quota headers are also included to track your plan's total allowance and remaining balance.

## Handling Rate Limit Errors

When you receive a `429` response:

1. Read the `RetryAfter` header for the number of seconds to wait.
2. Pause requests for that duration before retrying.
3. Consider implementing exponential backoff for robust error handling.
