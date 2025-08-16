package controller

import (
	"github.com/DATA-DOG/go-sqlmock"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestUpdatePaymentStatus(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("Error creating mock database: '%s'", err)
	}
	defer db.Close()

	adminController := &AdminController{DB: db}

	mock.ExpectExec("UPDATE orders SET payment_status = 'paid' WHERE order_id = ?").
		WithArgs("order-123").
		WillReturnResult(sqlmock.NewResult(1, 1))

	requestBody := `{"order_id": "order-123"}`
	req, err := http.NewRequest("POST", "/admin/payment-status", strings.NewReader(requestBody))
	if err != nil {
		t.Fatal(err)
	}

	w := httptest.NewRecorder()
	handlerFunc := http.HandlerFunc(adminController.UpdatePaymentStatus)
	handlerFunc.ServeHTTP(w, req)

	expected := `{"message":"Payment status updated successfully"}`
	if w.Body.String() != expected && strings.TrimSpace(w.Body.String()) != expected {
		t.Errorf("The function returned unexpected body: got %v wanted %v", w.Body.String(), expected)
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("Expectations were not met: %s", err)
	}
}
