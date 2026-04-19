INSERT INTO resource (
	resource_code,
	name,
	type,
	capacity,
	location,
	availability_start,
	availability_end,
	status,
	description,
	created_at,
	updated_at
)
SELECT 'RM-101', 'Computer Lab A', 'LAB', 40, 'Block A - Floor 1', '08:00:00', '17:00:00', 'AVAILABLE', 'Desktop-enabled computer laboratory', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM resource WHERE resource_code = 'RM-101');

INSERT INTO resource (
	resource_code,
	name,
	type,
	capacity,
	location,
	availability_start,
	availability_end,
	status,
	description,
	created_at,
	updated_at
)
SELECT 'RM-102', 'Lecture Hall 02', 'HALL', 120, 'Main Building - Floor 2', '08:30:00', '18:00:00', 'AVAILABLE', 'Projector and audio system included', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM resource WHERE resource_code = 'RM-102');

INSERT INTO resource (
	resource_code,
	name,
	type,
	capacity,
	location,
	availability_start,
	availability_end,
	status,
	description,
	created_at,
	updated_at
)
SELECT 'RM-103', 'Seminar Room B', 'ROOM', 25, 'Block B - Floor 3', '09:00:00', '16:00:00', 'AVAILABLE', 'Ideal for meetings and group discussions', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM resource WHERE resource_code = 'RM-103');

INSERT INTO resource (
	resource_code,
	name,
	type,
	capacity,
	location,
	availability_start,
	availability_end,
	status,
	description,
	created_at,
	updated_at
)
SELECT 'RM-104', 'Innovation Hub', 'LAB', 30, 'Tech Wing - Floor 1', '10:00:00', '19:00:00', 'MAINTENANCE', 'Temporarily unavailable for upgrades', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM resource WHERE resource_code = 'RM-104');

INSERT INTO resource (
	resource_code,
	name,
	type,
	capacity,
	location,
	availability_start,
	availability_end,
	status,
	description,
	created_at,
	updated_at
)
SELECT 'RM-105', 'Mini Auditorium', 'HALL', 80, 'Student Center', '08:00:00', '20:00:00', 'AVAILABLE', 'Suitable for presentations and events', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM resource WHERE resource_code = 'RM-105');
