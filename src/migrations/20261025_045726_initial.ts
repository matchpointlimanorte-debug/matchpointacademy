import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_niveles_horarios_dia" AS ENUM('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo');
  CREATE TYPE "public"."enum_niveles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__niveles_v_version_horarios_dia" AS ENUM('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo');
  CREATE TYPE "public"."enum__niveles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_entrenadores_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__entrenadores_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_galeria_categoria" AS ENUM('clases', 'torneos', 'instalaciones', 'comunidad');
  CREATE TYPE "public"."enum_torneos_estado" AS ENUM('proximo', 'finalizado');
  CREATE TYPE "public"."enum_torneos_inscripcion_tipo" AS ENUM('whatsapp', 'enlace', 'cerrada');
  CREATE TYPE "public"."enum_torneos_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__torneos_v_version_estado" AS ENUM('proximo', 'finalizado');
  CREATE TYPE "public"."enum__torneos_v_version_inscripcion_tipo" AS ENUM('whatsapp', 'enlace', 'cerrada');
  CREATE TYPE "public"."enum__torneos_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_testimonios_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__testimonios_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_planes_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__planes_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_faq_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__faq_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_users_rol" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_configuracion_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__configuracion_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_landing_secciones_tipo" AS ENUM('hero', 'quienes', 'niveles', 'entrenadores', 'galeria', 'torneos', 'planes', 'testimonios', 'faq', 'ubicacion');
  CREATE TYPE "public"."enum_landing_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__landing_v_version_secciones_tipo" AS ENUM('hero', 'quienes', 'niveles', 'entrenadores', 'galeria', 'torneos', 'planes', 'testimonios', 'faq', 'ubicacion');
  CREATE TYPE "public"."enum__landing_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "niveles_horarios" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"dia" "enum_niveles_horarios_dia",
  	"hora_inicio" varchar,
  	"hora_fin" varchar
  );
  
  CREATE TABLE "niveles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"nombre" varchar,
  	"descripcion" varchar,
  	"edades" varchar,
  	"cupo_disponible" varchar,
  	"destacado" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_niveles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_niveles_v_version_horarios" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"dia" "enum__niveles_v_version_horarios_dia",
  	"hora_inicio" varchar,
  	"hora_fin" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_niveles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_nombre" varchar,
  	"version_descripcion" varchar,
  	"version_edades" varchar,
  	"version_cupo_disponible" varchar,
  	"version_destacado" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__niveles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "entrenadores" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"nombre" varchar,
  	"cargo" varchar,
  	"foto_id" integer,
  	"bio" varchar,
  	"certificaciones" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_entrenadores_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_entrenadores_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_nombre" varchar,
  	"version_cargo" varchar,
  	"version_foto_id" integer,
  	"version_bio" varchar,
  	"version_certificaciones" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__entrenadores_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "galeria" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"imagen_id" integer NOT NULL,
  	"titulo" varchar NOT NULL,
  	"categoria" "enum_galeria_categoria" DEFAULT 'clases',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "torneos_resultados" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"categoria" varchar,
  	"campeon" varchar,
  	"subcampeon" varchar,
  	"tercero" varchar
  );
  
  CREATE TABLE "torneos_fotos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"imagen_id" integer
  );
  
  CREATE TABLE "torneos" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"slug" varchar,
  	"estado" "enum_torneos_estado" DEFAULT 'proximo',
  	"fecha_inicio" timestamp(3) with time zone,
  	"fecha_fin" timestamp(3) with time zone,
  	"fecha_texto" varchar,
  	"categoria" varchar,
  	"lugar" varchar,
  	"resumen" varchar,
  	"descripcion" jsonb,
  	"afiche_id" integer,
  	"costo" varchar,
  	"inscripcion_tipo" "enum_torneos_inscripcion_tipo" DEFAULT 'whatsapp',
  	"inscripcion_url" varchar,
  	"mensaje_whats_app" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_torneos_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_torneos_v_version_resultados" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"categoria" varchar,
  	"campeon" varchar,
  	"subcampeon" varchar,
  	"tercero" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_torneos_v_version_fotos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"imagen_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_torneos_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_titulo" varchar,
  	"version_slug" varchar,
  	"version_estado" "enum__torneos_v_version_estado" DEFAULT 'proximo',
  	"version_fecha_inicio" timestamp(3) with time zone,
  	"version_fecha_fin" timestamp(3) with time zone,
  	"version_fecha_texto" varchar,
  	"version_categoria" varchar,
  	"version_lugar" varchar,
  	"version_resumen" varchar,
  	"version_descripcion" jsonb,
  	"version_afiche_id" integer,
  	"version_costo" varchar,
  	"version_inscripcion_tipo" "enum__torneos_v_version_inscripcion_tipo" DEFAULT 'whatsapp',
  	"version_inscripcion_url" varchar,
  	"version_mensaje_whats_app" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__torneos_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "testimonios" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"nombre" varchar,
  	"detalle" varchar,
  	"texto" varchar,
  	"estrellas" numeric DEFAULT 5,
  	"foto_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_testimonios_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_testimonios_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_nombre" varchar,
  	"version_detalle" varchar,
  	"version_texto" varchar,
  	"version_estrellas" numeric DEFAULT 5,
  	"version_foto_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__testimonios_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "planes_caracteristicas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"texto" varchar
  );
  
  CREATE TABLE "planes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"nombre" varchar,
  	"precio" varchar,
  	"periodo" varchar,
  	"descripcion" varchar,
  	"destacado" boolean DEFAULT false,
  	"cta_texto" varchar DEFAULT 'Quiero este plan',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_planes_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_planes_v_version_caracteristicas" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"texto" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_planes_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_nombre" varchar,
  	"version_precio" varchar,
  	"version_periodo" varchar,
  	"version_descripcion" varchar,
  	"version_destacado" boolean DEFAULT false,
  	"version_cta_texto" varchar DEFAULT 'Quiero este plan',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__planes_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "faq" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"pregunta" varchar,
  	"respuesta" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_faq_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_faq_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_pregunta" varchar,
  	"version_respuesta" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__faq_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"credito" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "mensajes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"telefono" varchar,
  	"email" varchar,
  	"mensaje" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre" varchar NOT NULL,
  	"rol" "enum_users_rol" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"niveles_id" integer,
  	"entrenadores_id" integer,
  	"galeria_id" integer,
  	"torneos_id" integer,
  	"testimonios_id" integer,
  	"planes_id" integer,
  	"faq_id" integer,
  	"media_id" integer,
  	"mensajes_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "configuracion_puntos_clave" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"descripcion" varchar
  );
  
  CREATE TABLE "configuracion_telefonos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"numero" varchar
  );
  
  CREATE TABLE "configuracion" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nombre_sitio" varchar DEFAULT 'Match Point Lima Norte',
  	"hero_etiqueta" varchar DEFAULT 'Academia de Tenis & Torneos',
  	"hero_titular" varchar,
  	"hero_subtitulo" varchar,
  	"hero_cta_texto" varchar DEFAULT 'Reserva tu clase de prueba',
  	"hero_imagen_id" integer,
  	"hero_video_id" integer,
  	"quienes_titulo" varchar DEFAULT 'Quiénes somos',
  	"quienes_texto" varchar,
  	"quienes_imagen_id" integer,
  	"whatsapp_numero" varchar DEFAULT '51916727470',
  	"whatsapp_mensaje" varchar DEFAULT 'Hola Match Point Lima Norte, quiero reservar una clase de prueba.',
  	"email" varchar,
  	"direccion" varchar DEFAULT 'Fuertes Hoyos, Rímac, Lima, Perú',
  	"referencia" varchar,
  	"mapa_embed_url" varchar,
  	"mapa_enlace" varchar,
  	"latitud" numeric,
  	"longitud" numeric,
  	"instagram" varchar DEFAULT 'https://www.instagram.com/matchpointlimanorte',
  	"tiktok" varchar DEFAULT 'https://www.tiktok.com/@matchpointlimanorte',
  	"facebook" varchar,
  	"youtube" varchar,
  	"logo_id" integer,
  	"icono_id" integer,
  	"color_primario" varchar DEFAULT '#0E2F55',
  	"color_acento" varchar DEFAULT '#DBDB11',
  	"seo_titulo" varchar DEFAULT 'Match Point Lima Norte | Academia de Tenis en Lima',
  	"seo_descripcion" varchar,
  	"og_imagen_id" integer,
  	"formulario_activo" boolean DEFAULT false,
  	"ga_id" varchar,
  	"_status" "enum_configuracion_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_configuracion_v_version_puntos_clave" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"titulo" varchar,
  	"descripcion" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_configuracion_v_version_telefonos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"numero" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_configuracion_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_nombre_sitio" varchar DEFAULT 'Match Point Lima Norte',
  	"version_hero_etiqueta" varchar DEFAULT 'Academia de Tenis & Torneos',
  	"version_hero_titular" varchar,
  	"version_hero_subtitulo" varchar,
  	"version_hero_cta_texto" varchar DEFAULT 'Reserva tu clase de prueba',
  	"version_hero_imagen_id" integer,
  	"version_hero_video_id" integer,
  	"version_quienes_titulo" varchar DEFAULT 'Quiénes somos',
  	"version_quienes_texto" varchar,
  	"version_quienes_imagen_id" integer,
  	"version_whatsapp_numero" varchar DEFAULT '51916727470',
  	"version_whatsapp_mensaje" varchar DEFAULT 'Hola Match Point Lima Norte, quiero reservar una clase de prueba.',
  	"version_email" varchar,
  	"version_direccion" varchar DEFAULT 'Fuertes Hoyos, Rímac, Lima, Perú',
  	"version_referencia" varchar,
  	"version_mapa_embed_url" varchar,
  	"version_mapa_enlace" varchar,
  	"version_latitud" numeric,
  	"version_longitud" numeric,
  	"version_instagram" varchar DEFAULT 'https://www.instagram.com/matchpointlimanorte',
  	"version_tiktok" varchar DEFAULT 'https://www.tiktok.com/@matchpointlimanorte',
  	"version_facebook" varchar,
  	"version_youtube" varchar,
  	"version_logo_id" integer,
  	"version_icono_id" integer,
  	"version_color_primario" varchar DEFAULT '#0E2F55',
  	"version_color_acento" varchar DEFAULT '#DBDB11',
  	"version_seo_titulo" varchar DEFAULT 'Match Point Lima Norte | Academia de Tenis en Lima',
  	"version_seo_descripcion" varchar,
  	"version_og_imagen_id" integer,
  	"version_formulario_activo" boolean DEFAULT false,
  	"version_ga_id" varchar,
  	"version__status" "enum__configuracion_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "landing_secciones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tipo" "enum_landing_secciones_tipo",
  	"visible" boolean DEFAULT true,
  	"etiqueta_menu" varchar,
  	"titulo" varchar,
  	"subtitulo" varchar
  );
  
  CREATE TABLE "landing" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_landing_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_landing_v_version_secciones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tipo" "enum__landing_v_version_secciones_tipo",
  	"visible" boolean DEFAULT true,
  	"etiqueta_menu" varchar,
  	"titulo" varchar,
  	"subtitulo" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_landing_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__landing_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  ALTER TABLE "niveles_horarios" ADD CONSTRAINT "niveles_horarios_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."niveles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_niveles_v_version_horarios" ADD CONSTRAINT "_niveles_v_version_horarios_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_niveles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_niveles_v" ADD CONSTRAINT "_niveles_v_parent_id_niveles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."niveles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "entrenadores" ADD CONSTRAINT "entrenadores_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_entrenadores_v" ADD CONSTRAINT "_entrenadores_v_parent_id_entrenadores_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."entrenadores"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_entrenadores_v" ADD CONSTRAINT "_entrenadores_v_version_foto_id_media_id_fk" FOREIGN KEY ("version_foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "galeria" ADD CONSTRAINT "galeria_imagen_id_media_id_fk" FOREIGN KEY ("imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "torneos_resultados" ADD CONSTRAINT "torneos_resultados_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."torneos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "torneos_fotos" ADD CONSTRAINT "torneos_fotos_imagen_id_media_id_fk" FOREIGN KEY ("imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "torneos_fotos" ADD CONSTRAINT "torneos_fotos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."torneos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "torneos" ADD CONSTRAINT "torneos_afiche_id_media_id_fk" FOREIGN KEY ("afiche_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_torneos_v_version_resultados" ADD CONSTRAINT "_torneos_v_version_resultados_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_torneos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_torneos_v_version_fotos" ADD CONSTRAINT "_torneos_v_version_fotos_imagen_id_media_id_fk" FOREIGN KEY ("imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_torneos_v_version_fotos" ADD CONSTRAINT "_torneos_v_version_fotos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_torneos_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_torneos_v" ADD CONSTRAINT "_torneos_v_parent_id_torneos_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."torneos"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_torneos_v" ADD CONSTRAINT "_torneos_v_version_afiche_id_media_id_fk" FOREIGN KEY ("version_afiche_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonios" ADD CONSTRAINT "testimonios_foto_id_media_id_fk" FOREIGN KEY ("foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonios_v" ADD CONSTRAINT "_testimonios_v_parent_id_testimonios_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."testimonios"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonios_v" ADD CONSTRAINT "_testimonios_v_version_foto_id_media_id_fk" FOREIGN KEY ("version_foto_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "planes_caracteristicas" ADD CONSTRAINT "planes_caracteristicas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."planes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_planes_v_version_caracteristicas" ADD CONSTRAINT "_planes_v_version_caracteristicas_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_planes_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_planes_v" ADD CONSTRAINT "_planes_v_parent_id_planes_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."planes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_faq_v" ADD CONSTRAINT "_faq_v_parent_id_faq_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faq"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_niveles_fk" FOREIGN KEY ("niveles_id") REFERENCES "public"."niveles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_entrenadores_fk" FOREIGN KEY ("entrenadores_id") REFERENCES "public"."entrenadores"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_galeria_fk" FOREIGN KEY ("galeria_id") REFERENCES "public"."galeria"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_torneos_fk" FOREIGN KEY ("torneos_id") REFERENCES "public"."torneos"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonios_fk" FOREIGN KEY ("testimonios_id") REFERENCES "public"."testimonios"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_planes_fk" FOREIGN KEY ("planes_id") REFERENCES "public"."planes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faq_fk" FOREIGN KEY ("faq_id") REFERENCES "public"."faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_mensajes_fk" FOREIGN KEY ("mensajes_id") REFERENCES "public"."mensajes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "configuracion_puntos_clave" ADD CONSTRAINT "configuracion_puntos_clave_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."configuracion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "configuracion_telefonos" ADD CONSTRAINT "configuracion_telefonos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."configuracion"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "configuracion" ADD CONSTRAINT "configuracion_hero_imagen_id_media_id_fk" FOREIGN KEY ("hero_imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "configuracion" ADD CONSTRAINT "configuracion_hero_video_id_media_id_fk" FOREIGN KEY ("hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "configuracion" ADD CONSTRAINT "configuracion_quienes_imagen_id_media_id_fk" FOREIGN KEY ("quienes_imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "configuracion" ADD CONSTRAINT "configuracion_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "configuracion" ADD CONSTRAINT "configuracion_icono_id_media_id_fk" FOREIGN KEY ("icono_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "configuracion" ADD CONSTRAINT "configuracion_og_imagen_id_media_id_fk" FOREIGN KEY ("og_imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_configuracion_v_version_puntos_clave" ADD CONSTRAINT "_configuracion_v_version_puntos_clave_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_configuracion_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_configuracion_v_version_telefonos" ADD CONSTRAINT "_configuracion_v_version_telefonos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_configuracion_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_configuracion_v" ADD CONSTRAINT "_configuracion_v_version_hero_imagen_id_media_id_fk" FOREIGN KEY ("version_hero_imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_configuracion_v" ADD CONSTRAINT "_configuracion_v_version_hero_video_id_media_id_fk" FOREIGN KEY ("version_hero_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_configuracion_v" ADD CONSTRAINT "_configuracion_v_version_quienes_imagen_id_media_id_fk" FOREIGN KEY ("version_quienes_imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_configuracion_v" ADD CONSTRAINT "_configuracion_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_configuracion_v" ADD CONSTRAINT "_configuracion_v_version_icono_id_media_id_fk" FOREIGN KEY ("version_icono_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_configuracion_v" ADD CONSTRAINT "_configuracion_v_version_og_imagen_id_media_id_fk" FOREIGN KEY ("version_og_imagen_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "landing_secciones" ADD CONSTRAINT "landing_secciones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."landing"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_landing_v_version_secciones" ADD CONSTRAINT "_landing_v_version_secciones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_landing_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "niveles_horarios_order_idx" ON "niveles_horarios" USING btree ("_order");
  CREATE INDEX "niveles_horarios_parent_id_idx" ON "niveles_horarios" USING btree ("_parent_id");
  CREATE INDEX "niveles__order_idx" ON "niveles" USING btree ("_order");
  CREATE INDEX "niveles_updated_at_idx" ON "niveles" USING btree ("updated_at");
  CREATE INDEX "niveles_created_at_idx" ON "niveles" USING btree ("created_at");
  CREATE INDEX "niveles__status_idx" ON "niveles" USING btree ("_status");
  CREATE INDEX "_niveles_v_version_horarios_order_idx" ON "_niveles_v_version_horarios" USING btree ("_order");
  CREATE INDEX "_niveles_v_version_horarios_parent_id_idx" ON "_niveles_v_version_horarios" USING btree ("_parent_id");
  CREATE INDEX "_niveles_v_parent_idx" ON "_niveles_v" USING btree ("parent_id");
  CREATE INDEX "_niveles_v_version_version__order_idx" ON "_niveles_v" USING btree ("version__order");
  CREATE INDEX "_niveles_v_version_version_updated_at_idx" ON "_niveles_v" USING btree ("version_updated_at");
  CREATE INDEX "_niveles_v_version_version_created_at_idx" ON "_niveles_v" USING btree ("version_created_at");
  CREATE INDEX "_niveles_v_version_version__status_idx" ON "_niveles_v" USING btree ("version__status");
  CREATE INDEX "_niveles_v_created_at_idx" ON "_niveles_v" USING btree ("created_at");
  CREATE INDEX "_niveles_v_updated_at_idx" ON "_niveles_v" USING btree ("updated_at");
  CREATE INDEX "_niveles_v_latest_idx" ON "_niveles_v" USING btree ("latest");
  CREATE INDEX "_niveles_v_autosave_idx" ON "_niveles_v" USING btree ("autosave");
  CREATE INDEX "entrenadores__order_idx" ON "entrenadores" USING btree ("_order");
  CREATE INDEX "entrenadores_foto_idx" ON "entrenadores" USING btree ("foto_id");
  CREATE INDEX "entrenadores_updated_at_idx" ON "entrenadores" USING btree ("updated_at");
  CREATE INDEX "entrenadores_created_at_idx" ON "entrenadores" USING btree ("created_at");
  CREATE INDEX "entrenadores__status_idx" ON "entrenadores" USING btree ("_status");
  CREATE INDEX "_entrenadores_v_parent_idx" ON "_entrenadores_v" USING btree ("parent_id");
  CREATE INDEX "_entrenadores_v_version_version__order_idx" ON "_entrenadores_v" USING btree ("version__order");
  CREATE INDEX "_entrenadores_v_version_version_foto_idx" ON "_entrenadores_v" USING btree ("version_foto_id");
  CREATE INDEX "_entrenadores_v_version_version_updated_at_idx" ON "_entrenadores_v" USING btree ("version_updated_at");
  CREATE INDEX "_entrenadores_v_version_version_created_at_idx" ON "_entrenadores_v" USING btree ("version_created_at");
  CREATE INDEX "_entrenadores_v_version_version__status_idx" ON "_entrenadores_v" USING btree ("version__status");
  CREATE INDEX "_entrenadores_v_created_at_idx" ON "_entrenadores_v" USING btree ("created_at");
  CREATE INDEX "_entrenadores_v_updated_at_idx" ON "_entrenadores_v" USING btree ("updated_at");
  CREATE INDEX "_entrenadores_v_latest_idx" ON "_entrenadores_v" USING btree ("latest");
  CREATE INDEX "_entrenadores_v_autosave_idx" ON "_entrenadores_v" USING btree ("autosave");
  CREATE INDEX "galeria__order_idx" ON "galeria" USING btree ("_order");
  CREATE INDEX "galeria_imagen_idx" ON "galeria" USING btree ("imagen_id");
  CREATE INDEX "galeria_updated_at_idx" ON "galeria" USING btree ("updated_at");
  CREATE INDEX "galeria_created_at_idx" ON "galeria" USING btree ("created_at");
  CREATE INDEX "torneos_resultados_order_idx" ON "torneos_resultados" USING btree ("_order");
  CREATE INDEX "torneos_resultados_parent_id_idx" ON "torneos_resultados" USING btree ("_parent_id");
  CREATE INDEX "torneos_fotos_order_idx" ON "torneos_fotos" USING btree ("_order");
  CREATE INDEX "torneos_fotos_parent_id_idx" ON "torneos_fotos" USING btree ("_parent_id");
  CREATE INDEX "torneos_fotos_imagen_idx" ON "torneos_fotos" USING btree ("imagen_id");
  CREATE UNIQUE INDEX "torneos_slug_idx" ON "torneos" USING btree ("slug");
  CREATE INDEX "torneos_afiche_idx" ON "torneos" USING btree ("afiche_id");
  CREATE INDEX "torneos_updated_at_idx" ON "torneos" USING btree ("updated_at");
  CREATE INDEX "torneos_created_at_idx" ON "torneos" USING btree ("created_at");
  CREATE INDEX "torneos__status_idx" ON "torneos" USING btree ("_status");
  CREATE INDEX "_torneos_v_version_resultados_order_idx" ON "_torneos_v_version_resultados" USING btree ("_order");
  CREATE INDEX "_torneos_v_version_resultados_parent_id_idx" ON "_torneos_v_version_resultados" USING btree ("_parent_id");
  CREATE INDEX "_torneos_v_version_fotos_order_idx" ON "_torneos_v_version_fotos" USING btree ("_order");
  CREATE INDEX "_torneos_v_version_fotos_parent_id_idx" ON "_torneos_v_version_fotos" USING btree ("_parent_id");
  CREATE INDEX "_torneos_v_version_fotos_imagen_idx" ON "_torneos_v_version_fotos" USING btree ("imagen_id");
  CREATE INDEX "_torneos_v_parent_idx" ON "_torneos_v" USING btree ("parent_id");
  CREATE INDEX "_torneos_v_version_version_slug_idx" ON "_torneos_v" USING btree ("version_slug");
  CREATE INDEX "_torneos_v_version_version_afiche_idx" ON "_torneos_v" USING btree ("version_afiche_id");
  CREATE INDEX "_torneos_v_version_version_updated_at_idx" ON "_torneos_v" USING btree ("version_updated_at");
  CREATE INDEX "_torneos_v_version_version_created_at_idx" ON "_torneos_v" USING btree ("version_created_at");
  CREATE INDEX "_torneos_v_version_version__status_idx" ON "_torneos_v" USING btree ("version__status");
  CREATE INDEX "_torneos_v_created_at_idx" ON "_torneos_v" USING btree ("created_at");
  CREATE INDEX "_torneos_v_updated_at_idx" ON "_torneos_v" USING btree ("updated_at");
  CREATE INDEX "_torneos_v_latest_idx" ON "_torneos_v" USING btree ("latest");
  CREATE INDEX "_torneos_v_autosave_idx" ON "_torneos_v" USING btree ("autosave");
  CREATE INDEX "testimonios__order_idx" ON "testimonios" USING btree ("_order");
  CREATE INDEX "testimonios_foto_idx" ON "testimonios" USING btree ("foto_id");
  CREATE INDEX "testimonios_updated_at_idx" ON "testimonios" USING btree ("updated_at");
  CREATE INDEX "testimonios_created_at_idx" ON "testimonios" USING btree ("created_at");
  CREATE INDEX "testimonios__status_idx" ON "testimonios" USING btree ("_status");
  CREATE INDEX "_testimonios_v_parent_idx" ON "_testimonios_v" USING btree ("parent_id");
  CREATE INDEX "_testimonios_v_version_version__order_idx" ON "_testimonios_v" USING btree ("version__order");
  CREATE INDEX "_testimonios_v_version_version_foto_idx" ON "_testimonios_v" USING btree ("version_foto_id");
  CREATE INDEX "_testimonios_v_version_version_updated_at_idx" ON "_testimonios_v" USING btree ("version_updated_at");
  CREATE INDEX "_testimonios_v_version_version_created_at_idx" ON "_testimonios_v" USING btree ("version_created_at");
  CREATE INDEX "_testimonios_v_version_version__status_idx" ON "_testimonios_v" USING btree ("version__status");
  CREATE INDEX "_testimonios_v_created_at_idx" ON "_testimonios_v" USING btree ("created_at");
  CREATE INDEX "_testimonios_v_updated_at_idx" ON "_testimonios_v" USING btree ("updated_at");
  CREATE INDEX "_testimonios_v_latest_idx" ON "_testimonios_v" USING btree ("latest");
  CREATE INDEX "_testimonios_v_autosave_idx" ON "_testimonios_v" USING btree ("autosave");
  CREATE INDEX "planes_caracteristicas_order_idx" ON "planes_caracteristicas" USING btree ("_order");
  CREATE INDEX "planes_caracteristicas_parent_id_idx" ON "planes_caracteristicas" USING btree ("_parent_id");
  CREATE INDEX "planes__order_idx" ON "planes" USING btree ("_order");
  CREATE INDEX "planes_updated_at_idx" ON "planes" USING btree ("updated_at");
  CREATE INDEX "planes_created_at_idx" ON "planes" USING btree ("created_at");
  CREATE INDEX "planes__status_idx" ON "planes" USING btree ("_status");
  CREATE INDEX "_planes_v_version_caracteristicas_order_idx" ON "_planes_v_version_caracteristicas" USING btree ("_order");
  CREATE INDEX "_planes_v_version_caracteristicas_parent_id_idx" ON "_planes_v_version_caracteristicas" USING btree ("_parent_id");
  CREATE INDEX "_planes_v_parent_idx" ON "_planes_v" USING btree ("parent_id");
  CREATE INDEX "_planes_v_version_version__order_idx" ON "_planes_v" USING btree ("version__order");
  CREATE INDEX "_planes_v_version_version_updated_at_idx" ON "_planes_v" USING btree ("version_updated_at");
  CREATE INDEX "_planes_v_version_version_created_at_idx" ON "_planes_v" USING btree ("version_created_at");
  CREATE INDEX "_planes_v_version_version__status_idx" ON "_planes_v" USING btree ("version__status");
  CREATE INDEX "_planes_v_created_at_idx" ON "_planes_v" USING btree ("created_at");
  CREATE INDEX "_planes_v_updated_at_idx" ON "_planes_v" USING btree ("updated_at");
  CREATE INDEX "_planes_v_latest_idx" ON "_planes_v" USING btree ("latest");
  CREATE INDEX "_planes_v_autosave_idx" ON "_planes_v" USING btree ("autosave");
  CREATE INDEX "faq__order_idx" ON "faq" USING btree ("_order");
  CREATE INDEX "faq_updated_at_idx" ON "faq" USING btree ("updated_at");
  CREATE INDEX "faq_created_at_idx" ON "faq" USING btree ("created_at");
  CREATE INDEX "faq__status_idx" ON "faq" USING btree ("_status");
  CREATE INDEX "_faq_v_parent_idx" ON "_faq_v" USING btree ("parent_id");
  CREATE INDEX "_faq_v_version_version__order_idx" ON "_faq_v" USING btree ("version__order");
  CREATE INDEX "_faq_v_version_version_updated_at_idx" ON "_faq_v" USING btree ("version_updated_at");
  CREATE INDEX "_faq_v_version_version_created_at_idx" ON "_faq_v" USING btree ("version_created_at");
  CREATE INDEX "_faq_v_version_version__status_idx" ON "_faq_v" USING btree ("version__status");
  CREATE INDEX "_faq_v_created_at_idx" ON "_faq_v" USING btree ("created_at");
  CREATE INDEX "_faq_v_updated_at_idx" ON "_faq_v" USING btree ("updated_at");
  CREATE INDEX "_faq_v_latest_idx" ON "_faq_v" USING btree ("latest");
  CREATE INDEX "_faq_v_autosave_idx" ON "_faq_v" USING btree ("autosave");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "mensajes_updated_at_idx" ON "mensajes" USING btree ("updated_at");
  CREATE INDEX "mensajes_created_at_idx" ON "mensajes" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_niveles_id_idx" ON "payload_locked_documents_rels" USING btree ("niveles_id");
  CREATE INDEX "payload_locked_documents_rels_entrenadores_id_idx" ON "payload_locked_documents_rels" USING btree ("entrenadores_id");
  CREATE INDEX "payload_locked_documents_rels_galeria_id_idx" ON "payload_locked_documents_rels" USING btree ("galeria_id");
  CREATE INDEX "payload_locked_documents_rels_torneos_id_idx" ON "payload_locked_documents_rels" USING btree ("torneos_id");
  CREATE INDEX "payload_locked_documents_rels_testimonios_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonios_id");
  CREATE INDEX "payload_locked_documents_rels_planes_id_idx" ON "payload_locked_documents_rels" USING btree ("planes_id");
  CREATE INDEX "payload_locked_documents_rels_faq_id_idx" ON "payload_locked_documents_rels" USING btree ("faq_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_mensajes_id_idx" ON "payload_locked_documents_rels" USING btree ("mensajes_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "configuracion_puntos_clave_order_idx" ON "configuracion_puntos_clave" USING btree ("_order");
  CREATE INDEX "configuracion_puntos_clave_parent_id_idx" ON "configuracion_puntos_clave" USING btree ("_parent_id");
  CREATE INDEX "configuracion_telefonos_order_idx" ON "configuracion_telefonos" USING btree ("_order");
  CREATE INDEX "configuracion_telefonos_parent_id_idx" ON "configuracion_telefonos" USING btree ("_parent_id");
  CREATE INDEX "configuracion_hero_imagen_idx" ON "configuracion" USING btree ("hero_imagen_id");
  CREATE INDEX "configuracion_hero_video_idx" ON "configuracion" USING btree ("hero_video_id");
  CREATE INDEX "configuracion_quienes_imagen_idx" ON "configuracion" USING btree ("quienes_imagen_id");
  CREATE INDEX "configuracion_logo_idx" ON "configuracion" USING btree ("logo_id");
  CREATE INDEX "configuracion_icono_idx" ON "configuracion" USING btree ("icono_id");
  CREATE INDEX "configuracion_og_imagen_idx" ON "configuracion" USING btree ("og_imagen_id");
  CREATE INDEX "configuracion__status_idx" ON "configuracion" USING btree ("_status");
  CREATE INDEX "_configuracion_v_version_puntos_clave_order_idx" ON "_configuracion_v_version_puntos_clave" USING btree ("_order");
  CREATE INDEX "_configuracion_v_version_puntos_clave_parent_id_idx" ON "_configuracion_v_version_puntos_clave" USING btree ("_parent_id");
  CREATE INDEX "_configuracion_v_version_telefonos_order_idx" ON "_configuracion_v_version_telefonos" USING btree ("_order");
  CREATE INDEX "_configuracion_v_version_telefonos_parent_id_idx" ON "_configuracion_v_version_telefonos" USING btree ("_parent_id");
  CREATE INDEX "_configuracion_v_version_version_hero_imagen_idx" ON "_configuracion_v" USING btree ("version_hero_imagen_id");
  CREATE INDEX "_configuracion_v_version_version_hero_video_idx" ON "_configuracion_v" USING btree ("version_hero_video_id");
  CREATE INDEX "_configuracion_v_version_version_quienes_imagen_idx" ON "_configuracion_v" USING btree ("version_quienes_imagen_id");
  CREATE INDEX "_configuracion_v_version_version_logo_idx" ON "_configuracion_v" USING btree ("version_logo_id");
  CREATE INDEX "_configuracion_v_version_version_icono_idx" ON "_configuracion_v" USING btree ("version_icono_id");
  CREATE INDEX "_configuracion_v_version_version_og_imagen_idx" ON "_configuracion_v" USING btree ("version_og_imagen_id");
  CREATE INDEX "_configuracion_v_version_version__status_idx" ON "_configuracion_v" USING btree ("version__status");
  CREATE INDEX "_configuracion_v_created_at_idx" ON "_configuracion_v" USING btree ("created_at");
  CREATE INDEX "_configuracion_v_updated_at_idx" ON "_configuracion_v" USING btree ("updated_at");
  CREATE INDEX "_configuracion_v_latest_idx" ON "_configuracion_v" USING btree ("latest");
  CREATE INDEX "_configuracion_v_autosave_idx" ON "_configuracion_v" USING btree ("autosave");
  CREATE INDEX "landing_secciones_order_idx" ON "landing_secciones" USING btree ("_order");
  CREATE INDEX "landing_secciones_parent_id_idx" ON "landing_secciones" USING btree ("_parent_id");
  CREATE INDEX "landing__status_idx" ON "landing" USING btree ("_status");
  CREATE INDEX "_landing_v_version_secciones_order_idx" ON "_landing_v_version_secciones" USING btree ("_order");
  CREATE INDEX "_landing_v_version_secciones_parent_id_idx" ON "_landing_v_version_secciones" USING btree ("_parent_id");
  CREATE INDEX "_landing_v_version_version__status_idx" ON "_landing_v" USING btree ("version__status");
  CREATE INDEX "_landing_v_created_at_idx" ON "_landing_v" USING btree ("created_at");
  CREATE INDEX "_landing_v_updated_at_idx" ON "_landing_v" USING btree ("updated_at");
  CREATE INDEX "_landing_v_latest_idx" ON "_landing_v" USING btree ("latest");
  CREATE INDEX "_landing_v_autosave_idx" ON "_landing_v" USING btree ("autosave");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "niveles_horarios" CASCADE;
  DROP TABLE "niveles" CASCADE;
  DROP TABLE "_niveles_v_version_horarios" CASCADE;
  DROP TABLE "_niveles_v" CASCADE;
  DROP TABLE "entrenadores" CASCADE;
  DROP TABLE "_entrenadores_v" CASCADE;
  DROP TABLE "galeria" CASCADE;
  DROP TABLE "torneos_resultados" CASCADE;
  DROP TABLE "torneos_fotos" CASCADE;
  DROP TABLE "torneos" CASCADE;
  DROP TABLE "_torneos_v_version_resultados" CASCADE;
  DROP TABLE "_torneos_v_version_fotos" CASCADE;
  DROP TABLE "_torneos_v" CASCADE;
  DROP TABLE "testimonios" CASCADE;
  DROP TABLE "_testimonios_v" CASCADE;
  DROP TABLE "planes_caracteristicas" CASCADE;
  DROP TABLE "planes" CASCADE;
  DROP TABLE "_planes_v_version_caracteristicas" CASCADE;
  DROP TABLE "_planes_v" CASCADE;
  DROP TABLE "faq" CASCADE;
  DROP TABLE "_faq_v" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "mensajes" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "configuracion_puntos_clave" CASCADE;
  DROP TABLE "configuracion_telefonos" CASCADE;
  DROP TABLE "configuracion" CASCADE;
  DROP TABLE "_configuracion_v_version_puntos_clave" CASCADE;
  DROP TABLE "_configuracion_v_version_telefonos" CASCADE;
  DROP TABLE "_configuracion_v" CASCADE;
  DROP TABLE "landing_secciones" CASCADE;
  DROP TABLE "landing" CASCADE;
  DROP TABLE "_landing_v_version_secciones" CASCADE;
  DROP TABLE "_landing_v" CASCADE;
  DROP TYPE "public"."enum_niveles_horarios_dia";
  DROP TYPE "public"."enum_niveles_status";
  DROP TYPE "public"."enum__niveles_v_version_horarios_dia";
  DROP TYPE "public"."enum__niveles_v_version_status";
  DROP TYPE "public"."enum_entrenadores_status";
  DROP TYPE "public"."enum__entrenadores_v_version_status";
  DROP TYPE "public"."enum_galeria_categoria";
  DROP TYPE "public"."enum_torneos_estado";
  DROP TYPE "public"."enum_torneos_inscripcion_tipo";
  DROP TYPE "public"."enum_torneos_status";
  DROP TYPE "public"."enum__torneos_v_version_estado";
  DROP TYPE "public"."enum__torneos_v_version_inscripcion_tipo";
  DROP TYPE "public"."enum__torneos_v_version_status";
  DROP TYPE "public"."enum_testimonios_status";
  DROP TYPE "public"."enum__testimonios_v_version_status";
  DROP TYPE "public"."enum_planes_status";
  DROP TYPE "public"."enum__planes_v_version_status";
  DROP TYPE "public"."enum_faq_status";
  DROP TYPE "public"."enum__faq_v_version_status";
  DROP TYPE "public"."enum_users_rol";
  DROP TYPE "public"."enum_configuracion_status";
  DROP TYPE "public"."enum__configuracion_v_version_status";
  DROP TYPE "public"."enum_landing_secciones_tipo";
  DROP TYPE "public"."enum_landing_status";
  DROP TYPE "public"."enum__landing_v_version_secciones_tipo";
  DROP TYPE "public"."enum__landing_v_version_status";`)
}
