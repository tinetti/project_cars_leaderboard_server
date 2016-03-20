DROP KEYSPACE IF EXISTS "project_cars_leaderboard";
CREATE KEYSPACE IF NOT EXISTS project_cars_leaderboard WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };


USE project_cars_leaderboard;

DROP TABLE IF EXISTS telemetry_packets;
CREATE TABLE telemetry_packets (
    "id" timeuuid PRIMARY KEY,
	"car_name" text,
	"car_class_name" text,
	"track_location" text,
	"track_variation" text
);
