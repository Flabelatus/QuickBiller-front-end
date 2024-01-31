package repositories

import "quickBiller/internal/models"

func (r *GORMRepo) InsertImage(image *models.Image) (*models.Image, error) {
	result := r.DB.Create(&image)
	if result.Error != nil {
		return nil, result.Error
	}

	return image, nil
}

func (r *GORMRepo) GetLogoByUserID(userID string) (*models.Image, error) {
	var image models.Image

	// Order by ID in descending order to get the latest image
	err := r.DB.Where("user_id = ?", userID).Order("id DESC").First(&image).Error
	if err != nil {
		return nil, err
	}

	return &image, nil
}

func (r *GORMRepo) GetLogoByImageName(imageName string) (*models.Image, error) {
	var image *models.Image

	err := r.DB.Where("filename = ?", imageName).First(&image).Error
	if err != nil {
		return nil, err
	}
	return image, nil
}
