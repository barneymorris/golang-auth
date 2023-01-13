package enviroment

type EnvConfig struct {
	DbUser     string `env:"DBUSER" envDefault:"go"`
	DbPassword string `env:"DBPASSWORD" envDefault:"pass"`
	DbHost     string `env:"DBHOST" envDefault:"db"`
	DbPort     string `env:"DBPORT" envDefault:"3306"`
	DbName     string `env:"DBNAME" envDefault:"db"`
}

func GetConfig() *EnvConfig {
	return &EnvConfig{}
}