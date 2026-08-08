CREATE TABLE `urls` (
	`short_id` varchar(7) NOT NULL,
	`original_url` varchar(2000) NOT NULL,
	`user_id` int,
	`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`expiredAt` datetime NOT NULL,
	CONSTRAINT `urls_short_id` PRIMARY KEY(`short_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(40) NOT NULL,
	`username` varchar(20) NOT NULL,
	`createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `urls` ADD CONSTRAINT `urls_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE cascade;