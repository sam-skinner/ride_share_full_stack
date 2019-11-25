create table if not exists driver
(
	id integer not null
		constraint driver_pk
			primary key,
	first_name varchar,
	last_name varchar,
	phone varchar,
	license_number varchar
);

create table if not exists passenger
(
	id integer not null
		constraint passenger_pk
			primary key,
	first_name varchar,
	last_name varchar,
	phone varchar
);

create table if not exists vehicle_type
(
	id integer not null
		constraint vehicle_type_pk
			primary key,
	type varchar
);

create table if not exists vehicle
(
	id integer not null
		constraint vehicle_pk
			primary key,
	make varchar,
	model varchar,
	color varchar,
	vehicle_type_id integer
		constraint vehicle_type_id
			references vehicle_type,
	capacity integer,
	mpg double precision,
	license_state varchar,
	license_number varchar
);

create table if not exists "authorization"
(
	driver_id integer
		constraint driver_id
			references driver,
	vehicle_id integer
		constraint vehicle_id
			references vehicle
);

create table if not exists state
(
	abbreviation varchar not null
		constraint state_pk
			primary key,
	name varchar
);

create table if not exists location
(
	id integer not null
		constraint location_pk
			primary key,
	name varchar,
	address varchar,
	city varchar,
	state varchar
		constraint state
			references state,
	zip_code varchar
);

create table if not exists ride
(
	id integer not null
		constraint ride_pk
			primary key,
	date date,
	time time,
	distance double precision,
	fuel_price double precision,
	fee double precision,
	vehicle_id integer
		constraint vehicle_id
			references vehicle,
	from_location_id integer
		constraint from_location_id
			references location,
	to_location_id integer
		constraint to_location_id
			references location
);

create table if not exists passengers
(
	passenger_id integer
		constraint passenger_id
			references passenger,
	ride_id integer
		constraint ride_id
			references ride
);

create table if not exists drivers
(
	driver_id integer
		constraint driver_id
			references driver,
	ride_id integer
		constraint ride_id
			references ride
);