package models

// Math request payload
type MathRequest struct {
	A float64 `json:"a"`
	B float64 `json:"b"`
}

// Math response payload
type MathResponse struct {
	Result float64 `json:"result"`
}
