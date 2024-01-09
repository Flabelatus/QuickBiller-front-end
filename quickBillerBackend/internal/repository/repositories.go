package repositories

import (
	"quickBiller/internal/models"
	"sync"

	"gorm.io/gorm"
)

type GORMRepo struct {
	DB    *gorm.DB
	Mutex sync.Mutex
}

func (r *GORMRepo) Migrate() error {
	err := r.DB.AutoMigrate(
		models.User{},
		models.Invoice{},
		models.Client{},
		models.Sender{},
		models.Quote{},
	)
	if err != nil {
		return err
	}
	return nil
}
