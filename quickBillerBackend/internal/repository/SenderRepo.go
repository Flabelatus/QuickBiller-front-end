package repositories

import (
	"errors"
	"fmt"
	"quickBiller/internal/models"

	"gorm.io/gorm"
)

func (r *GORMRepo) InserSender(sender *models.Sender) (int, error) {
	result := r.DB.Create(&sender)
	if result.Error != nil {
		return 0, result.Error
	}
	return int(sender.ID), nil
}

func (r *GORMRepo) GetSenderByID(id int) (*models.Sender, error) {
	var sender *models.Sender
	if err := r.DB.First(&sender, id).Error; err != nil {
		return nil, err
	}
	return sender, nil
}

func (r *GORMRepo) GetSenderByUserID(userID string) (*models.Sender, error) {
	var sender *models.Sender
	if err := r.DB.Where("user_id = ?", userID).Find(&sender).Error; err != nil {
		return nil, err
	}
	return sender, nil
}

func (r *GORMRepo) DeleteSenderByID(id int) error {
	sender := &models.Sender{}
	if err := r.DB.Where("id = ?", id).First(&sender).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fmt.Errorf("sender not found")
		}
		return err
	}
	if err := r.DB.Unscoped().Delete(sender, "id = ?", id).Error; err != nil {
		return err
	}
	return nil
}

func (r *GORMRepo) UpdateSenderByID(id int, sender *models.Sender) (int, error) {
	var existingSender *models.Sender
	if err := r.DB.Where("id = ?", id).Find(&existingSender).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return 0, fmt.Errorf("sender not found")
		}
		return 0, err
	}

	result := r.DB.Model(&existingSender).Updates(sender)
	if result.Error != nil {
		return 0, result.Error
	}
	return int(existingSender.ID), nil
}
