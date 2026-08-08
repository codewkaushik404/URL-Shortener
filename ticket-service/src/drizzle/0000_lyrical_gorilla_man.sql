CREATE TABLE `allocations` (
	`id` int NOT NULL,
	`next_available` bigint NOT NULL,
	CONSTRAINT `allocations_id` PRIMARY KEY(`id`)
);
