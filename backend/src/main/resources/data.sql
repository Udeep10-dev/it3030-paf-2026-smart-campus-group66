DO $$
BEGIN
	IF to_regclass('public.resource') IS NOT NULL THEN
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
		) VALUES
			('RM-101', 'Computer Lab A', 'LAB', 40, 'Block A - Floor 1', '08:00:00', '17:00:00', 'AVAILABLE', 'Desktop-enabled computer laboratory', NOW(), NOW()),
			('RM-102', 'Lecture Hall 02', 'HALL', 120, 'Main Building - Floor 2', '08:30:00', '18:00:00', 'AVAILABLE', 'Projector and audio system included', NOW(), NOW()),
			('RM-103', 'Seminar Room B', 'ROOM', 25, 'Block B - Floor 3', '09:00:00', '16:00:00', 'AVAILABLE', 'Ideal for meetings and group discussions', NOW(), NOW()),
			('RM-104', 'Innovation Hub', 'LAB', 30, 'Tech Wing - Floor 1', '10:00:00', '19:00:00', 'MAINTENANCE', 'Temporarily unavailable for upgrades', NOW(), NOW()),
			('RM-105', 'Mini Auditorium', 'HALL', 80, 'Student Center', '08:00:00', '20:00:00', 'AVAILABLE', 'Suitable for presentations and events', NOW(), NOW());
	ELSIF to_regclass('public.resources') IS NOT NULL THEN
		INSERT INTO resources (
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
		) VALUES
			('RM-101', 'Computer Lab A', 'LAB', 40, 'Block A - Floor 1', '08:00:00', '17:00:00', 'AVAILABLE', 'Desktop-enabled computer laboratory', NOW(), NOW()),
			('RM-102', 'Lecture Hall 02', 'HALL', 120, 'Main Building - Floor 2', '08:30:00', '18:00:00', 'AVAILABLE', 'Projector and audio system included', NOW(), NOW()),
			('RM-103', 'Seminar Room B', 'ROOM', 25, 'Block B - Floor 3', '09:00:00', '16:00:00', 'AVAILABLE', 'Ideal for meetings and group discussions', NOW(), NOW()),
			('RM-104', 'Innovation Hub', 'LAB', 30, 'Tech Wing - Floor 1', '10:00:00', '19:00:00', 'MAINTENANCE', 'Temporarily unavailable for upgrades', NOW(), NOW()),
			('RM-105', 'Mini Auditorium', 'HALL', 80, 'Student Center', '08:00:00', '20:00:00', 'AVAILABLE', 'Suitable for presentations and events', NOW(), NOW());
	END IF;
END $$;
