package repositories

import (
	"errors"
	"fmt"
	"quickBiller/internal/models"

	"gorm.io/gorm"
)

// InsertClient inserts a new Client record into the database.
func (r *GORMRepo) InsertClient(client *models.Client) (int, error) {
	result := r.DB.Create(&client)
	if result.Error != nil {
		return 0, result.Error
	}
	return int(client.ID), nil
}

// GetClientByID retrieves a Client by its ID.
func (r *GORMRepo) GetClientByID(id int) (*models.Client, error) {
	var client *models.Client
	if err := r.DB.First(&client, id).Error; err != nil {
		return nil, err
	}
	return client, nil
}

// GetClientByUserID retrieves Clients by its associated User ID.
func (r *GORMRepo) GetClientsByUserID(userID string) ([]*models.Client, error) {
	var clients []*models.Client
	if err := r.DB.Where("user_id = ?", userID).Find(&clients).Error; err != nil {
		return nil, err
	}
	return clients, nil
}

// DeleteClientByID deletes a Client record by its ID.
func (r *GORMRepo) DeleteClientByID(id int) error {
	client := &models.Client{}
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
func (r *GORMRepo) UpdateClientByID(id int, client *models.Client) (int, error) {
	var existingClient *models.Client
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

func (r *GORMRepo) GetClientByName(name string) (*models.Client, error) {
	var client *models.Client
	if err := r.DB.Where("company_name = ?", name).First(&client).Error; err != nil {
		return nil, err
	}
	return client, nil
}
