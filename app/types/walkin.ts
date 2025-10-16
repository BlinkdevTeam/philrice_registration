export type WalkinForm = {
  id?: number; // backend auto-generated
  unique_code?: string; // backend-generated or computed

  email: string;
  from_philrice?: boolean;
  submitting_paper?: boolean;
  joining_tour?: boolean;

  first_name: string;
  middle_name: string;
  last_name: string;
  name_extension: string;
  sex: "Male" | "Female" | "";
  age_bracket:
    | ""
    | "30 years old and below"
    | "31-45"
    | "46-59"
    | "60 years old and above";
  contact_number: string;
  indigenous_group: boolean;
  person_with_disability: boolean;

  company_name: string;
  company_address: string;
  region: string;
  affiliation_category: string;
  nature_of_work: string;
  designation_position: string;
  company_email_or_website: string;
  company_contact_number: string;

  field_of_specialization: string;
  registration_number: string;
  license_number: string;
  license_expiry_date: string;

  arrival_date: string;
  dietary_restrictions: boolean;
  
  inserted_at?: string; // ✅ timestamptz from Supabase (ISO string)
};
