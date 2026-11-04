--
-- PostgreSQL database dump
--

\restrict qc6bOZCRTeLsLFcOGHshiAduFo3tFx3IPByN4HS8e4Versp9lN4LWDC2eYSRd7o

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: grades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.grades (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "studentId" uuid NOT NULL,
    "subjectId" uuid NOT NULL,
    grade double precision NOT NULL,
    "createRowTime" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.grades OWNER TO postgres;

--
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "fullName" character varying NOT NULL,
    "studentNumber" character varying NOT NULL,
    "enrollmentDate" date NOT NULL
);


ALTER TABLE public.students OWNER TO postgres;

--
-- Name: subjects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subjects (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.subjects OWNER TO postgres;

--
-- Name: grades_view; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.grades_view AS
 SELECT grades.id,
    grades."studentId",
    students."fullName" AS "studentFullName",
    students."studentNumber",
    grades."subjectId",
    subjects.name AS "subjectName",
    grades.grade,
    grades."createRowTime"
   FROM ((public.grades
     JOIN public.students ON ((grades."studentId" = students.id)))
     JOIN public.subjects ON ((grades."subjectId" = subjects.id)));


ALTER VIEW public.grades_view OWNER TO postgres;

--
-- Data for Name: grades; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.grades (id, "studentId", "subjectId", grade, "createRowTime") FROM stdin;
10eebc99-9c0b-4ef8-bb6d-6bb9bd380a17	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14	85.5	2026-10-01 10:00:00+00
20eebc99-9c0b-4ef8-bb6d-6bb9bd380a18	a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15	92	2026-10-15 14:30:00+00
30eebc99-9c0b-4ef8-bb6d-6bb9bd380a19	b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12	d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14	78	2026-10-01 10:00:00+00
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (id, "fullName", "studentNumber", "enrollmentDate") FROM stdin;
a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11	Иванов Иван Иванович	2021-001	2021-09-01
b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12	Петрова Мария Сергеевна	2021-002	2021-09-01
c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13	Сидоров Алексей Петрович	2022-001	2022-09-01
\.


--
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subjects (id, name) FROM stdin;
d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14	Программная инженерия
e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15	Базы данных
f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a16	Алгоритмы и структуры данных
\.


--
-- Name: grades grades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT grades_pkey PRIMARY KEY (id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: subjects subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY (id);


--
-- Name: grades grades_studentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT "grades_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES public.students(id);


--
-- Name: grades grades_subjectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.grades
    ADD CONSTRAINT "grades_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES public.subjects(id);


--
-- PostgreSQL database dump complete
--

\unrestrict qc6bOZCRTeLsLFcOGHshiAduFo3tFx3IPByN4HS8e4Versp9lN4LWDC2eYSRd7o

