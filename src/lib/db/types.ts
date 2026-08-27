/**
 * Database schema mapping types for Supabase / PostgreSQL
 */

export interface Database {
  public: {
    Tables: {
      sources: {
        Row: {
          id: string;
          name: string;
          authoritative_body: string;
          catalog_name: string | null;
          catalog_version: string | null;
          citation_url: string | null;
          doi: string | null;
          bibcode: string | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          authoritative_body: string;
          catalog_name?: string | null;
          catalog_version?: string | null;
          citation_url?: string | null;
          doi?: string | null;
          bibcode?: string | null;
          description?: string | null;
        };
      };
      celestial_objects: {
        Row: {
          id: string;
          slug: string;
          canonical_name: string;
          standard_designation: string | null;
          classification_code: string;
          parent_id: string | null;
          host_system_id: string | null;
          host_galaxy_id: string | null;
          mass_kg: number | null;
          mass_solar: number | null;
          mass_earth: number | null;
          mean_radius_km: number | null;
          surface_gravity_ms2: number | null;
          density_gcm3: number | null;
          mean_temperature_k: number | null;
          spectral_class: string | null;
          morphological_type: string | null;
          atmosphere_composition: unknown | null;
          right_ascension_deg: number | null;
          declination_deg: number | null;
          distance_light_years: number | null;
          distance_au: number | null;
          distance_km: number | null;
          semi_major_axis_au: number | null;
          eccentricity: number | null;
          orbital_period_days: number | null;
          inclination_deg: number | null;
          discovery_year: number | null;
          discovered_by: string | null;
          discovery_method: string | null;
          primary_source_id: string | null;
          summary: string | null;
          thumbnail_url: string | null;
          texture_url: string | null;
          is_featured: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      object_aliases: {
        Row: {
          id: string;
          object_id: string;
          alias_name: string;
          alias_type: string;
          source_id: string | null;
          created_at: string;
        };
      };
      missions: {
        Row: {
          id: string;
          slug: string;
          name: string;
          agency: string;
          status: string;
          launch_date: string | null;
          end_date: string | null;
          primary_target_id: string | null;
          objective: string | null;
          summary: string | null;
          source_id: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}
