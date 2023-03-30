docker-up:
	@cd docker && docker-compose -p template-nestjs up -d database rabbitmq redis

.PHONY: docker-down
docker-down:
	@cd docker && docker-compose -p template-nestjs down

.PHONY: migrate
migrate:
	yarn typeorm migration:run -d=ormconfig.ts


# example = make generate-migration name="migration-name"
.PHONY: generate-migration
generate-migration:
	yarn typeorm migration:generate src/database/migration/${name} -d=ormconfig.ts

.PHONY: revert-migration
revert-migration:
	yarn typeorm migration:revert -d=ormconfig.ts
