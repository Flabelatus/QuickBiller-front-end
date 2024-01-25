package repositories

import (
	"errors"
	"fmt"
	"quickBiller/internal/models"

	"gorm.io/gorm"
)

func (r *GORMRepo) InserInvoice(invoice *models.Invoice) (int, error) {
	result := r.DB.Create(&invoice)
	if result.Error != nil {
		return 0, result.Error
	}
	return int(invoice.ID), nil
}

func (r *GORMRepo) GetInvoiceByID(id int) (*models.Invoice, error) {
	var invocie *models.Invoice
	if err := r.DB.First(&invocie, id).Error; err != nil {
		return nil, err
	}
	return invocie, nil
}

func (r *GORMRepo) GetInvoicesByUserID(userID string) ([]*models.Invoice, error) {
	var invoices []*models.Invoice
	if err := r.DB.Where("user_id = ?", userID).Order("created_at DESC").Find(&invoices).Error; err != nil {
		return nil, err
	}
	return invoices, nil
}

func (r *GORMRepo) DeleteInvoiceByID(id int) error {
	invoice := &models.Invoice{}
	if err := r.DB.Where("id = ?", id).First(&invoice).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fmt.Errorf("invoice not found")
		}
		return err
	}
	if err := r.DB.Unscoped().Delete(invoice, "id = ?", id).Error; err != nil {
		return err
	}
	return nil
}
