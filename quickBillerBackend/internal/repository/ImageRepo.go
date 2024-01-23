package repositories

import "quickBiller/internal/models"

func (r *GORMRepo) InsertImage(image *models.Image) (int, error) {
	result := r.DB.Create(&image)
	if result.Error != nil {
		return 0, result.Error
	}

	return int(image.ID), nil
}

func (r *GORMRepo) GetLogoByUserID(userID string) (*models.Image, error) {
	var image *models.Image

	err := r.DB.Where("user_id", userID).First(&image).Error
	if err != nil {
		return nil, err
	}

	return image, nil
}
