package repositories

import (
	"errors"
	"fmt"
	"quickBiller/internal/models"

	"gorm.io/gorm"
)

func (r *GORMRepo) InserQuote(quote *models.Quote) (int, error) {
	result := r.DB.Create(&quote)
	if result.Error != nil {
		return 0, result.Error
	}
	return int(quote.ID), nil
}

func (r *GORMRepo) GetQuoteByID(id int) (*models.Quote, error) {
	var quote *models.Quote
	if err := r.DB.First(&quote, id).Error; err != nil {
		return nil, err
	}
	return quote, nil
}

func (r *GORMRepo) GetQuotesByUserID(userID string) ([]*models.Quote, error) {
	var quotes []*models.Quote
	if err := r.DB.Where("user_id = ?", userID).Order("created_at DESC").Find(&quotes).Error; err != nil {
		return nil, err
	}
	return quotes, nil
}

func (r *GORMRepo) DeleteQuoteByID(id int) error {
	quote := &models.Quote{}
	if err := r.DB.Where("id = ?", id).First(&quote).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fmt.Errorf("quote not found")
		}
		return err
	}
	if err := r.DB.Unscoped().Delete(quote, "id = ?", id).Error; err != nil {
		return err
	}
	return nil
}
