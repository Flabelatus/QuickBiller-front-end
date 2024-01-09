package repositories

import (
	"errors"
	"fmt"
	"quickBiller/internal/models"

	"gorm.io/gorm"
)

func (r *GORMRepo) GetAllModes() ([]models.Mode, error) {
	var modes []models.Mode
	err := r.DB.Find(&modes).Error
	if err != nil {
		return nil, err
	}
	return modes, nil
}

func (r *GORMRepo) GetModeByID(id int) (*models.Mode, error) {
	var mode *models.Mode
	err := r.DB.First(&mode, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("mode not found")
		}
		return nil, err
	}
	return mode, nil
}

func (r *GORMRepo) CreateMode(mode *models.Mode) error {

	tx := r.DB.Begin()
	tx.SavePoint("beforeCreateMode")
	if err := tx.Create(&mode).Error; err != nil {
		tx.RollbackTo("beforeCreateMode")
		return err
	}
	tx.Commit()
	return nil
}

func (r *GORMRepo) DeleteModeByID(id int) error {
	mode := &models.Mode{}

	if err := r.DB.Where("id = ?", id).First(&mode).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fmt.Errorf("mode not found")
		}
		return err
	}

	tx := r.DB.Begin()
	tx.SavePoint("beforeDeleteMode")
	if err := tx.Delete(&mode, "id = ?", id).Error; err != nil {
		tx.RollbackTo("beforeDeleteMode")
		return err
	}
	return nil
}

func (r *GORMRepo) UpdateMode(id int, mode *models.Mode) error {
	var existingMode *models.Mode
	err := r.DB.First(&existingMode, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fmt.Errorf("mode not found")
		}
		return err
	}

	tx := r.DB.Begin()
	tx.SavePoint("beforeUpdateMode")
	err = tx.Model(&existingMode).Updates(mode).Error
	if err != nil {
		tx.RollbackTo("beforeUpdateMode")
		return err
	}
	return nil
}

func (r *GORMRepo) GetAllUsers() ([]models.User, error) {
	var users []models.User
	err := r.DB.Find(&users).Error
	if err != nil {
		return nil, err
	}
	return users, nil
}

func (r *GORMRepo) GetUserByID(id uint) (*models.User, error) {
	var currentUser *models.User
	err := r.DB.Preload("Mode").First(&currentUser, id).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("user not found")
		}
		return nil, err
	}
	return currentUser, nil
}

func (r *GORMRepo) GetUserByEmail(email string) (*models.User, error) {
	var user *models.User
	err := r.DB.Where("email = ?", email).First(&user).Error
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (r *GORMRepo) CreateAdminUser(user *models.User) error {
	tx := r.DB.Begin()
	tx.SavePoint("beforeCreateAdminUser")
	if err := tx.Create(&user).Error; err != nil {
		tx.RollbackTo("beforeCreateAdminUser")
		return err
	}
	tx.Commit()
	return nil
}

func (r *GORMRepo) CreateUser(user *models.User) error {
	var currUser models.User

	if err := r.DB.Where("email = ?", user.Email).First(&currUser).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			tx := r.DB.Begin()
			tx.SavePoint("beforeCreateUser")
			if err := tx.Create(&user).Error; err != nil {
				tx.RollbackTo("beforeCreateUser")
				return err
			}
			tx.Commit()
			return nil
		}
		return err
	}

	return fmt.Errorf("user already exists")
}

func (r *GORMRepo) DeleteUserByID(id uint) error {
	user := &models.User{}

	if err := r.DB.Where("id = ?", id).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return fmt.Errorf("user not found")
		}
		return err
	}
	tx := r.DB.Begin()
	tx.SavePoint("beforeDeleteUser")
	if err := tx.Delete(user, "id = ?", id).Error; err != nil {
		tx.RollbackTo("beforeDeleteUser")
		return err
	}
	tx.Commit()
	return nil
}

// UPDATE USER
func (r *GORMRepo) UpdateUser(id uint, user *models.User) error {
	var existingUser *models.User
	err := r.DB.First(&existingUser, id).Error
	if err != nil {
		return err
	}
	tx := r.DB.Begin()
	tx.SavePoint("beforeUpdateUser")
	result := tx.Model(&existingUser).Updates(user)
	if result.Error != nil {
		tx.RollbackTo("beforeUpdateUser")
		return result.Error
	}
	tx.Commit()
	return nil
}
