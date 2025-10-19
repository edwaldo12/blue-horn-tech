package domain

import "time"

// RequestLog models an HTTP request/response log entry persisted for auditing.
type RequestLog struct {
	ID        string
	Method    string
	Path      string
	Query     string
	Status    int
	Latency   time.Duration
	IP        string
	UserAgent string
	CreatedAt time.Time
}
