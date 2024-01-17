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
		models.Mode{},
		models.Invoice{},
		models.Quote{},
		models.Client{},
		models.Sender{},
	)
	if err != nil {
		return err
	}
	return nil
}
