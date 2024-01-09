package repositories

import (
	"errors"
	"fmt"
	"quickBiller/internal/models"

	"gorm.io/gorm"
)

// InsertClient inserts a new Client record into the database.
func (r *GORMRepo) InsertClientInvoice(client *models.ClientInvoice) (int, error) {
	result := r.DB.Create(&client)
	if result.Error != nil {
		return 0, result.Error
	}
	return int(client.ID), nil
}

// GetClientByID retrieves a Client by its ID.
func (r *GORMRepo) GetClientInvoiceByID(id int) (*models.ClientInvoice, error) {
	var client *models.ClientInvoice
	if err := r.DB.First(&client, id).Error; err != nil {
		return nil, err
	}
	return client, nil
}

// GetClientByUserID retrieves a Client by its associated User ID.
func (r *GORMRepo) GetClientByUserID(userID int) (*models.ClientInvoice, error) {
	var client *models.ClientInvoice
	if err := r.DB.Where("user_id = ?", userID).Find(&client).Error; err != nil {
		return nil, err
	}
	return client, nil
}

// DeleteClientByID deletes a Client record by its ID.
func (r *GORMRepo) DeleteClientInvoiceByID(id int) error {
	client := &models.ClientInvoice{}
	if err := r.DB.Where("id = ?", id).First(&client).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fmt.Errorf("client not found")
		}
		return err
	}
	if err := r.DB.Unscoped().Delete(client, "id = ?", id).Error; err != nil {
		return err
	}
	return nil
}

// UpdateClientByID updates a Client record by its ID.
func (r *GORMRepo) UpdateClientInvoiceByID(id int, client *models.ClientInvoice) (int, error) {
	var existingClient *models.ClientInvoice
	if err := r.DB.Where("id = ?", id).Find(&existingClient).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return 0, fmt.Errorf("client not found")
		}
		return 0, err
	}

	result := r.DB.Model(&existingClient).Updates(client)
	if result.Error != nil {
		return 0, result.Error
	}
	return int(client.ID), nil
}

func (r *GORMRepo) GetClientInvoiceByName(name string) (*models.ClientInvoice, error) {
	var client *models.ClientInvoice
	if err := r.DB.Where("company_name = ?", name).First(&client).Error; err != nil {
		return nil, err
	}
	return client, nil
}
